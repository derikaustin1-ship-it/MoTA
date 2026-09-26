import type { Scholarship, StudentProfile } from "@/lib/app-types"
import { scholarships as defaultScholarships } from "@/lib/mock-data"

const GEMINI_API_STORAGE_KEY = "tribal_scholarship_gemini_api_key"

export function getStoredGeminiKey(): string {
  if (typeof window !== "undefined") {
    const local = localStorage.getItem(GEMINI_API_STORAGE_KEY)
    if (local && local.trim()) return local.trim()
  }
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
}

export function setStoredGeminiKey(key: string): void {
  if (typeof window !== "undefined") {
    if (key.trim()) {
      localStorage.setItem(GEMINI_API_STORAGE_KEY, key.trim())
    } else {
      localStorage.removeItem(GEMINI_API_STORAGE_KEY)
    }
  }
}

export async function askGeminiChatbot({
  question,
  student,
  conversationHistory = [],
  language = "en",
  existingApplication,
}: {
  question: string
  student: StudentProfile
  conversationHistory?: Array<{ role: "user" | "assistant"; text: string }>
  language?: string
  existingApplication?: { id: string; scholarshipName: string; status: string } | null
}): Promise<string> {
  const apiKey = getStoredGeminiKey()
  if (!apiKey) {
    throw new Error("No Gemini API key configured.")
  }

  const systemPrompt = `You are JAGO, an empathetic, highly knowledgeable AI scholarship advisor for the Ministry of Tribal Affairs and state Tribal Welfare Departments in India.
You provide accurate, respectful, and crystal-clear guidance to tribal (ST) students and their families about government scholarship schemes.

CRITICAL SCHOLARSHIP CRITERIA RULES YOU MUST ALWAYS ACCURATELY EXPLAIN:
1. Pre Matric Scholarship for ST Students:
   - Category: ST (Scheduled Tribe only)
   - Class: 9th or 10th standard
   - Income Limit: Annual family income up to ₹2.5 Lakh per annum
   - Timeline/Window: June 1 – September 30
   - Benefit: Up to ₹12,000/year

2. Post-Matric Scholarship for ST Students:
   - Category: ST (Scheduled Tribe only)
   - Class: 11th, 12th & Post-Secondary / Higher Education degrees
   - Income Limit: Annual family income up to ₹2.5 Lakh per annum
   - Timeline/Window: June 1 – October 31
   - Benefit: Up to ₹48,000/year + maintenance allowance

3. National Scholarship for Higher Education (Top Class ST):
   - Category: ST (Scheduled Tribe only)
   - Class: Admitted to notified Premier Institutes (IITs, IIMs, NITs, AIIMS, NLU, etc.)
   - Income Limit: Annual family income up to ₹6.0 Lakh per annum
   - Timeline/Window: June 1 – October 31
   - Benefit: Full tuition fee + ₹3,000/month allowance + book grant

4. National Fellowship for Higher Education of ST Students (NFST):
   - Category: ST (Scheduled Tribe only)
   - Class / Qualification: Post-Graduation/Master's Degree with a minimum of 55% marks (pursuing M.Phil / Ph.D.)
   - Income Limit: NO LIMIT (No income ceiling applies)
   - Timeline/Window: June 1 – October 31
   - Benefit: JRF ₹37,000/mo | SRF ₹42,000/mo + HRA & contingency

5. National Overseas Scholarship for ST Students (NOS):
   - Category: ST (Scheduled Tribe only)
   - Class: Master's, Ph.D., or Post-Doctoral studies in foreign universities
   - Income Limit: Annual family income up to ₹6.0 Lakh per annum
   - Timeline/Window: Strict 30–45 days application window from notification
   - Benefit: Full international tuition fees + living allowance + return airfare

SINGLE SCHOLARSHIP POLICY:
- Under national guidelines, one student can apply for only ONE scholarship at a time in an academic year. If a student tries to apply for another, remind them that only one scholarship is allowed.

ACTIVE USER CONTEXT:
- Student Name: ${student.name}
- Category: ${student.category}
- Education: ${student.course} (${student.educationLevel})
- Institution: ${student.institution}
- Annual Family Income: ₹${student.annualIncome.toLocaleString("en-IN")}
- Academic Score: ${student.academicScore}%
- Premier Institute: ${student.topInstitution ? "Yes" : "No"}
- Active Application: ${existingApplication ? `${existingApplication.scholarshipName} (${existingApplication.id}) - Status: ${existingApplication.status}` : "None"}

INSTRUCTIONS:
- Respond in the language requested by user or preferred: ${language === "ta" ? "Tamil (தமிழ்)" : language === "hi" ? "Hindi (हिन्दी)" : language === "te" ? "Telugu (తెలుగు)" : "English"}.
- Be helpful, clear, and direct. Use bullet points where appropriate for document lists or eligibility checks.
`

  // Format messages for Gemini API
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = []

  // Add system prompt context as first user turn if needed, or directly in content
  contents.push({
    role: "user",
    parts: [{ text: `${systemPrompt}\n\nUser Question: ${question}` }],
  })

  const models = ["gemini-3.7-flash", "gemini-3.8-flash", "gemini-3.5-flash", "gemini-flash-latest", "gemini-2.5-pro"]
  let lastError: any = null

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const msg = errorData?.error?.message || `HTTP ${response.status} ${response.statusText}`
        throw new Error(msg)
      }

      const data = await response.json()
      const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (candidate) {
        return candidate.trim()
      }
    } catch (err: any) {
      lastError = err
      // If error is not a 404 model not found, still try fallback or rethrow
      console.warn(`Gemini model ${model} error:`, err?.message || err)
    }
  }

  throw lastError || new Error("Failed to get response from Gemini API.")
}
