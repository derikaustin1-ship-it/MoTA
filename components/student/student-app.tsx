"use client"

import { useMemo, useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  BookOpenCheck,
  Calendar,
  Check,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  GraduationCap,
  Home,
  IndianRupee,
  Info,
  LayoutDashboard,
  LoaderCircle,
  Pencil,
  RefreshCw,
  School,
  ShieldAlert,
  Sparkles,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react"
import type { Scholarship, StudentProfile } from "@/lib/app-types"
import { useApp } from "@/components/app/app-provider"
import { AppShell, InfoRow, SectionHeading, StatusBadge, type NavItem } from "@/components/app/shared"
import { applications, scholarships, students } from "@/lib/mock-data"
import { evaluateEligibility, getEligibleScholarships } from "@/lib/eligibility"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"

type StudentPage = "home" | "documents" | "scholarships" | "applications" | "notifications" | "profile" | "detail" | "apply" | "success" | "tracking"

export function StudentApp() {
  const { activeStudentId, studentNames, t } = useApp()
  const studentBase = students.find((item) => item.id === activeStudentId) ?? students[0]
  const student = { ...studentBase, name: studentNames[studentBase.id] ?? studentBase.name }
  const [page, setPage] = useState<StudentPage>("home")
  const [documentsFetched, setDocumentsFetched] = useState(false)
  const [fetchStep, setFetchStep] = useState("")
  const [checking, setChecking] = useState(false)
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null)
  const [submittedApplication, setSubmittedApplication] = useState(false)
  const [appliedScholarshipId, setAppliedScholarshipId] = useState<string | null>(
    applications.find((item) => item.studentId === student.id)?.scholarshipId ?? null
  )
  const [singleAppModalOpen, setSingleAppModalOpen] = useState(false)

  const activeAppliedScholarship = scholarships.find((s) => s.id === appliedScholarshipId)

  const eligible = useMemo(() => getEligibleScholarships(student, scholarships), [student])
  const navItems: NavItem[] = [
    { id: "home", label: t("home"), icon: Home },
    { id: "documents", label: t("documents"), icon: WalletCards },
    { id: "scholarships", label: t("scholarships"), icon: GraduationCap },
    { id: "applications", label: t("applications"), icon: ClipboardCheck },
    { id: "notifications", label: t("notifications"), icon: Bell },
    { id: "profile", label: t("profile"), icon: UserRound },
  ]

  async function fetchDocuments() {
    setDocumentsFetched(false)
    setChecking(false)
    for (const step of [t("connecting"), t("verifying"), t("fetching"), t("fetched")]) {
      setFetchStep(step)
      await new Promise((resolve) => setTimeout(resolve, 520))
    }
    setDocumentsFetched(true)
    setChecking(true)
    setFetchStep(t("checkingEligibility"))
    await new Promise((resolve) => setTimeout(resolve, 850))
    setChecking(false)
    setFetchStep("")
  }

  function openScholarship(scholarship: Scholarship) {
    setSelectedScholarship(scholarship)
    setPage("detail")
  }

  function handleAttemptApply(scholarship: Scholarship) {
    if (appliedScholarshipId && appliedScholarshipId !== scholarship.id) {
      setSingleAppModalOpen(true)
      return
    }
    setSelectedScholarship(scholarship)
    setPage("apply")
  }

  function navigate(next: string) {
    setPage(next as StudentPage)
  }

  const isFlowPage = ["detail", "apply", "success", "tracking"].includes(page)
  const headerTitle = isFlowPage ? selectedScholarship?.shortName ?? t("applications") : `${t("hello")}, ${student.name.split(" ")[0]} 👋`

  return (
    <AppShell
      title={headerTitle}
      subtitle={isFlowPage ? "2026–27 scholarship cycle" : `${student.course} · ${student.institution}`}
      activePage={page}
      onPageChange={navigate}
      navItems={navItems}
      initials={student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
    >
      {page === "home" && (
        <StudentHome
          student={student}
          documentsFetched={documentsFetched}
          fetchStep={fetchStep}
          checking={checking}
          eligible={eligible.map((item) => item.scholarship)}
          appliedScholarshipId={appliedScholarshipId}
          onFetch={fetchDocuments}
          onOpenScholarship={openScholarship}
          onApplyScholarship={handleAttemptApply}
        />
      )}
      {page === "documents" && <DocumentsPage student={student} fetched={documentsFetched} fetchStep={fetchStep} onFetch={fetchDocuments} />}
      {page === "scholarships" && (
        <ScholarshipsPage
          student={student}
          eligible={eligible.map((item) => item.scholarship)}
          unlocked={documentsFetched}
          appliedScholarshipId={appliedScholarshipId}
          onFetch={fetchDocuments}
          onOpen={openScholarship}
          onApply={handleAttemptApply}
        />
      )}
      {page === "applications" && (
        <ApplicationsPage
          student={student}
          appliedScholarship={activeAppliedScholarship ?? scholarships[1]}
          submitted={submittedApplication}
          onTrack={(scholarship) => {
            setSelectedScholarship(scholarship)
            setPage("tracking")
          }}
        />
      )}
      {page === "notifications" && <NotificationsPage />}
      {page === "profile" && <StudentProfilePage student={student} onHome={() => setPage("home")} />}
      {page === "detail" && selectedScholarship && (
        <ScholarshipDetail
          student={student}
          scholarship={selectedScholarship}
          isAlreadyAppliedToAnother={Boolean(appliedScholarshipId && appliedScholarshipId !== selectedScholarship.id)}
          appliedScholarshipName={activeAppliedScholarship?.name}
          onBack={() => setPage("scholarships")}
          onApply={() => handleAttemptApply(selectedScholarship)}
          onTrackExisting={() => {
            if (activeAppliedScholarship) {
              setSelectedScholarship(activeAppliedScholarship)
              setPage("tracking")
            }
          }}
        />
      )}
      {page === "apply" && selectedScholarship && (
        <ApplicationPreview
          student={student}
          scholarship={selectedScholarship}
          onBack={() => setPage("detail")}
          onSubmit={() => {
            setSubmittedApplication(true)
            setAppliedScholarshipId(selectedScholarship.id)
            setPage("success")
          }}
        />
      )}
      {page === "success" && selectedScholarship && <ApplicationSuccess scholarship={selectedScholarship} onDashboard={() => setPage("tracking")} />}
      {page === "tracking" && selectedScholarship && <ScholarshipDashboard student={student} scholarship={selectedScholarship} onBack={() => setPage("applications")} />}

      {/* Single Scholarship Restriction Modal */}
      <Dialog open={singleAppModalOpen} onOpenChange={setSingleAppModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
              <ShieldAlert className="size-6" />
            </div>
            <DialogTitle className="text-center">Single Scholarship Policy</DialogTitle>
            <DialogDescription className="text-center pt-1 text-sm text-foreground/80">
              You are already applied to <strong>{activeAppliedScholarship?.name ?? "another scholarship"}</strong>.
            </DialogDescription>
          </DialogHeader>

          <Alert variant="destructive" className="bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200">
            <Info className="size-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300 font-semibold">One Scholarship per Student</AlertTitle>
            <AlertDescription className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              Under National Ministry guidelines, one student is eligible to apply for and receive only one scholarship benefit at a time in an academic year.
            </AlertDescription>
          </Alert>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setSingleAppModalOpen(false)}>
              Close
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                setSingleAppModalOpen(false)
                if (activeAppliedScholarship) {
                  setSelectedScholarship(activeAppliedScholarship)
                  setPage("tracking")
                } else {
                  setPage("applications")
                }
              }}
            >
              <LayoutDashboard className="size-4 mr-1" />
              View Existing Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}

function StudentHome({
  student,
  documentsFetched,
  fetchStep,
  checking,
  eligible,
  appliedScholarshipId,
  onFetch,
  onOpenScholarship,
  onApplyScholarship,
}: {
  student: StudentProfile
  documentsFetched: boolean
  fetchStep: string
  checking: boolean
  eligible: Scholarship[]
  appliedScholarshipId: string | null
  onFetch: () => void
  onOpenScholarship: (scholarship: Scholarship) => void
  onApplyScholarship: (scholarship: Scholarship) => void
}) {
  const { t } = useApp()
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 md:hidden">
        <Avatar size="lg">
          <AvatarFallback>{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold">{student.name}</p>
          <p className="text-sm text-muted-foreground">ST · {student.state}</p>
        </div>
      </div>

      {appliedScholarshipId && (
        <Alert className="bg-primary/5 border-primary/20">
          <ClipboardCheck className="text-primary size-5" />
          <AlertTitle className="text-primary font-bold">Active Application on Record</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground mt-0.5">
            You have an application in progress. Note: One student can apply for only one scholarship at a time.
          </AlertDescription>
        </Alert>
      )}

      <Card className="overflow-hidden border-primary/20 bg-primary text-primary-foreground shadow-lg shadow-primary/10">
        <CardHeader>
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary-foreground/12">
            <WalletCards className="size-6" />
          </div>
          <CardTitle className="text-xl">{t("yourDocuments")}</CardTitle>
          <CardDescription className="text-primary-foreground/75">{t("documentsDesc")}</CardDescription>
        </CardHeader>
        <CardFooter className="border-primary-foreground/15 bg-primary-foreground/8">
          <Button variant="secondary" size="lg" className="h-11 w-full" onClick={onFetch} disabled={Boolean(fetchStep)}>
            {fetchStep ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : documentsFetched ? <RefreshCw data-icon="inline-start" /> : <Download data-icon="inline-start" />}
            {fetchStep || (documentsFetched ? "Refresh Documents" : t("fetchDocuments"))}
          </Button>
        </CardFooter>
      </Card>

      {documentsFetched && (
        <>
          <Alert>
            <CheckCircle2 />
            <AlertTitle>{t("fetched")}</AlertTitle>
            <AlertDescription>
              {student.documents.filter((item) => item.verified).length} verified records are ready for reuse. This is a mock DigiLocker connection.
            </AlertDescription>
          </Alert>
          {checking ? (
            <Card>
              <CardContent className="flex items-center gap-3 py-6">
                <LoaderCircle className="size-5 animate-spin text-primary" />
                <div>
                  <p className="font-semibold">{t("checkingEligibility")}</p>
                  <p className="text-sm text-muted-foreground">Matching verified profile data with demo scheme rules.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              <SectionHeading title={t("eligibleTitle")} description={`${t("demoRules")}. Final eligibility is determined only by the competent authority.`} />
              {eligible.map((scholarship, index) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  priority={index + 1}
                  appliedScholarshipId={appliedScholarshipId}
                  onOpen={() => onOpenScholarship(scholarship)}
                  onApply={() => onApplyScholarship(scholarship)}
                />
              ))}
              {!eligible.length && (
                <Alert>
                  <AlertCircle />
                  <AlertTitle>No full match found</AlertTitle>
                  <AlertDescription>Try another demo student profile to see different eligibility outcomes.</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </>
      )}

      {!documentsFetched && (
        <div className="grid grid-cols-2 gap-3">
          <QuickStat icon={BookOpenCheck} value="5" label="Scholarship schemes" />
          <QuickStat icon={Clock3} value="2 min" label="Typical demo journey" />
        </div>
      )}
    </div>
  )
}

function QuickStat({ icon: Icon, value, label }: { icon: typeof BookOpenCheck; value: string; label: string }) {
  return (
    <Card size="sm">
      <CardContent>
        <Icon className="mb-3 size-5 text-primary" />
        <p className="text-xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}

function DocumentsPage({ student, fetched, fetchStep, onFetch }: { student: StudentProfile; fetched: boolean; fetchStep: string; onFetch: () => void }) {
  const { t } = useApp()
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title={t("yourDocuments")} description="Verified records are reused across scholarship applications." action={<Badge variant="outline">Mock DigiLocker</Badge>} />
      {!fetched ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect your document wallet</CardTitle>
            <CardDescription>Fetch verified identity, community, income and academic records for this demonstration.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button size="lg" className="w-full" onClick={onFetch} disabled={Boolean(fetchStep)}>
              {fetchStep ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : <Download data-icon="inline-start" />}
              {fetchStep || t("fetchDocuments")}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {student.documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}
    </div>
  )
}

function DocumentCard({ document }: { document: StudentProfile["documents"][number] }) {
  const { t } = useApp()
  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
          <FileText className="size-5" />
        </div>
        <CardTitle className="text-sm">{document.name}</CardTitle>
        <CardDescription>
          {document.type}
          {document.optional ? " · If applicable" : ""}
        </CardDescription>
        <CardAction>
          {document.verified ? (
            <Badge>
              <Check data-icon="inline-start" />
              {t("verified")}
            </Badge>
          ) : (
            <Badge variant="outline">Not provided</Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          disabled={!document.verified}
          onClick={() => toast.add({ title: document.name, description: "Secure mock document preview opened.", type: "info" })}
        >
          {t("view")}
        </Button>
      </CardFooter>
    </Card>
  )
}

function ScholarshipsPage({
  student,
  eligible,
  unlocked,
  appliedScholarshipId,
  onFetch,
  onOpen,
  onApply,
}: {
  student: StudentProfile
  eligible: Scholarship[]
  unlocked: boolean
  appliedScholarshipId: string | null
  onFetch: () => void
  onOpen: (scholarship: Scholarship) => void
  onApply: (scholarship: Scholarship) => void
}) {
  const { t } = useApp()
  if (!unlocked)
    return (
      <div className="flex flex-col gap-5">
        <SectionHeading title={t("scholarships")} description="Fetch documents first so we can calculate accurate demo matches." />
        <Alert>
          <WalletCards />
          <AlertTitle>Document profile required</AlertTitle>
          <AlertDescription>Your verified mock data powers the eligibility engine.</AlertDescription>
        </Alert>
        <Button size="lg" className="h-11" onClick={onFetch}>
          {t("fetchDocuments")}
        </Button>
      </div>
    )
  return (
    <div className="flex flex-col gap-4">
      <SectionHeading title={t("scholarships")} description={`Showing national tribal scholarship schemes with verified eligibility criteria.`} />
      {scholarships.map((item, index) => (
        <ScholarshipCard
          key={item.id}
          scholarship={item}
          priority={index + 1}
          appliedScholarshipId={appliedScholarshipId}
          onOpen={() => onOpen(item)}
          onApply={() => onApply(item)}
        />
      ))}
    </div>
  )
}

function ScholarshipCard({
  scholarship,
  priority,
  appliedScholarshipId,
  onOpen,
  onApply,
}: {
  scholarship: Scholarship
  priority: number
  appliedScholarshipId: string | null
  onOpen: () => void
  onApply: () => void
}) {
  const { t } = useApp()
  const isAppliedThis = appliedScholarshipId === scholarship.id
  const isAppliedOther = appliedScholarshipId && appliedScholarshipId !== scholarship.id

  return (
    <Card className={cn(isAppliedThis && "border-primary shadow-md")}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
            <GraduationCap className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge>#{priority} {t("priority")}</Badge>
              {isAppliedThis ? (
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                  <Check className="size-3 mr-1" />
                  Applied
                </Badge>
              ) : isAppliedOther ? (
                <Badge variant="outline" className="text-amber-600 border-amber-300">
                  Single scheme limit applies
                </Badge>
              ) : (
                <Badge variant="outline">Open for Applications</Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-tight">{scholarship.name}</CardTitle>
            <CardDescription className="mt-1 leading-relaxed text-xs">{scholarship.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {/* Structured Criteria Badges Grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-xl border bg-muted/40 p-2.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category</span>
            <span className="mt-0.5 block text-xs font-semibold text-primary">{scholarship.category}</span>
          </div>
          <div className="rounded-xl border bg-muted/40 p-2.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Eligible Class</span>
            <span className="mt-0.5 block truncate text-xs font-semibold" title={scholarship.targetClass}>
              {scholarship.targetClass}
            </span>
          </div>
          <div className="rounded-xl border bg-muted/40 p-2.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Income Limit</span>
            <span className="mt-0.5 block text-xs font-semibold">{scholarship.incomeLimit}</span>
          </div>
          <div className="rounded-xl border bg-muted/40 p-2.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Timeline</span>
            <span className="mt-0.5 block truncate text-xs font-semibold" title={scholarship.timeline}>
              {scholarship.timeline}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-primary/5 px-3 py-2 text-xs">
          <span className="text-muted-foreground font-medium">{t("estimatedBenefit")}:</span>
          <span className="font-bold text-primary">{scholarship.benefit}</span>
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={onOpen}>
          {t("viewEligibility")}
        </Button>
        <Button
          onClick={onApply}
          variant={isAppliedThis ? "secondary" : "default"}
        >
          {isAppliedThis ? "View Status" : t("applyNow")}
        </Button>
      </CardFooter>
    </Card>
  )
}

function ScholarshipDetail({
  student,
  scholarship,
  isAlreadyAppliedToAnother,
  appliedScholarshipName,
  onBack,
  onApply,
  onTrackExisting,
}: {
  student: StudentProfile
  scholarship: Scholarship
  isAlreadyAppliedToAnother: boolean
  appliedScholarshipName?: string
  onBack: () => void
  onApply: () => void
  onTrackExisting: () => void
}) {
  const { t } = useApp()
  const result = evaluateEligibility(student, scholarship)

  return (
    <div className="flex flex-col gap-5">
      <Button variant="ghost" className="w-fit" onClick={onBack}>
        <ArrowLeft data-icon="inline-start" />
        {t("back")}
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="w-fit">{scholarship.shortName}</Badge>
            <Badge variant="outline">Category: {scholarship.category}</Badge>
          </div>
          <CardTitle className="text-xl mt-1">{scholarship.name}</CardTitle>
          <CardDescription className="leading-relaxed">{scholarship.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          {/* Detailed Criteria Tiles */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <InfoTile label="Category" value={scholarship.category} />
            <InfoTile label="Eligible Class" value={scholarship.targetClass} />
            <InfoTile label="Income Limit" value={scholarship.incomeLimit} />
            <InfoTile label="Timeline / Window" value={scholarship.timeline} />
          </div>

          {isAlreadyAppliedToAnother && (
            <Alert variant="destructive" className="bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200">
              <ShieldAlert className="size-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-300 font-semibold">Already Applied to Other Scholarship</AlertTitle>
              <AlertDescription className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                You have already submitted an application for <strong>{appliedScholarshipName ?? "another scholarship"}</strong>. Under national scheme rules, one student can apply for only one scholarship at a time.
              </AlertDescription>
            </Alert>
          )}

          <DetailList title={t("yourEligibility")} icon={CheckCircle2} items={result.reasons} positive />
          <DetailList title="Eligibility criteria" icon={BookOpenCheck} items={scholarship.criteria} />
          <DetailList title={t("requiredDocuments")} icon={FileCheck2} items={scholarship.requiredDocuments} />

          <div className="grid grid-cols-2 gap-3">
            <InfoTile label={t("benefits")} value={scholarship.benefit} />
            <InfoTile label={t("deadline")} value={scholarship.deadline} />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          {isAlreadyAppliedToAnother ? (
            <Button size="lg" className="h-11 w-full bg-amber-600 hover:bg-amber-700 text-white" onClick={onTrackExisting}>
              <LayoutDashboard className="size-4 mr-2" />
              Track Active Application ({appliedScholarshipName ?? "Existing Scheme"})
            </Button>
          ) : (
            <Button size="lg" className="h-11 w-full" onClick={onApply}>
              {t("applyNow")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

function DetailList({ title, icon: Icon, items, positive = false }: { title: string; icon: typeof CheckCircle2; items: string[]; positive?: boolean }) {
  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 font-bold">
        <Icon className="size-5 text-primary" />
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
            {positive ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> : <Circle className="mt-0.5 size-4 shrink-0" />}
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-bold leading-snug">{value}</p>
    </div>
  )
}

function ApplicationPreview({ student, scholarship, onBack, onSubmit }: { student: StudentProfile; scholarship: Scholarship; onBack: () => void; onSubmit: () => void }) {
  const { t } = useApp()
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fields = [
    ["Full Name", student.name],
    ["Date of Birth", student.dateOfBirth],
    ["Category", student.category],
    ["Annual Income", `₹${student.annualIncome.toLocaleString("en-IN")}`],
    ["College", student.institution],
    ["Course", student.course],
    ["Year", student.year],
    ["State", student.state],
  ]
  async function submit() {
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    onSubmit()
  }
  return (
    <div className="flex flex-col gap-5">
      <Button variant="ghost" className="w-fit" onClick={onBack}>
        <ArrowLeft data-icon="inline-start" />
        {t("back")}
      </Button>
      <SectionHeading title="Review your application" description="Most fields are securely pre-filled from your mock document wallet." />
      <Card>
        <CardHeader>
          <CardTitle>{scholarship.shortName} Application</CardTitle>
          <CardDescription>Academic year 2026–27 · Single Application Rule Active</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <FieldGroup>
            {fields.map(([label, value]) => (
              <Field key={label}>
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel>{label}</FieldLabel>
                  <Badge variant="outline">
                    <FileCheck2 data-icon="inline-start" />
                    {t("verifiedData")}
                  </Badge>
                </div>
                <Input value={value} disabled />
              </Field>
            ))}
          </FieldGroup>
          <Separator />
          <div>
            <h3 className="mb-3 font-bold">{t("requiredDocuments")}</h3>
            <div className="flex flex-col gap-2">
              {scholarship.requiredDocuments.map((document) => (
                <div key={document} className="flex items-center justify-between gap-3 rounded-xl border p-3 text-sm">
                  <span className="flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    {document}
                  </span>
                  <Badge variant="secondary">
                    <Check data-icon="inline-start" />
                    Attached
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <Field orientation="horizontal">
            <Checkbox id="confirm-application" checked={confirmed} onCheckedChange={(checked) => setConfirmed(Boolean(checked))} />
            <FieldContent>
              <FieldLabel htmlFor="confirm-application">{t("confirm")}</FieldLabel>
              <FieldDescription>I declare that I am applying for this scholarship only and do not have any other active scholarship application.</FieldDescription>
            </FieldContent>
          </Field>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="h-12 w-full uppercase" disabled={!confirmed || submitting} onClick={submit}>
            {submitting && <LoaderCircle className="animate-spin" data-icon="inline-start" />}
            {t("submit")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function ApplicationSuccess({ scholarship, onDashboard }: { scholarship: Scholarship; onDashboard: () => void }) {
  const { t } = useApp()
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 pt-6 text-center">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="size-10" />
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("submitted")}</h2>
        <p className="mt-2 text-muted-foreground">Your application has been securely saved in this demo.</p>
      </div>
      <Card className="text-left">
        <CardContent>
          <dl className="divide-y">
            <InfoRow label="Application ID" value="ST2026PM00124" />
            <InfoRow label="Scholarship" value={scholarship.shortName} />
            <InfoRow label="Application date" value="26 Sep 2026" />
            <InfoRow label={t("currentStatus")} value={<StatusBadge status="Submitted" />} />
            <InfoRow label="Next step" value="Document Verification" />
          </dl>
        </CardContent>
      </Card>
      <Button size="lg" className="h-12" onClick={onDashboard}>
        {t("viewDashboard")}
      </Button>
    </div>
  )
}

function ApplicationsPage({
  student,
  appliedScholarship,
  submitted,
  onTrack,
}: {
  student: StudentProfile
  appliedScholarship: Scholarship
  submitted: boolean
  onTrack: (scholarship: Scholarship) => void
}) {
  const { t } = useApp()
  const existing = applications.find((item) => item.studentId === student.id)
  if (!existing && !submitted)
    return (
      <div className="flex flex-col gap-5">
        <SectionHeading title={t("applications")} description="Track every scholarship application in one place." />
        <Card>
          <CardContent className="py-10 text-center">
            <ClipboardCheck className="mx-auto mb-3 size-9 text-muted-foreground" />
            <h3 className="font-bold">No applications yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Eligible schemes will appear after document verification.</p>
          </CardContent>
        </Card>
      </div>
    )
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title={t("applications")} description="Track verification, sanction and payment progress." />
      <Card>
        <CardHeader>
          <CardTitle>{appliedScholarship.name}</CardTitle>
          <CardDescription>Application ID · ST2026PM00124</CardDescription>
          <CardAction>
            <StatusBadge status={submitted ? "Submitted" : "Institution Verification"} />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Progress value={submitted ? 20 : 52} />
          <p className="mt-2 text-xs text-muted-foreground">
            {submitted ? "Application received. Document verification begins next." : "Institution verification is currently in progress."}
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => onTrack(appliedScholarship)}>
            <LayoutDashboard data-icon="inline-start" />
            {t("viewDashboard")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

const timelineSteps = ["Application Submitted", "Document Verification", "Institution Verification", "Sanction", "Disbursement"]

export function ScholarshipDashboard({ student, scholarship, onBack, familyStatus }: { student: StudentProfile; scholarship: Scholarship; onBack: () => void; familyStatus?: "Under Verification" | "Sanctioned" }) {
  const { t } = useApp()
  const [resolved, setResolved] = useState(false)
  const status = familyStatus ?? "Institution Verification"
  const completedThrough = status === "Sanctioned" ? 3 : 1
  return (
    <div className="flex flex-col gap-5">
      <Button variant="ghost" className="w-fit" onClick={onBack}>
        <ArrowLeft data-icon="inline-start" />
        {t("back")}
      </Button>
      <Card className="border-primary/20">
        <CardHeader>
          <CardDescription>Application ID · ST2026PM00124</CardDescription>
          <CardTitle>{scholarship.name}</CardTitle>
          <CardAction>
            <StatusBadge status={status} />
          </CardAction>
        </CardHeader>
        <CardContent>
          <ApplicationTimeline completedThrough={completedThrough} activeIndex={status === "Sanctioned" ? 3 : 2} />
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y">
              <InfoRow label="Application ID" value="ST2026PM00124" />
              <InfoRow label="Applied date" value="08 Sep 2026" />
              <InfoRow label="Scholarship" value={scholarship.shortName} />
              <InfoRow label="Academic year" value="2026–27" />
              <InfoRow label="Institution" value={student.institution} />
            </dl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("payment")}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y">
              <InfoRow label="Expected benefit" value={scholarship.benefit} />
              <InfoRow label="Payment status" value={status === "Sanctioned" ? "Payment scheduled" : "Not initiated"} />
              <InfoRow label="DBT status" value={status === "Sanctioned" ? "Bank account verified" : "Verification pending"} />
            </dl>
          </CardContent>
        </Card>
      </div>
      {!resolved && status !== "Sanctioned" && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>{t("deficiency")}</AlertTitle>
          <AlertDescription>Income Certificate needs attention. The uploaded certificate is nearing its validity date.</AlertDescription>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setResolved(true)
              toast.add({ title: "Deficiency resolved", description: "Updated mock Income Certificate attached.", type: "success" })
            }}
          >
            {t("resolve")}
          </Button>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>{t("documents")}</CardTitle>
          <CardDescription>Documents used for this application.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {student.documents.filter((item) => item.verified).slice(0, 6).map((document) => (
            <div key={document.id} className="flex items-center gap-2 rounded-xl border p-3 text-sm">
              <FileCheck2 className="size-4 text-primary" />
              <span className="flex-1">{document.name}</span>
              <CheckCircle2 className="size-4 text-primary" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function ApplicationTimeline({ completedThrough, activeIndex }: { completedThrough: number; activeIndex: number }) {
  return (
    <ol className="flex flex-col">
      {timelineSteps.map((step, index) => {
        const complete = index <= completedThrough
        const active = index === activeIndex
        return (
          <li key={step} className="relative flex min-h-16 gap-3 last:min-h-0">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border-2 bg-background",
                  complete && "border-primary bg-primary text-primary-foreground",
                  active && !complete && "border-primary text-primary"
                )}
              >
                {complete ? <Check className="size-4" /> : active ? <span className="size-2 rounded-full bg-primary" /> : <Circle className="size-3" />}
              </span>
              {index < timelineSteps.length - 1 && <span className={cn("h-full w-0.5", index < completedThrough ? "bg-primary" : "bg-border")} />}
            </div>
            <div className="pt-1">
              <p className={cn("text-sm font-medium", complete || active ? "text-foreground" : "text-muted-foreground")}>{step}</p>
              {active && <p className="mt-0.5 text-xs text-muted-foreground">Current stage</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function NotificationsPage() {
  const { localNotifications, t } = useApp()
  const items = localNotifications.filter((item) => item.audience === "student")
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title={t("notifications")} description="Application updates and actions that need your attention." />
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <Card key={item.id} size="sm" className={cn(!item.read && "border-primary/30")}>
            <CardHeader>
              <span className={cn("mt-0.5 size-2 rounded-full", item.read ? "bg-muted-foreground/30" : "bg-primary")} />
              <div>
                <CardTitle className="text-sm">{item.title}</CardTitle>
                <CardDescription className="mt-1">{item.message}</CardDescription>
              </div>
              <CardAction className="text-xs text-muted-foreground">{item.date}</CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

function StudentProfilePage({ student, onHome }: { student: StudentProfile; onHome: () => void }) {
  const { activeStudentId, setActiveStudentId, studentNames, updateStudentName, logout, t } = useApp()
  const [name, setName] = useState(student.name)
  const profiles = students.map((item) => ({ value: item.id, label: `${item.name} · ${item.course}` }))
  function save() {
    updateStudentName(student.id, name.trim() || student.name)
    toast.add({ title: "Profile updated", description: "The student name was saved locally.", type: "success" })
  }
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title={t("profile")} description="Manage your locally saved demo profile." />
      <Card>
        <CardHeader>
          <CardTitle>Demo student profile</CardTitle>
          <CardDescription>Switch profiles to demonstrate different eligibility outcomes.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Active demo student</FieldLabel>
              <Select
                items={profiles}
                value={activeStudentId}
                onValueChange={(value) => {
                  setActiveStudentId(value as string)
                  onHome()
                }}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectGroup>
                    {profiles.map((profile) => (
                      <SelectItem key={profile.value} value={profile.value}>
                        {profile.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="student-name">Name</FieldLabel>
                <Badge variant="outline">
                  <Pencil data-icon="inline-start" />
                  {t("edit")}
                </Badge>
              </div>
              <Input id="student-name" value={name} onChange={(event) => setName(event.target.value)} />
            </Field>
          </FieldGroup>
          <Separator className="my-5" />
          <dl className="divide-y">
            <InfoRow label="Phone" value={`+91 ${student.phone}`} />
            <InfoRow label="Category" value={student.category} />
            <InfoRow label="College" value={student.institution} />
            <InfoRow label="Course" value={student.course} />
            <InfoRow label="Year" value={student.year} />
            <InfoRow label="State" value={student.state} />
          </dl>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full" onClick={save}>
            {t("save")}
          </Button>
          <Button variant="outline" className="w-full" onClick={logout}>
            {t("logout")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
