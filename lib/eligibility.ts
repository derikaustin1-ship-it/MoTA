import type { Scholarship, StudentProfile } from "@/lib/app-types"

export type EligibilityResult = {
  scholarship: Scholarship
  eligible: boolean
  match: number
  reasons: string[]
  unmet: string[]
}

export function evaluateEligibility(student: StudentProfile, scholarship: Scholarship): EligibilityResult {
  const checks: Array<{ met: boolean; label: string }> = [
    { met: student.category === "ST", label: "ST category verified" },
  ]

  switch (scholarship.id) {
    case "pre-matric":
      checks.push(
        { met: student.educationLevel === "school" && [9, 10].includes(student.classLevel ?? 0), label: "Class: 9th or 10th standard verified" },
        { met: student.annualIncome <= 250000, label: "Income: Family income within ₹2.5 Lakh/yr limit" },
      )
      break
    case "post-matric":
      checks.push(
        { met: student.educationLevel !== "school" || [11, 12].includes(student.classLevel ?? 0), label: "Class: 11th, 12th or Post-Secondary course verified" },
        { met: student.annualIncome <= 250000, label: "Income: Family income within ₹2.5 Lakh/yr limit" },
        { met: student.academicScore >= 50, label: "Academic: Minimum qualifying score satisfied" },
      )
      break
    case "top-class":
      checks.push(
        { met: ["undergraduate", "postgraduate"].includes(student.educationLevel), label: "Higher education requirement satisfied" },
        { met: student.topInstitution, label: "Class / Institute: Admitted in premier institute (IIT/IIM/NIT/AIIMS)" },
        { met: student.annualIncome <= 600000, label: "Income: Family income within ₹6.0 Lakh/yr limit" },
      )
      break
    case "nfst":
      checks.push(
        { met: ["postgraduate", "research"].includes(student.educationLevel), label: "Class: Master's / M.Phil / Ph.D. programme verified" },
        { met: student.academicScore >= 55, label: "Class: Minimum 55% marks in Master's degree satisfied" },
      )
      break
    case "nos":
      checks.push(
        { met: ["postgraduate", "research"].includes(student.educationLevel), label: "Class: Master's, Ph.D. or Post-Doctoral candidate verified" },
        { met: student.overseasIntent, label: "Overseas admission intent verified" },
        { met: student.annualIncome <= 600000, label: "Income: Family income within ₹6.0 Lakh/yr limit" },
      )
      break
  }

  const metCount = checks.filter((check) => check.met).length
  return {
    scholarship,
    eligible: checks.every((check) => check.met),
    match: Math.round((metCount / checks.length) * 100),
    reasons: checks.filter((check) => check.met).map((check) => check.label),
    unmet: checks.filter((check) => !check.met).map((check) => check.label),
  }
}

export function getEligibleScholarships(student: StudentProfile, scholarships: Scholarship[]) {
  return scholarships
    .map((scholarship) => evaluateEligibility(student, scholarship))
    .filter((result) => result.eligible)
    .sort((a, b) => a.scholarship.priority - b.scholarship.priority || b.match - a.match)
}
