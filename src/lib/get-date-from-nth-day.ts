'use strict';

import moment from 'moment';

// 第n xx曜日を取得する関数
// n: 第n
// day: 0(日) -> 6(土)
export const getDateFromNthDay = (year: number, month: number, n: number, day: number, now = Date.now()) => {
  const firstDay = moment({ year: year, month: month, date: 1 }).weekday();
  const diff = day - firstDay;
  let date = (n - 1) * 7 + 1;
  date += (diff < 0) ? diff + 7 : diff;
  const lastDate = moment({ year: year, month: month + 1, date: 1 }).add(-1, 'days').date();
  if (lastDate < date) {
    return null;
  }
  return moment(now).set({ year: year, month: month, date: date });
};
