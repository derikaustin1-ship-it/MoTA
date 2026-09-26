"use client"

import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  Search,
  Send,
  ShieldCheck,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react"
import type { ApplicationRecord, ApplicationStatus, Scholarship } from "@/lib/app-types"
import { useApp } from "@/components/app/app-provider"
import { AppShell, InfoRow, SectionHeading, StatusBadge, type NavItem } from "@/components/app/shared"
import { adminProfile, adminScholarshipStats, applications, eligibleNotApplied, scholarships, students } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"

type AdminPage = "dashboard" | "scholarships" | "applications" | "eligible" | "notifications" | "profile" | "scheme" | "application-detail"

const chartConfig = {
  pending: { label: "Pending", color: "var(--chart-2)" },
  sanctioned: { label: "Sanctioned", color: "var(--chart-1)" },
  rejected: { label: "Rejected", color: "var(--chart-4)" },
} satisfies ChartConfig

export function AdminApp() {
  const { t } = useApp()
  const [page, setPage] = useState<AdminPage>("dashboard")
  const [selectedScheme, setSelectedScheme] = useState<Scholarship | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRecord | null>(null)
  const navItems: NavItem[] = [
    { id: "dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { id: "scholarships", label: t("scholarships"), icon: GraduationCap },
    { id: "applications", label: t("applications"), icon: ClipboardList },
    { id: "eligible", label: t("eligibleStudents"), icon: UsersRound },
    { id: "notifications", label: t("notifications"), icon: Bell },
    { id: "profile", label: t("profile"), icon: UserRound },
  ]

  function openScheme(scholarship: Scholarship) { setSelectedScheme(scholarship); setPage("scheme") }
  function openApplication(application: ApplicationRecord) { setSelectedApplication(application); setPage("application-detail") }
  const title = page === "scheme" ? `${selectedScheme?.shortName} Applications` : page === "application-detail" ? "Application Review" : t("adminDashboard")

  return <AppShell title={title} subtitle="Tribal Welfare Department · 2026–27" activePage={page} onPageChange={(next) => setPage(next as AdminPage)} navItems={navItems} initials="KR">
    {page === "dashboard" && <AdminDashboard onOpenScheme={openScheme} />}
    {page === "scholarships" && <ScholarshipManagement onOpenScheme={openScheme} />}
    {page === "applications" && <ApplicationsDirectory onOpen={openApplication} />}
    {page === "eligible" && <EligibleStudentsPage />}
    {page === "notifications" && <AdminNotifications />}
    {page === "profile" && <AdminProfile />}
    {page === "scheme" && selectedScheme && <SchemeApplications scholarship={selectedScheme} onBack={() => setPage("scholarships")} onOpen={openApplication} />}
    {page === "application-detail" && selectedApplication && <AdminApplicationDetail application={selectedApplication} onBack={() => setPage("scheme")} />}
  </AppShell>
}

function AdminDashboard({ onOpenScheme }: { onOpenScheme: (scholarship: Scholarship) => void }) {
  const { t } = useApp()
  const summary = [
    { label: t("totalStudents"), value: "1,248", icon: UsersRound },
    { label: t("totalApplications"), value: "329", icon: ClipboardList },
    { label: t("pending"), value: "106", icon: FileCheck2 },
    { label: t("sanctioned"), value: "187", icon: CheckCircle2 },
    { label: t("rejected"), value: "36", icon: XCircle },
  ]
  return <div className="flex flex-col gap-6"><div className="grid grid-cols-2 gap-3 lg:grid-cols-5">{summary.map((item) => <AdminStat key={item.label} {...item} />)}</div><div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"><StatusChart /><Card><CardHeader><CardTitle>Review attention</CardTitle><CardDescription>Queues with the highest pending load.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3">{adminScholarshipStats.slice(0, 3).map((stat) => { const scholarship = scholarships.find((item) => item.id === stat.scholarshipId)!; return <button key={stat.scholarshipId} type="button" onClick={() => onOpenScheme(scholarship)} className="flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-muted"><span><span className="block font-semibold">{scholarship.shortName}</span><span className="text-xs text-muted-foreground">{stat.applications} applications</span></span><Badge variant="secondary">{stat.pending} pending</Badge></button>})}</CardContent></Card></div><ScholarshipManagement onOpenScheme={onOpenScheme} compact /></div>
}

function AdminStat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof UsersRound }) {
  return <Card size="sm"><CardContent><div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-secondary text-primary"><Icon className="size-4" /></div><p className="text-2xl font-bold tracking-tight">{value}</p><p className="text-xs text-muted-foreground">{label}</p></CardContent></Card>
}

function StatusChart() {
  const data = [
    { status: "Pre", pending: 31, sanctioned: 54, rejected: 9 },
    { status: "Post", pending: 42, sanctioned: 70, rejected: 16 },
    { status: "Top", pending: 18, sanctioned: 39, rejected: 5 },
    { status: "NFST", pending: 9, sanctioned: 16, rejected: 3 },
    { status: "NOS", pending: 6, sanctioned: 8, rejected: 3 },
  ]
  return <Card><CardHeader><CardTitle>Application status distribution</CardTitle><CardDescription>Scheme-wise application outcomes.</CardDescription></CardHeader><CardContent><ChartContainer config={chartConfig} className="h-64 w-full"><BarChart data={data} accessibilityLayer margin={{ left: 0, right: 4 }}><CartesianGrid vertical={false} /><XAxis dataKey="status" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} width={32} /><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="sanctioned" stackId="a" fill="var(--color-sanctioned)" radius={[0, 0, 3, 3]} /><Bar dataKey="pending" stackId="a" fill="var(--color-pending)" /><Bar dataKey="rejected" stackId="a" fill="var(--color-rejected)" radius={[3, 3, 0, 0]} /></BarChart></ChartContainer><div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">{Object.entries(chartConfig).map(([key, value]) => <span key={key} className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: value.color }} />{value.label}</span>)}</div></CardContent></Card>
}

function ScholarshipManagement({ onOpenScheme, compact = false }: { onOpenScheme: (scholarship: Scholarship) => void; compact?: boolean }) {
  const { t } = useApp()
  return <section className="flex flex-col gap-4"><SectionHeading title={t("scholarshipManagement")} description="Select a scheme to review applications and update decisions." /> <div className={cn("grid gap-4", compact ? "lg:grid-cols-2" : "md:grid-cols-2")}>{scholarships.map((scholarship) => { const stat = adminScholarshipStats.find((item) => item.scholarshipId === scholarship.id)!; return <Card key={scholarship.id}><CardHeader><span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary"><GraduationCap className="size-5" /></span><CardTitle>{scholarship.name}</CardTitle><CardDescription>{stat.applications} applications</CardDescription><CardAction><Badge variant="outline">2026–27</Badge></CardAction></CardHeader><CardContent><div className="mb-4 grid grid-cols-3 gap-2"><MiniStat label={t("pending")} value={stat.pending} /><MiniStat label={t("sanctioned")} value={stat.sanctioned} /><MiniStat label={t("rejected")} value={stat.rejected} /></div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Eligibility Criteria</p><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{scholarship.criteria.join(" · ")}</p></CardContent><CardFooter><Button className="w-full" onClick={() => onOpenScheme(scholarship)}>View applications</Button></CardFooter></Card>})}</div></section>
}

function MiniStat({ label, value }: { label: string; value: number }) { return <div className="rounded-xl bg-muted/60 p-2 text-center"><p className="font-bold">{value}</p><p className="truncate text-[11px] text-muted-foreground">{label}</p></div> }

function SchemeApplications({ scholarship, onBack, onOpen }: { scholarship: Scholarship; onBack: () => void; onOpen: (application: ApplicationRecord) => void }) {
  const { applicationStatuses, t } = useApp()
  const [query, setQuery] = useState("")
  const stat = adminScholarshipStats.find((item) => item.scholarshipId === scholarship.id)!
  const filtered = applications.filter((item) => `${item.studentName} ${item.id} ${item.college}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="flex flex-col gap-5"><Button variant="ghost" className="w-fit" onClick={onBack}><ArrowLeft data-icon="inline-start" />{t("back")}</Button><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><MiniSummary label="Total Registered" value={stat.applications} /><MiniSummary label={t("pending")} value={stat.pending} /><MiniSummary label={t("sanctioned")} value={stat.sanctioned} /><MiniSummary label={t("rejected")} value={stat.rejected} /></div><Field><FieldLabel htmlFor="application-search" className="sr-only">{t("search")}</FieldLabel><InputGroup className="h-11 bg-background"><InputGroupAddon><Search /></InputGroupAddon><InputGroupInput id="application-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search")} /></InputGroup></Field><div className="flex flex-col gap-3">{filtered.map((application) => <ApplicationRow key={application.id} application={{ ...application, scholarshipId: scholarship.id, status: applicationStatuses[application.id] ?? application.status }} onOpen={() => onOpen({ ...application, scholarshipId: scholarship.id })} />)}{!filtered.length && <Alert><Search /><AlertTitle>No matching applications</AlertTitle><AlertDescription>Try a student name, college or application ID.</AlertDescription></Alert>}</div></div>
}

function MiniSummary({ label, value }: { label: string; value: number }) { return <Card size="sm"><CardContent><p className="text-xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></CardContent></Card> }

function ApplicationRow({ application, onOpen }: { application: ApplicationRecord; onOpen: () => void }) {
  return <button type="button" onClick={onOpen} className="w-full rounded-2xl border bg-card p-4 text-left shadow-xs transition-colors hover:bg-muted/50"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-bold">{application.studentName}</p><p className="text-xs text-muted-foreground">{application.id}</p></div><StatusBadge status={application.status} /></div><div className="mt-3 grid grid-cols-2 gap-3 text-xs"><div><p className="text-muted-foreground">College</p><p className="mt-0.5 line-clamp-2 font-medium">{application.college}</p></div><div><p className="text-muted-foreground">Applied Date</p><p className="mt-0.5 font-medium">{application.appliedDate}</p></div></div></button>
}

function ApplicationsDirectory({ onOpen }: { onOpen: (application: ApplicationRecord) => void }) {
  const { applicationStatuses, t } = useApp()
  const [query, setQuery] = useState("")
  const filtered = applications.filter((item) => `${item.studentName} ${item.id}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="flex flex-col gap-5"><SectionHeading title={t("applications")} description="Search across all current scholarship applications." /><InputGroup className="h-11 bg-background"><InputGroupAddon><Search /></InputGroupAddon><InputGroupInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search")} /></InputGroup><div className="flex flex-col gap-3">{filtered.map((item) => <ApplicationRow key={item.id} application={{ ...item, status: applicationStatuses[item.id] ?? item.status }} onOpen={() => onOpen(item)} />)}</div></div>
}

function AdminApplicationDetail({ application, onBack }: { application: ApplicationRecord; onBack: () => void }) {
  const { applicationStatuses, updateApplicationStatus, t } = useApp()
  const status = applicationStatuses[application.id] ?? application.status
  const student = students.find((item) => item.id === application.studentId) ?? students[0]
  const scholarship = scholarships.find((item) => item.id === application.scholarshipId) ?? scholarships[1]
  const statusItems = ["Pending", "Sanctioned", "Rejected"].map((value) => ({ value, label: value }))
  function update(statusValue: string | null) { if (!statusValue) return; updateApplicationStatus(application.id, statusValue as ApplicationStatus); toast.add({ title: "Status updated", description: `${application.studentName}'s application is now ${statusValue}.`, type: "success" }) }
  return <div className="flex flex-col gap-5"><Button variant="ghost" className="w-fit" onClick={onBack}><ArrowLeft data-icon="inline-start" />{t("back")}</Button><Card><CardHeader><CardTitle>{application.studentName}</CardTitle><CardDescription>{application.id} · {scholarship.shortName}</CardDescription><CardAction><StatusBadge status={status} /></CardAction></CardHeader><CardContent className="flex flex-col gap-5"><div className="grid gap-4 md:grid-cols-2"><section><h3 className="mb-2 font-bold">Student information</h3><dl className="divide-y"><InfoRow label="Category" value="ST" /><InfoRow label="College" value={application.college} /><InfoRow label="Course" value={student.course} /><InfoRow label="Annual income" value={`₹${student.annualIncome.toLocaleString("en-IN")}`} /></dl></section><section><h3 className="mb-2 font-bold">Application information</h3><dl className="divide-y"><InfoRow label="Applied date" value={application.appliedDate} /><InfoRow label="Academic year" value={application.academicYear} /><InfoRow label="Scholarship" value={scholarship.name} /><InfoRow label="Eligibility" value={<Badge><CheckCircle2 data-icon="inline-start" />Matched</Badge>} /></dl></section></div><Separator /><section><h3 className="mb-3 font-bold">Documents</h3><div className="grid gap-2 sm:grid-cols-2">{student.documents.filter((item) => item.verified).slice(0, 6).map((document) => <div key={document.id} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><FileCheck2 className="size-4 text-primary" />{document.name}<CheckCircle2 className="ml-auto size-4 text-primary" /></div>)}</div></section><Alert><ShieldCheck /><AlertTitle>Demo eligibility verified</AlertTitle><AlertDescription>ST status, income, academic and institution conditions match the prototype criteria.</AlertDescription></Alert><FieldGroup><Field><FieldLabel>Application status</FieldLabel><Select items={statusItems} value={status} onValueChange={update}><SelectTrigger className="h-11 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{statusItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select></Field></FieldGroup></CardContent></Card></div>
}

function EligibleStudentsPage() {
  const { addNotification, t } = useApp()
  const [dialogOpen, setDialogOpen] = useState(false)
  function notify() { addNotification({ id: `admin-notify-${Date.now()}`, audience: "admin", title: "Notifications sent", message: "Notifications successfully sent to 12 eligible students.", date: "Just now", read: false }); setDialogOpen(false); toast.add({ title: "Notifications sent to 12 students", description: "Mock reminders were saved locally.", type: "success" }) }
  return <div className="flex flex-col gap-5"><SectionHeading title={t("notAppliedTitle")} description="Students who appear eligible for scholarship benefits but have not submitted an application." /><Card className="border-primary/20 bg-primary text-primary-foreground"><CardContent className="flex items-center justify-between gap-4 py-5"><div><p className="text-2xl font-bold">12 eligible students</p><p className="text-sm text-primary-foreground/75">have not applied</p></div><Dialog open={dialogOpen} onOpenChange={setDialogOpen}><Button variant="secondary" size="lg" onClick={() => setDialogOpen(true)}><Send data-icon="inline-start" />{t("notifyAll")}</Button><DialogContent><DialogHeader><DialogTitle>{t("notifyQuestion")}</DialogTitle><DialogDescription>A reminder will be recorded for all 12 students in this local prototype.</DialogDescription></DialogHeader><DialogFooter><DialogClose render={<Button variant="outline" />}>{t("cancel")}</DialogClose><Button onClick={notify}>{t("sendNotifications")}</Button></DialogFooter></DialogContent></Dialog></CardContent></Card><div className="grid gap-3 lg:grid-cols-2">{eligibleNotApplied.map((student) => <Card key={student.id} size="sm"><CardHeader><CardTitle>{student.name}</CardTitle><CardDescription>{student.education} · {student.college}</CardDescription><CardAction><Badge variant="outline">{student.status}</Badge></CardAction></CardHeader><CardContent><p className="text-xs text-muted-foreground">Eligible scholarship</p><p className="font-semibold">{student.scholarship}</p><p className="mt-2 text-xs text-muted-foreground">+91 {student.phone}</p></CardContent></Card>)}</div></div>
}

function AdminNotifications() {
  const { localNotifications, t } = useApp()
  const items = localNotifications.filter((item) => item.audience === "admin")
  return <div className="flex flex-col gap-5"><SectionHeading title={t("notifications")} description="Operational alerts and notification activity." /><div className="flex flex-col gap-3">{items.map((item) => <Card key={item.id} size="sm"><CardHeader><Bell className="mt-0.5 size-5 text-primary" /><div><CardTitle className="text-sm">{item.title}</CardTitle><CardDescription>{item.message}</CardDescription></div><CardAction className="text-xs text-muted-foreground">{item.date}</CardAction></CardHeader></Card>)}</div></div>
}

function AdminProfile() {
  const { logout, t } = useApp()
  return <div className="flex flex-col gap-5"><SectionHeading title={t("profile")} description="Administrator identity and department assignment." /><Card><CardHeader><div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary"><ShieldCheck className="size-6" /></div><CardTitle>{adminProfile.name}</CardTitle><CardDescription>{adminProfile.role}</CardDescription></CardHeader><CardContent><dl className="divide-y"><InfoRow label="Department" value={adminProfile.department} /><InfoRow label="Role" value={adminProfile.role} /><InfoRow label="Access" value="Scholarship administration" /></dl></CardContent><CardFooter><Button variant="outline" className="w-full" onClick={logout}>{t("logout")}</Button></CardFooter></Card></div>
}
