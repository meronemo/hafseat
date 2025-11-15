import { redirect } from "next/navigation"
import { getServerSideSession } from "@/lib/session"
import { getSeat, getLastSeatRun } from "@/lib/data/seat"
import { getGeneralSettings, getStudentsSettings } from "@/lib/data/settings"
import { getAnnouncements, getReadAnnouncements } from "@/lib/data/announcements"
import HomePage from "@/components/HomePage/index"

export const revalidate = 0
export const dynamic = "force-dynamic"

export default async function Page() {
  const session = await getServerSideSession()

  const announcementsData = await getAnnouncements()
  const announcements = announcementsData.announcements

  if (!session) {
    return <HomePage sessionData={null} announcements={announcements} />
  }

  if (!session.user.classId) {
    redirect("/confirm-representative")
  }  

  const [seatData, generalSettingsData, studentsSettingsData, readAnnouncementsData, lastSeatRunData] = await Promise.all([
    getSeat(session),
    getGeneralSettings(session),
    getStudentsSettings(session),
    getReadAnnouncements(session),
    getLastSeatRun(session)
  ])

  const isAdmin = session.user.role === "admin"

  const seat = seatData.seat
  const generalSettings = generalSettingsData.settings
  const students = studentsSettingsData.students

  const studentCount = students.length
  const isSeatNull = !seat
  
  const readAnnouncements = readAnnouncementsData.readAnnouncements
  
  const lastSeatDate = lastSeatRunData.date
  const lastSeatBy = lastSeatRunData.runBy
  const isFirstSeat = !(lastSeatRunData.runBy) // true if no run_by data exists (no seat organized using this app)
  const settingsChanged = !isFirstSeat && (generalSettings.changed || studentsSettingsData.changed)

  return <HomePage 
    sessionData={session}
    announcements={announcements}
    data={{ isAdmin, studentCount, isSeatNull, settingsChanged, readAnnouncements, lastSeatDate, lastSeatBy }}
  />
}
