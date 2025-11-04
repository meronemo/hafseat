import { redirect } from "next/navigation"
import { getServerSideSession } from "@/lib/session"
import { viewSeat } from "@/services/seat/view"
import { getGeneralSettings } from "@/services/settings/general"
import { getStudentsSettings } from "@/services/settings/students"
import { getReadNotifications } from "@/services/read-notifications"
import HomePage from "@/components/HomePage/index"
import { type Session } from "next-auth"

export interface HomeProps {
  sessionData: Session | null
  data?: {
    seatCount: number
    studentCount: number
    isSeatNull: boolean
    settingsChanged: boolean
    readNotifications: boolean
  }
} 

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

  const [seatData, generalSettingsData, studentsSettingsData, readNotificationsData] = await Promise.all([
    viewSeat(session),
    getGeneralSettings(session),
    getStudentsSettings(session),
    getReadNotifications(session)
  ])

  const seat = seatData.seat
  const generalSettings = generalSettingsData.settings
  const students = studentsSettingsData.students
  
  const seatCount = generalSettings.rows * generalSettings.columns
  const studentCount = students.length
  const isSeatNull = !seat
  const settingsChanged = generalSettings.changed || studentsSettingsData.changed

  const readNotifications = readNotificationsData.readNotifications

  return <HomePage 
    sessionData={session}
    data={{ seatCount, studentCount, isSeatNull, settingsChanged, readNotifications }}
  />
}
