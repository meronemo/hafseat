import { redirect } from "next/navigation"
import { getServerSideSession } from "@/lib/session"
import Settings from "@/components/Settings/index"
import { getGeneralSettings, getStudentsSettings } from "@/lib/data/settings"

export default async function SettingsPage() {
  const session = await getServerSideSession()

  if (!session || !session.user.classId) {
    redirect("/")
  }

  const { email, username, name, grade, class: userClass } = session.user
  const [{ settings }, { students }] = await Promise.all([
    getGeneralSettings(session),
    getStudentsSettings(session)
  ])

  return (
    <Settings
      user={{
        email: email ?? "",
        username: username ?? "",
        name: name ?? "",
        grade: grade ?? 0,
        class: userClass ?? ""
      }}
      generalSettings={settings}
      students={students ?? []}
    />
  )
}