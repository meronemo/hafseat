import { redirect } from "next/navigation"
import { getServerSideSession } from "@/lib/session"
import { viewSeat } from "@/services/seat/view"
import EditSeat from "@/components/Seat/Edit/index"
import { getStudentsSettings } from "@/services/settings/students"

export default async function Page() {
  const session = await getServerSideSession()

  if (!session || !session.user.classId) {
    redirect("/")
  }

  const { seat, grade, class: cls } = await viewSeat(session)
  const { students } = await getStudentsSettings(session)

  return (
    <EditSeat
      seat={seat}
      students={students}
      grade={grade}
      cls={cls}
      cols={seat[0].length}
    />
  )
}