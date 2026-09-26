"use client"

import { AppProvider, useApp } from "@/components/app/app-provider"
import { EntryScreen } from "@/components/app/entry-screen"
import { JagoChat } from "@/components/app/jago-chat"
import { StudentApp } from "@/components/student/student-app"
import { AdminApp } from "@/components/admin/admin-app"
import { FamilyApp } from "@/components/family/family-app"
import { Toaster } from "@/components/ui/toast"

function AppRouter() {
  const { role } = useApp()
  return (
    <>
      {!role && <EntryScreen />}
      {role === "student" && <StudentApp />}
      {role === "admin" && <AdminApp />}
      {role === "family" && <FamilyApp />}
      <JagoChat pageContext={role ?? "entry"} />
    </>
  )
}

export function ScholarshipApp() {
  return <AppProvider><Toaster><AppRouter /></Toaster></AppProvider>
}
