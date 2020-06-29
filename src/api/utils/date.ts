export const addDays = (x: Date, days: number) => {
  let date = new Date(x.valueOf());
  date.setDate(date.getDate() + days);

  return date;
}
