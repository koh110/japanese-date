import dayjs from 'dayjs';

// 第n xx曜日を取得する関数
// n: 第n
// day: 0(日) -> 6(土)
export const getDateFromNthDay = (
  year: number,
  month: number,
  n: number,
  day: number,
) => {
  const firstDateInstance = dayjs()
    .year(year)
    .month(month)
    .date(1)
    .hour(0)
    .minute(0)
    .second(0);
  const firstDay = firstDateInstance.clone().toDate().getDay();
  const diff = day - firstDay;
  let date = (n - 1) * 7 + 1;
  date += diff < 0 ? diff + 7 : diff;
  const lastDate = firstDateInstance.clone().endOf('month').date();
  if (lastDate < date) {
    return null;
  }
  return dayjs().year(year).month(month).date(date).hour(0).minute(0).second(0);
};
