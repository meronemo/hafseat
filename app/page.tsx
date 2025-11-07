import { redirect } from "next/navigation"
import { getServerSideSession } from "@/lib/session"
import { viewSeat } from "@/services/seat/view"
import { getGeneralSettings } from "@/services/settings/general"
import { getStudentsSettings } from "@/services/settings/students"
import { getReadAnnouncements } from "@/services/announcements"
import { getLastSeatRun } from "@/services/seat/last-run"
import HomePage from "@/components/HomePage/index"

export const revalidate = 0
export const dynamic = "force-dynamic"

export default async function Page() {
  const session = await getServerSideSession()
  if (!session) {
    return <HomePage sessionData={null} />
  }
  if (!session.user.classId) {
    redirect("/confirm-representative")
  }  

  const [seatData, generalSettingsData, studentsSettingsData, readAnnouncementsData, lastSeatRunData] = await Promise.all([
    viewSeat(session),
    getGeneralSettings(session),
    getStudentsSettings(session),
    getReadAnnouncements(session),
    getLastSeatRun(session)
  ])

  const isAdmin = session.user.role === "admin"

  const seat = seatData.seat
  const generalSettings = generalSettingsData.settings
  const students = studentsSettingsData.students
  
  const seatCount = generalSettings.rows * generalSettings.columns
  const studentCount = students.length
  const isSeatNull = !seat
  const settingsChanged = generalSettings.changed || studentsSettingsData.changed

  const readAnnouncements = readAnnouncementsData.readAnnouncements

  const lastSeatDate = lastSeatRunData.date
  const lastSeatBy = lastSeatRunData.runBy

  return <HomePage 
    sessionData={session}
    data={{ isAdmin, seatCount, studentCount, isSeatNull, settingsChanged, readAnnouncements, lastSeatDate, lastSeatBy }}
  />
}
