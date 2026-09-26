"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { ApplicationStatus, Language, NotificationRecord, Role } from "@/lib/app-types"
import { applications, notifications, students } from "@/lib/mock-data"
import { translate, type TranslationKey } from "@/lib/translations"

type AppContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  role: Role | null
  login: (role: Role) => void
  logout: () => void
  activeStudentId: string
  setActiveStudentId: (id: string) => void
  studentNames: Record<string, string>
  updateStudentName: (id: string, name: string) => void
  applicationStatuses: Record<string, ApplicationStatus>
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void
  localNotifications: NotificationRecord[]
  addNotification: (notification: NotificationRecord) => void
  t: (key: TranslationKey) => string
}

const AppContext = createContext<AppContextValue | null>(null)
const STORAGE_KEY = "tribal-scholarship-connect-state"

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [role, setRole] = useState<Role | null>(null)
  const [activeStudentId, setActiveStudentId] = useState(students[0].id)
  const [studentNames, setStudentNames] = useState<Record<string, string>>(
    Object.fromEntries(students.map((student) => [student.id, student.name])),
  )
  const [applicationStatuses, setApplicationStatuses] = useState<Record<string, ApplicationStatus>>(
    Object.fromEntries(applications.map((application) => [application.id, application.status])),
  )
  const [localNotifications, setLocalNotifications] = useState<NotificationRecord[]>(notifications)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<{
          language: Language
          activeStudentId: string
          studentNames: Record<string, string>
          applicationStatuses: Record<string, ApplicationStatus>
          localNotifications: NotificationRecord[]
        }>
        if (parsed.language) setLanguage(parsed.language)
        if (parsed.activeStudentId) setActiveStudentId(parsed.activeStudentId)
        if (parsed.studentNames) setStudentNames(parsed.studentNames)
        if (parsed.applicationStatuses) setApplicationStatuses(parsed.applicationStatuses)
        if (parsed.localNotifications) setLocalNotifications(parsed.localNotifications)
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ language, activeStudentId, studentNames, applicationStatuses, localNotifications }),
    )
  }, [language, activeStudentId, studentNames, applicationStatuses, localNotifications, hydrated])

  const value = useMemo<AppContextValue>(() => ({
    language,
    setLanguage,
    role,
    login: setRole,
    logout: () => setRole(null),
    activeStudentId,
    setActiveStudentId,
    studentNames,
    updateStudentName: (id, name) => setStudentNames((current) => ({ ...current, [id]: name })),
    applicationStatuses,
    updateApplicationStatus: (id, status) => setApplicationStatuses((current) => ({ ...current, [id]: status })),
    localNotifications,
    addNotification: (notification) => setLocalNotifications((current) => [notification, ...current]),
    t: (key) => translate(language, key),
  }), [language, role, activeStudentId, studentNames, applicationStatuses, localNotifications])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}
