export const makeAvailableSeat = (r: number, c: number) => {
  const seatArray = []
  for (let i=0; i<r; i++) {
    const rowArray = []
    for (let j=0; j<c; j++) {
      rowArray.push(true)
    }
    seatArray.push(rowArray)
  }
  return seatArray
}