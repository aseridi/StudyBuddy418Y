// calendar utility functions 


export function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day =d.getDay()
  d.setDate(d.getDate()-day)
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export function isSameDay(a: Date, b: Date): boolean {

  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}