export type Role = "student" | "admin" | "family"
export type Language = "en" | "ta" | "hi" | "te"
export type ApplicationStatus =
  | "Pending"
  | "Submitted"
  | "Under Verification"
  | "Institution Verification"
  | "Sanctioned"
  | "Rejected"
  | "Disbursed"

export type DocumentRecord = {
  id: string
  name: string
  type: string
  verified: boolean
  optional?: boolean
}

export type StudentProfile = {
  id: string
  name: string
  phone: string
  category: "ST"
  dateOfBirth: string
  state: string
  annualIncome: number
  institution: string
  course: string
  year: string
  educationLevel: "school" | "undergraduate" | "postgraduate" | "research"
  academicScore: number
  topInstitution: boolean
  netJrf: boolean
  overseasIntent: boolean
  classLevel?: number
  documents: DocumentRecord[]
}

export type Scholarship = {
  id: string
  shortName: string
  name: string
  description: string
  benefit: string
  deadline: string
  priority: number
  category: string
  targetClass: string
  incomeLimit: string
  timeline: string
  criteria: string[]
  requiredDocuments: string[]
}

export type ApplicationRecord = {
  id: string
  studentId: string
  studentName: string
  scholarshipId: string
  college: string
  appliedDate: string
  academicYear: string
  status: ApplicationStatus
  expectedBenefit: string
  paymentStatus: string
  dbtStatus: string
  deficiency?: string
}

export type NotificationRecord = {
  id: string
  audience: Role
  title: string
  message: string
  date: string
  read: boolean
  childId?: string
}

export type FamilyProfile = {
  id: string
  parentName: string
  phone: string
  childIds: string[]
}
