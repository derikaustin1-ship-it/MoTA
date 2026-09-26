"use client"

import { useState } from "react"
import { Bell, CheckCircle2, ClipboardCheck, GraduationCap, LayoutGrid, UserRound, Users, WalletCards } from "lucide-react"
import type { StudentProfile } from "@/lib/app-types"
import { useApp } from "@/components/app/app-provider"
import { AppShell, InfoRow, SectionHeading, StatusBadge, type NavItem } from "@/components/app/shared"
import { ScholarshipDashboard } from "@/components/student/student-app"
import { families, notifications, otherApplications, scholarships, students } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

type FamilyPage = "overview" | "children" | "applications" | "notifications" | "profile" | "child-detail"

type ChildView = { student: StudentProfile; scholarshipId: string; status: "Under Verification" | "Sanctioned" }

const childViews: ChildView[] = [
  { student: students[0], scholarshipId: "post-matric", status: "Under Verification" },
  { student: students[1], scholarshipId: "top-class", status: "Sanctioned" },
]

export function FamilyApp() {
  const { t } = useApp()
  const [page, setPage] = useState<FamilyPage>("overview")
  const [selectedChild, setSelectedChild] = useState<ChildView | null>(null)
  const [familyId, setFamilyId] = useState(families[0].id)
  const family = families.find((item) => item.id === familyId) ?? families[0]
  const navItems: NavItem[] = [
    { id: "overview", label: t("overview"), icon: LayoutGrid },
    { id: "children", label: t("children"), icon: Users },
    { id: "applications", label: t("applications"), icon: ClipboardCheck },
    { id: "notifications", label: t("notifications"), icon: Bell },
    { id: "profile", label: t("profile"), icon: UserRound },
  ]
  function openChild(child: ChildView) { setSelectedChild(child); setPage("child-detail") }
  return <AppShell title={page === "child-detail" ? selectedChild?.student.name ?? t("children") : t("familyOverview")} subtitle={`${family.parentName} · Family account`} activePage={page} onPageChange={(next) => setPage(next as FamilyPage)} navItems={navItems} initials={family.parentName.split(" ").map((part) => part[0]).join("").slice(0, 2)}>
    {page === "overview" && <FamilyOverview onOpen={openChild} />}
    {page === "children" && <ChildrenPage onOpen={openChild} />}
    {page === "applications" && <FamilyApplications onOpen={openChild} />}
    {page === "notifications" && <FamilyNotifications />}
    {page === "profile" && <FamilyProfile familyId={familyId} onFamilyChange={setFamilyId} />}
    {page === "child-detail" && selectedChild && <ScholarshipDashboard student={selectedChild.student} scholarship={scholarships.find((item) => item.id === selectedChild.scholarshipId)!} familyStatus={selectedChild.status} onBack={() => setPage("overview")} />}
  </AppShell>
}

function FamilyOverview({ onOpen }: { onOpen: (child: ChildView) => void }) {
  const { t } = useApp()
  const stats = [["2", t("children")], ["2", t("applications")], ["1", t("underVerification")], ["1", t("sanctioned")]]
  return <div className="flex flex-col gap-6"><Card className="border-primary/20 bg-primary text-primary-foreground"><CardHeader><CardTitle className="text-xl">Lakshmi Devi&apos;s family</CardTitle><CardDescription className="text-primary-foreground/75">A single view of both children&apos;s scholarship journeys.</CardDescription></CardHeader><CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">{stats.map(([value, label]) => <div key={label} className="rounded-xl bg-primary-foreground/10 p-3"><p className="text-2xl font-bold">{value}</p><p className="text-xs text-primary-foreground/75">{label}</p></div>)}</CardContent></Card><SectionHeading title={t("children")} description="Select a child to view application, documents, payment and notifications." /><div className="grid gap-4 lg:grid-cols-2">{childViews.map((child) => <FamilyChildCard key={child.student.id} child={child} onOpen={() => onOpen(child)} />)}</div></div>
}

function FamilyChildCard({ child, onOpen }: { child: ChildView; onOpen: () => void }) {
  const { t } = useApp()
  const scholarship = scholarships.find((item) => item.id === child.scholarshipId)!
  return <Card><CardHeader><span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary"><GraduationCap className="size-5" /></span><CardTitle>{child.student.name}</CardTitle><CardDescription>{child.student.course} · {child.student.institution}</CardDescription><CardAction><StatusBadge status={child.status} /></CardAction></CardHeader><CardContent><p className="text-xs text-muted-foreground">Scholarship</p><p className="font-bold">{scholarship.name}</p><div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><WalletCards className="size-4 text-primary" />{child.student.documents.filter((item) => item.verified).length} verified documents</div></CardContent><CardFooter><Button className="w-full" onClick={onOpen}>{t("viewChild")}</Button></CardFooter></Card>
}

function ChildrenPage({ onOpen }: { onOpen: (child: ChildView) => void }) {
  const { t } = useApp()
  return <div className="flex flex-col gap-5"><SectionHeading title={t("children")} description="Student profiles connected to this family account." /><div className="grid gap-4 lg:grid-cols-2">{childViews.map((child) => <FamilyChildCard key={child.student.id} child={child} onOpen={() => onOpen(child)} />)}</div></div>
}

function FamilyApplications({ onOpen }: { onOpen: (child: ChildView) => void }) {
  const { t } = useApp()
  return <div className="flex flex-col gap-5"><SectionHeading title={t("applications")} description="Two active applications across this family." />{childViews.map((child, index) => { const scholarship = scholarships.find((item) => item.id === child.scholarshipId)!; const appId = index === 0 ? "ST2026PM00124" : otherApplications[0].id; return <Card key={child.student.id}><CardHeader><CardTitle>{child.student.name}</CardTitle><CardDescription>{scholarship.name} · {appId}</CardDescription><CardAction><StatusBadge status={child.status} /></CardAction></CardHeader><CardFooter><Button variant="outline" className="w-full" onClick={() => onOpen(child)}>View application dashboard</Button></CardFooter></Card>})}</div>
}

function FamilyNotifications() {
  const { localNotifications, t } = useApp()
  const items = localNotifications.filter((item) => item.audience === "family")
  return <div className="flex flex-col gap-5"><SectionHeading title={t("notifications")} description="Child-specific scholarship updates." /><div className="flex flex-col gap-3">{items.map((item) => <Card key={item.id} size="sm" className={cn(!item.read && "border-primary/30")}><CardHeader><Bell className="mt-0.5 size-5 text-primary" /><div><CardTitle className="text-sm">{item.title}</CardTitle><CardDescription>{item.message}</CardDescription></div><CardAction><Badge variant="outline">{item.date}</Badge></CardAction></CardHeader></Card>)}</div></div>
}

function FamilyProfile({ familyId, onFamilyChange }: { familyId: string; onFamilyChange: (id: string) => void }) {
  const { logout, t } = useApp()
  const family = families.find((item) => item.id === familyId) ?? families[0]
  const familyItems = families.map((item) => ({ value: item.id, label: item.parentName }))
  return <div className="flex flex-col gap-5"><SectionHeading title={t("profile")} description="Parent account and linked children." /><Card><CardHeader><div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary"><Users className="size-6" /></div><CardTitle>{family.parentName}</CardTitle><CardDescription>Family account holder</CardDescription></CardHeader><CardContent><Select items={familyItems} value={familyId} onValueChange={(value) => value && onFamilyChange(value)}><SelectTrigger className="mb-4 h-11 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{familyItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select><Separator /><dl className="divide-y"><InfoRow label="Parent name" value={family.parentName} /><InfoRow label="Phone" value={`+91 ${family.phone}`} /><InfoRow label="Children count" value={family.childIds.length} /><InfoRow label="Connected services" value={<span className="flex items-center gap-1"><CheckCircle2 className="size-4 text-primary" /> Active</span>} /></dl></CardContent><CardFooter><Button variant="outline" className="w-full" onClick={logout}>{t("logout")}</Button></CardFooter></Card></div>
}
