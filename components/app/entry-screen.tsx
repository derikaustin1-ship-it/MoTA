"use client"

import { useState } from "react"
import { GraduationCap, ShieldCheck, Users, ArrowRight, LoaderCircle, LockKeyhole } from "lucide-react"
import type { Role } from "@/lib/app-types"
import { useApp } from "@/components/app/app-provider"
import { AppMark, LanguageSelector } from "@/components/app/shared"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

const roleOptions = [
  { id: "student" as const, icon: GraduationCap, titleKey: "student" as const, descKey: "studentDesc" as const },
  { id: "admin" as const, icon: ShieldCheck, titleKey: "admin" as const, descKey: "adminDesc" as const },
  { id: "family" as const, icon: Users, titleKey: "family" as const, descKey: "familyDesc" as const },
]

export function EntryScreen() {
  const { login, t } = useApp()
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top_right,var(--color-secondary),transparent_35%)] px-4 py-5 sm:py-8">
      <div className="mx-auto max-w-lg">
        <header className="mb-8 flex items-center justify-between gap-3">
          <AppMark />
          <LanguageSelector compact />
        </header>

        <section className="mb-6 rounded-3xl bg-primary px-6 py-7 text-primary-foreground shadow-lg shadow-primary/10">
          <Badge variant="secondary" className="mb-4">SIH 2026 Prototype</Badge>
          <h1 className="text-2xl font-bold leading-tight tracking-tight">{t("continue")}</h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-primary-foreground/75">One trusted place to discover, apply for and track tribal scholarship benefits.</p>
        </section>

        <div className="flex flex-col gap-3">
          {roleOptions.map((option) => {
            const Icon = option.icon
            const selected = selectedRole === option.id
            return (
              <Card key={option.id} className={cn("overflow-hidden transition-shadow", selected && "ring-2 ring-primary shadow-md")}>
                <button type="button" className="flex w-full items-center gap-4 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => setSelectedRole(selected ? null : option.id)} aria-expanded={selected}>
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary"><Icon className="size-6" aria-hidden="true" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{t(option.titleKey)}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{t(option.descKey)}</span>
                  </span>
                  <ArrowRight className={cn("size-5 text-muted-foreground transition-transform", selected && "rotate-90")} aria-hidden="true" />
                </button>
                {selected && <PhoneLogin role={option.id} onLogin={() => login(option.id)} />}
              </Card>
            )
          })}
        </div>

        <Alert className="mt-6">
          <LockKeyhole />
          <AlertTitle>{t("demoMode")}</AlertTitle>
          <AlertDescription>Prototype only. Authentication, government integrations, notifications and records use local mock data.</AlertDescription>
        </Alert>
      </div>
    </main>
  )
}

function PhoneLogin({ role, onLogin }: { role: Role; onLogin: () => void }) {
  const { t } = useApp()
  const [phone, setPhone] = useState("9876543210")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function sendOtp() {
    if (phone.replace(/\D/g, "").length !== 10) {
      setError("Enter a valid 10-digit mobile number")
      return
    }
    setError("")
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 550))
    setOtpSent(true)
    setLoading(false)
  }

  async function submitLogin() {
    if (otp !== "123456") {
      setError(t("invalidOtp"))
      return
    }
    setError("")
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 450))
    onLogin()
  }

  return (
    <CardContent className="border-t bg-muted/30 pt-4">
      <FieldGroup>
        <Field data-invalid={Boolean(error)}>
          <FieldLabel htmlFor={`phone-${role}`}>{t("phone")}</FieldLabel>
          <InputGroup className="h-11 bg-background">
            <InputGroupAddon>+91</InputGroupAddon>
            <InputGroupInput id={`phone-${role}`} inputMode="numeric" autoComplete="tel" maxLength={10} value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))} placeholder={t("mobile")} aria-invalid={Boolean(error)} />
          </InputGroup>
          <FieldDescription>We&apos;ll send a one-time password to this number.</FieldDescription>
        </Field>

        {!otpSent ? (
          <Button size="lg" className="h-11" onClick={sendOtp} disabled={loading}>
            {loading && <LoaderCircle className="animate-spin" data-icon="inline-start" />}
            {t("sendOtp")}
          </Button>
        ) : (
          <Field data-invalid={Boolean(error)}>
            <FieldLabel>{t("enterOtp")}</FieldLabel>
            <InputOTP maxLength={6} value={otp} onChange={setOtp} aria-invalid={Boolean(error)}>
              <InputOTPGroup className="w-full justify-between">
                {Array.from({ length: 6 }).map((_, index) => <InputOTPSlot key={index} index={index} className="size-11 rounded-lg border-l bg-background text-base first:rounded-lg last:rounded-lg" />)}
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="font-semibold text-primary">{t("demoOtp")}</FieldDescription>
            {error && <FieldError>{error}</FieldError>}
            <Button size="lg" className="mt-1 h-11" onClick={submitLogin} disabled={loading}>
              {loading && <LoaderCircle className="animate-spin" data-icon="inline-start" />}
              {t("login")}
            </Button>
          </Field>
        )}
      </FieldGroup>
    </CardContent>
  )
}
