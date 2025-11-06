import { redirect } from "next/navigation"
import { getServerSideSession } from "@/lib/session"
import AdminPage from "@/components/AdminPage/index"

export default async function SettingsPage() {
  const session = await getServerSideSession()

  if (!session || !session.user.classId || session.user.role !== "admin") {
    redirect("/")
  }

  return (
    <AdminPage />
  )
}