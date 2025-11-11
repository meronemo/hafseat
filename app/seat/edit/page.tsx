import { redirect } from "next/navigation"
import { getServerSideSession } from "@/lib/session"
import { getSeat } from "@/lib/data/seat"
import { getGeneralSettings, getStudentsSettings } from "@/lib/data/settings"
import EditSeat from "@/components/Seat/Edit/index"

export default async function Page() {
  const session = await getServerSideSession()

  if (!session || !session.user.classId) {
    redirect("/")
  }

  const [seatData, generalSettingsData, studentsSettingsData] = await Promise.all([
    getSeat(session),
    getGeneralSettings(session),
    getStudentsSettings(session)
  ])

  const isSeatNull = !seatData.seat
  const settingsChanged = generalSettingsData.settings.changed || studentsSettingsData.changed
  const needFresh = isSeatNull || settingsChanged

  return (
    <EditSeat
      seat={seatData.seat}
      students={studentsSettingsData.students}
      needFresh={needFresh}
      grade={seatData.grade}
      cls={seatData.class}
      rows={generalSettingsData.settings.rows}
      cols={generalSettingsData.settings.columns}
    />
  )
}