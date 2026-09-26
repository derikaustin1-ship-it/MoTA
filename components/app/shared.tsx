"use client"

import { useEffect, type ReactNode } from "react"
import { Bell, Landmark, LogOut, ShieldCheck, type LucideIcon } from "lucide-react"
import type { ApplicationStatus, Language } from "@/lib/app-types"
import { languageNames } from "@/lib/translations"
import { useApp } from "@/components/app/app-provider"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AppMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
        <Landmark aria-hidden="true" />
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className="truncate text-base font-bold tracking-tight">Tribal Scholarship Connect</p>
          <p className="text-xs text-muted-foreground">Unified Scholarship Services</p>
        </div>
      )}
    </div>
  )
}

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useApp()
  const items = (Object.keys(languageNames) as Language[]).map((value) => ({ value, label: languageNames[value] }))
  return (
    <Select items={items} value={language} onValueChange={(value) => setLanguage(value as Language)}>
      <SelectTrigger aria-label="Select language" className={cn(compact ? "w-24" : "w-32", "bg-background")}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          {items.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

const statusVariants: Record<ApplicationStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Pending: "secondary",
  Submitted: "secondary",
  "Under Verification": "secondary",
  "Institution Verification": "secondary",
  Sanctioned: "default",
  Rejected: "destructive",
  Disbursed: "default",
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge variant={statusVariants[status]}>{status}</Badge>
}

export type NavItem = {
  id: string
  label: string
  icon: LucideIcon
}

export function AppShell({
  title,
  subtitle,
  activePage,
  onPageChange,
  navItems,
  initials,
  children,
}: {
  title: string
  subtitle?: string
  activePage: string
  onPageChange: (page: string) => void
  navItems: NavItem[]
  initials: string
  children: ReactNode
}) {
  const { logout, t } = useApp()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [activePage])

  return (
    <div className="min-h-dvh bg-muted/35">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-card p-5 md:flex">
        <AppMark />
        <nav aria-label="Primary navigation" className="mt-8 flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Button key={item.id} variant={activePage === item.id ? "secondary" : "ghost"} size="lg" className="h-11 justify-start" onClick={() => onPageChange(item.id)}>
                <Icon data-icon="inline-start" />
                {item.label}
              </Button>
            )
          })}
        </nav>
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border bg-muted/40 p-3 text-xs text-muted-foreground">
            <div className="mb-1 flex items-center gap-2 font-semibold text-foreground"><ShieldCheck className="size-4" /> {t("demoMode")}</div>
            Local mock data · OTP 123456
          </div>
          <Button variant="ghost" className="justify-start" onClick={logout}><LogOut data-icon="inline-start" />{t("logout")}</Button>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-8">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold tracking-tight">{title}</h1>
              {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <LanguageSelector compact />
              <Button variant="ghost" size="icon" aria-label={t("notifications")} onClick={() => onPageChange("notifications")}><Bell /></Button>
              <Button variant="ghost" size="icon" aria-label={t("profile")} onClick={() => onPageChange("profile")}>
                <Avatar size="sm"><AvatarFallback>{initials}</AvatarFallback></Avatar>
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100dvh-4rem)] max-w-6xl px-4 py-5 pb-28 md:px-8 md:py-8 md:pb-10">
          {children}
        </main>
      </div>

      <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/98 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-18px_rgba(0,0,0,0.35)] md:hidden">
        <div className="flex h-[4.5rem] items-stretch overflow-x-auto px-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = activePage === item.id
            return (
              <button key={item.id} type="button" aria-current={active ? "page" : undefined} onClick={() => onPageChange(item.id)} className={cn("flex min-w-[64px] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-medium text-muted-foreground", active && "text-primary")}>
                <Icon className={cn("size-5", active && "stroke-[2.5]")} aria-hidden="true" />
                <span className="max-w-full truncate">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export function SectionHeading({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-xl font-bold tracking-tight text-balance">{title}</h2>
        {description && <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="max-w-[62%] text-right font-medium">{value}</dd>
    </div>
  )
}
