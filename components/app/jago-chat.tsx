"use client"

import { useEffect, useMemo, useState } from "react"
import { Bot, Check, KeyRound, Loader2, Send, Settings, Sparkles } from "lucide-react"
import { useApp } from "@/components/app/app-provider"
import { applications, scholarships, students } from "@/lib/mock-data"
import { getEligibleScholarships } from "@/lib/eligibility"
import { askGeminiChatbot, getStoredGeminiKey, setStoredGeminiKey } from "@/lib/gemini"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Message, MessageContent } from "@/components/ui/message"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { MessageScroller, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "@/components/ui/message-scroller"
import { toast } from "@/components/ui/toast"

type ChatMessage = { id: string; role: "assistant" | "user"; text: string }

export function JagoChat({ pageContext = "home" }: { pageContext?: string }) {
  const { activeStudentId, applicationStatuses, language, role, t } = useApp()
  const [open, setOpen] = useState(false)
  const [keyDialogOpen, setKeyDialogOpen] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState("")
  const [activeKey, setActiveKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text:
        language === "ta"
          ? "வணக்கம்! உதவித்தொகை தகுதி, ஆவணங்கள் அல்லது விண்ணப்ப நிலை பற்றி என்னிடம் கேளுங்கள்."
          : language === "hi"
            ? "नमस्ते! छात्रवृत्ति पात्रता, आवश्यक दस्तावेज़ या आवेदन की स्थिति के बारे में मुझसे पूछें।"
            : language === "te"
              ? "నమస్తే! స్కాలర్‌షిప్ అర్హత, పత్రాలు లేదా దరఖాస్తు స్థితి గురించి నన్ను అడగండి."
              : "Hello! I am JAGO, your AI Tribal Scholarship Advisor. Ask me about scholarship eligibility criteria, deadlines, income limits, or application status.",
    },
  ])

  useEffect(() => {
    const key = getStoredGeminiKey()
    setActiveKey(key)
    setApiKeyInput(key)
  }, [open])

  const student = students.find((item) => item.id === activeStudentId) ?? students[0]
  const existingApp = applications.find((item) => item.studentId === student.id)
  const existingAppInfo = existingApp
    ? {
        id: existingApp.id,
        scholarshipName: scholarships.find((s) => s.id === existingApp.scholarshipId)?.name ?? "Post-Matric",
        status: applicationStatuses[existingApp.id] ?? existingApp.status,
      }
    : null

  const suggested = useMemo(
    () => [
      "What are the 5 tribal scholarships?",
      "What scholarships am I eligible for?",
      "What is the income limit for Post-Matric & Higher Education?",
      "Can I apply for more than one scholarship?",
    ],
    []
  )

  function getLocalFallbackResponse(question: string) {
    const query = question.toLowerCase()
    const eligible = getEligibleScholarships(student, scholarships)
    const status = existingAppInfo ? existingAppInfo.status : "No active application"

    if (query.includes("one") && (query.includes("more") || query.includes("multiple") || query.includes("apply"))) {
      return "Under national scheme guidelines, one student can apply for only ONE scholarship at a time in an academic year. If you already have an application in progress, the system will prevent duplicate submissions."
    }
    if (query.includes("5") || query.includes("schemes") || query.includes("all")) {
      return "Here are the 5 major ST scholarship schemes:\n1. Pre-Matric (Class 9-10, Income ≤ ₹2.5L, June 1-Sept 30)\n2. Post-Matric (Class 11-12 & College, Income ≤ ₹2.5L, June 1-Oct 31)\n3. National Scholarship for Higher Education (Premier institutes like IIT/IIM/NIT/AIIMS, Income ≤ ₹6.0L, June 1-Oct 31)\n4. National Fellowship (Post-Graduation min 55% marks / Ph.D., Income: No limit, June 1-Oct 31)\n5. National Overseas Scholarship (Master's/Ph.D./Post-Doc abroad, Income ≤ ₹6.0L, Strict 30-45 days window)"
    }
    if (query.includes("income") || query.includes("limit")) {
      return "Income Limits:\n• Pre-Matric & Post-Matric: Up to ₹2.5 Lakh/year\n• National Scholarship (Higher Education): Up to ₹6.0 Lakh/year\n• National Fellowship (NFST): No income limit\n• National Overseas (NOS): Up to ₹6.0 Lakh/year"
    }
    if (query.includes("eligible") || query.includes("eligibility")) {
      return eligible.length
        ? `${student.name} currently matches ${eligible.map((item) => item.scholarship.shortName).join(" and ")} under verified criteria. Check the Scholarships tab for full details.`
        : "This profile does not fully match a scheme under current criteria. Review unmet conditions on the eligibility screen."
    }
    if (query.includes("document")) {
      return `For ST scholarship schemes, keep your ST Community Certificate, Income Certificate, Aadhaar Identity, marksheet and institution proof ready. Verified DigiLocker records are reused automatically.`
    }
    if (query.includes("pending") || query.includes("status")) {
      return existingAppInfo
        ? `${student.name}'s application ${existingAppInfo.id} is currently “${status}”. You will receive updates as verification progresses.`
        : "You do not have any active applications submitted yet."
    }
    return `I can help you with eligibility criteria, income thresholds, deadlines, document requirements, and single-application policies. (Role: ${role ?? "public"}, Context: ${pageContext})`
  }

  async function submit(question = input) {
    const clean = question.trim()
    if (!clean || loading) return

    const userMsgId = `${Date.now()}-u`
    setMessages((current) => [...current, { id: userMsgId, role: "user", text: clean }])
    setInput("")

    const currentKey = getStoredGeminiKey()
    if (currentKey) {
      setLoading(true)
      try {
        const history = messages.map((m) => ({ role: m.role, text: m.text }))
        const reply = await askGeminiChatbot({
          question: clean,
          student,
          conversationHistory: history,
          language,
          existingApplication: existingAppInfo,
        })
        setMessages((current) => [...current, { id: `${Date.now()}-a`, role: "assistant", text: reply }])
      } catch (err: any) {
        console.warn("Gemini API error, falling back to local logic:", err)
        const fallback = getLocalFallbackResponse(clean)
        setMessages((current) => [
          ...current,
          {
            id: `${Date.now()}-a`,
            role: "assistant",
            text: `${fallback}\n\n*(Note: Gemini AI notice: ${err?.message || "Check API key or network connection"})*`,
          },
        ])
      } finally {
        setLoading(false)
      }
    } else {
      const fallback = getLocalFallbackResponse(clean)
      setMessages((current) => [...current, { id: `${Date.now()}-a`, role: "assistant", text: fallback }])
    }
  }

  function handleSaveKey() {
    setStoredGeminiKey(apiKeyInput)
    setActiveKey(apiKeyInput.trim())
    setKeyDialogOpen(false)
    toast.add({
      title: apiKeyInput.trim() ? "Gemini API Key Saved" : "API Key Cleared",
      description: apiKeyInput.trim()
        ? "JAGO will now use Google Gemini AI for intelligent scholarship counseling."
        : "JAGO will operate in local rule-based mode.",
      type: "success",
    })
  }

  return (
    <>
      <Button
        size="icon-lg"
        aria-label="Open JAGO scholarship assistant"
        className={`fixed right-4 z-40 size-14 rounded-full shadow-xl md:right-7 md:bottom-7 ${role ? "bottom-24" : "bottom-4"}`}
        onClick={() => setOpen(true)}
      >
        <Sparkles className="size-6" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
          <SheetHeader className="border-b p-4 pr-14">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Bot className="size-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <SheetTitle>JAGO</SheetTitle>
                    {activeKey ? (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-semibold py-0">
                        ⚡ Gemini AI
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] py-0">
                        Demo Mode
                      </Badge>
                    )}
                  </div>
                  <SheetDescription>{t("jagoSubtitle")}</SheetDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Gemini API Key Settings"
                onClick={() => setKeyDialogOpen(true)}
                className="text-muted-foreground hover:text-foreground"
                title="Configure Gemini API Key"
              >
                <KeyRound className="size-4" />
              </Button>
            </div>
          </SheetHeader>

          <MessageScrollerProvider>
            <MessageScroller className="flex-1">
              <MessageScrollerViewport>
                <MessageScrollerContent className="p-4">
                  {messages.map((message) => (
                    <MessageScrollerItem key={message.id}>
                      <Message align={message.role === "user" ? "end" : "start"}>
                        <MessageContent>
                          <Bubble variant={message.role === "user" ? "default" : "muted"} align={message.role === "user" ? "end" : "start"}>
                            <BubbleContent className="whitespace-pre-line text-sm leading-relaxed">{message.text}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                  {loading && (
                    <MessageScrollerItem key="loading">
                      <Message align="start">
                        <MessageContent>
                          <Bubble variant="muted" align="start">
                            <BubbleContent className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                              <Loader2 className="size-4 animate-spin text-primary" />
                              <span>JAGO is thinking with Gemini AI...</span>
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  )}
                </MessageScrollerContent>
              </MessageScrollerViewport>
            </MessageScroller>
          </MessageScrollerProvider>

          <div className="border-t p-4">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {suggested.map((question) => (
                <Button key={question} variant="outline" size="sm" className="shrink-0 text-xs" onClick={() => submit(question)} disabled={loading}>
                  {question}
                </Button>
              ))}
            </div>
            <InputGroup className="h-11">
              <InputGroupInput
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229) submit()
                }}
                placeholder={t("askJago")}
                aria-label={t("askJago")}
                disabled={loading}
              />
              <InputGroupAddon align="inline-end">
                <Button size="icon-sm" onClick={() => submit()} disabled={loading || !input.trim()} aria-label="Send message">
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Send />}
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </SheetContent>
      </Sheet>

      {/* Gemini API Key Dialog */}
      <Dialog open={keyDialogOpen} onOpenChange={setKeyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="size-5 text-primary" />
              Gemini API Key Settings
            </DialogTitle>
            <DialogDescription>
              Connect your Google Gemini API key to enable live AI reasoning, multilingual guidance, and instant scholarship answers.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="gemini-key-input">
              Google Gemini API Key
            </label>
            <Input
              id="gemini-key-input"
              type="password"
              placeholder="Paste AIzaSy... or AQ... API Key"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is saved locally in this browser or mobile app.
            </p>
          </div>

          <DialogFooter className="flex sm:justify-between gap-2">
            {apiKeyInput && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setApiKeyInput("")
                  setStoredGeminiKey("")
                  setActiveKey("")
                  toast.add({ title: "API Key Cleared", description: "Reverted to demo rules.", type: "info" })
                }}
              >
                Clear Key
              </Button>
            )}
            <Button size="sm" onClick={handleSaveKey}>
              <Check className="size-4 mr-1" />
              Save API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
