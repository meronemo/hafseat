import { redirect } from "next/navigation"
import { getServerSideSession } from "@/lib/session"
import { getSeat } from "@/lib/data/seat"
import ViewSeat from "@/components/Seat/View/index"

export default async function Page() {
  const session = await getServerSideSession()

  if (!session || !session.user.email || !session.user.classId) {
    redirect("/")
  }

  const { seat, reverseSeat, grade, class: cls, date } = await getSeat(session)

  return (
    <ViewSeat
      seat={seat}
      reverseSeat={reverseSeat}
      userEmail={session.user.email}
      classId={session.user.classId}
      grade={grade}
      cls={cls}
      date={date}
      cols={seat[0].length}
    />
  )
}