import { redirect } from "next/navigation"
import { getServerSideSession } from "@/lib/session"
import { viewSeat } from "@/services/view-seat"
import EditSeat from "@/components/Seat/Edit/index"

export default async function Page() {
  const session = await getServerSideSession()

  if (!session || !session.user.classId) {
    redirect("/")
  }

  const { seat, grade, class: cls, date } = await viewSeat(session)

  return (
    <EditSeat
      seat={seat}
      grade={grade}
      cls={cls}
      cols={seat[0].length}
    />
  )
}