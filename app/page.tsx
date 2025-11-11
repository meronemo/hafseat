import { redirect } from "next/navigation"
import { getServerSideSession } from "@/lib/session"
import { getSeat } from "@/lib/data/seat"
import { getGeneralSettings, getStudentsSettings } from "@/lib/data/settings"
import { getAnnouncements, getReadAnnouncements } from "@/lib/data/announcements"
import { getLastSeatRun } from "@/lib/data/seat"
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

  const [seatData, generalSettingsData, studentsSettingsData, announcementsData, readAnnouncementsData, lastSeatRunData] = await Promise.all([
    getSeat(session),
    getGeneralSettings(session),
    getStudentsSettings(session),
    getAnnouncements(),
    getReadAnnouncements(session),
    getLastSeatRun(session)
  ])

  const isAdmin = session.user.role === "admin"

  const seat = seatData.seat
  const generalSettings = generalSettingsData.settings
  const students = studentsSettingsData.students

  const studentCount = students.length
  const isSeatNull = !seat
  const settingsChanged = generalSettings.changed || studentsSettingsData.changed

  const announcements = announcementsData.announcements
  const readAnnouncements = readAnnouncementsData.readAnnouncements

  const lastSeatDate = lastSeatRunData.date
  const lastSeatBy = lastSeatRunData.runBy

  return <HomePage 
    sessionData={session}
    data={{ isAdmin, studentCount, isSeatNull, settingsChanged, announcements, readAnnouncements, lastSeatDate, lastSeatBy }}
  />
}
