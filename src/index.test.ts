import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import dayjs from 'dayjs';
import * as jpdate from './index.js';

beforeEach(() => {
  const now = dayjs().year(2016).month(0).date(22).hour(1).minute(23).second(45);
  vi.useFakeTimers();
  vi.setSystemTime(now.toDate());
});
afterEach(() => {
  vi.useRealTimers();
});

test('match', () => {
  const arr = [
    { elem: '来年', relative: 1, type: 'years' },
    { elem: '2017年', relative: 1, type: 'years' },
    { elem: 'きょう', relative: 0, type: 'days' },
    { elem: '一年前', relative: -1, type: 'years' },
    { elem: '十日後', relative: 10, type: 'days' },
    { elem: '2年後', relative: 2, type: 'years' },
    { elem: '21日前', relative: -21, type: 'days' },
    { elem: '３年後', relative: 3, type: 'years' },
    { elem: '10年後', relative: 10, type: 'years' },
    { elem: '昨日', relative: -1, type: 'days' },
    { elem: '百年後', relative: 100, type: 'years' },
    { elem: 'あした', relative: 1, type: 'days' },
    { elem: '火曜日', relative: -3, type: 'days' },
    { elem: '来週の火曜日', relative: 4, type: 'days' },
    { elem: '先週の火曜日', relative: -10, type: 'days' },
    { elem: '再来週の水曜日', relative: 12, type: 'days' },
    { elem: '1月24日', relative: 2, type: 'days' },
    { elem: '2015年1月23日', relative: -364, type: 'days' },
    { elem: '2015/1/23', relative: -364, type: 'days' },
    { elem: '二〇一五/一/二三', relative: -364, type: 'days' },
    { elem: '3秒後', relative: 3, type: 'seconds' },
    { elem: '30分後', relative: 30 * 60, type: 'seconds' },
    { elem: '二十三時間後', relative: 23 * 60 * 60, type: 'seconds' },
    { elem: '2時間半前', relative: -(2 * 60 * 60 + 30 * 60), type: 'seconds' },
    { elem: '10時', relative: (dayjs().hour(10).minute(0).second(0).toDate().getTime() - Date.now()) / 1000, type: 'seconds' },
    { elem: '拾伍時', relative: (dayjs().hour(15).minute(0).second(0).toDate().getTime() - Date.now()) / 1000, type: 'seconds' },
    {
      elem: '10時1分',
      relative: (dayjs().hour(10).minute(1).second(0).toDate().getTime() - Date.now()) / 1000,
      type: 'seconds'
    },
    {
      elem: '十時二十分',
      relative: (dayjs().hour(10).minute(20).second(0).toDate().getTime() - Date.now()) / 1000,
      type: 'seconds'
    },
    {
      elem: '十壱時半',
      relative: (dayjs().hour(11).minute(30).second(0).toDate().getTime() - Date.now()) / 1000,
      type: 'seconds'
    },
    {
      elem: '十時二十分三十五秒',
      relative: (dayjs().hour(10).minute(20).second(35).toDate().getTime() - Date.now()) / 1000,
      type: 'seconds'
    },
    {
      elem: '正午',
      relative: (dayjs().hour(12).minute(0).second(0).toDate().getTime() - Date.now()) / 1000,
      type: 'seconds'
    }
  ];
  const inputStr = arr.map((e) => {
    return e.elem;
  }).join(',');
  const dates = jpdate.match(inputStr, Date.now());
  for (const entry of dates.entries()) {
    const date = entry[1];
    expect(date.hasOwnProperty('index')).toStrictEqual(true);
    expect(date).toMatchObject(arr[entry[0]])
  }
  // '入力パターン数と一致している'
  expect(dates.length).toStrictEqual(arr.length)
});

test('getDate', (t) => {
  const now = Date.now();
  const obj = {
    '50分後': dayjs(now).add(50, 'minutes'),
    '10時半': dayjs(now).hour(10).minute(30).second(0),
    'あさって': dayjs(now).hour(0).minute(0).second(0).add(2, 'days'),
    '2015年1月23日': dayjs(now).year(2015).month(0).date(23).hour(0).minute(0).second(0),
    '2016年の1月23日': dayjs(now).year(2016).month(0).date(23).hour(0).minute(0).second(0),
    '明日の一時間後': dayjs(now).add(1, 'days').add(1, 'hours'),
    '来年のきょう': dayjs(now).hour(0).minute(0).second(0).add(1, 'years'),
    '来月の明日': dayjs(now).hour(0).minute(0).second(0).add(1, 'months').add(1, 'days'),
    '来月明日': dayjs(now).hour(0).minute(0).second(0).add(1, 'months').add(1, 'days'),
    '一年前の十日後': dayjs(now).hour(0).minute(0).second(0).add(-1, 'years').add(10, 'days'),
    '一年前十日後': dayjs(now).hour(0).minute(0).second(0).add(-1, 'years').add(10, 'days'),
    '2年後の21日前': dayjs(now).hour(0).minute(0).second(0).add(2, 'years').add(-21, 'days'),
    '３年後': dayjs(now).hour(0).minute(0).second(0).add(3, 'years'),
    '10年後の昨日': dayjs(now).hour(0).minute(0).second(0).add(10, 'years').add(-1, 'days'),
    '10年後昨日': dayjs(now).hour(0).minute(0).second(0).add(10, 'years').add(-1, 'days'),
    '百年後の一昨日': dayjs(now).hour(0).minute(0).second(0).add(100, 'years').add(-2, 'days'),
    '明日の10時': dayjs(now).hour(10).minute(0).second(0).add(1, 'days'),
    '明日10時': dayjs(now).hour(10).minute(0).second(0).add(1, 'days'),
    '来年の10時二十三分': dayjs(now).hour(10).minute(23).second(0).add(1, 'years'),
    '今週の土曜': dayjs(now).hour(0).minute(0).second(0).add(1, 'days'),
    '来週の水曜日': dayjs(now).hour(0).minute(0).second(0).add(5, 'days'),
    '来週水曜日': dayjs(now).hour(0).minute(0).second(0).add(5, 'days'),
    '先週の月曜日': dayjs(now).hour(0).minute(0).second(0).add(-11, 'days'),
    '来月の11日': dayjs(now).hour(0).minute(0).second(0).add(1, 'month').date(11),
    '来月の第三金曜日': dayjs(now).hour(0).minute(0).second(0).add(1, 'month').date(19),
    '明日の正午': dayjs(now).add(1, 'days').hour(12).minute(0).second(0),
    '来年の大晦日': dayjs(now).add(1, 'years').month(11).date(31).hour(0).minute(0).second(0),
    '去年のクリスマスイブ': dayjs(now).add(-1, 'years').month(11).date(24).hour(0).minute(0).second(0),
    '一昨年の元日': dayjs(now).add(-2, 'years').month(0).date(1).hour(0).minute(0).second(0),
    '1990年の成人の日': dayjs(now).year(1990).month(0).date(15).hour(0).minute(0).second(0),
    '来年の成人の日': dayjs(now).year(2017).month(0).date(9).hour(0).minute(0).second(0),
    '２０１８年の建国記念の日': dayjs(now).year(2018).month(1).date(11).hour(0).minute(0).second(0),
    '2003年の成人の日': dayjs(now).year(2003).month(0).date(13).hour(0).minute(0).second(0),
    // 1989 ~ 2006年までは4/29
    '1991年のみどりの日': dayjs(now).year(1991).month(3).date(29).hour(0).minute(0).second(0),
    // 2007年から5/4
    '2007年のみどりの日': dayjs(now).year(2007).month(4).date(4).hour(0).minute(0).second(0),
    // 1996 ~ 2002年までは7/20
    '1997年の海の日': dayjs(now).year(1997).month(6).date(20).hour(0).minute(0).second(0),
    // 2003年以降は第3月曜日
    '2013年の海の日': dayjs(now).year(2013).month(6).date(15).hour(0).minute(0).second(0),
    // 1966 ~ 2002年までは9/15
    '1970年の敬老の日': dayjs(now).year(1970).month(8).date(15).hour(0).minute(0).second(0),
    // 2003年からは9月の第3月曜日
    '2013年の敬老の日': dayjs(now).year(2013).month(8).date(16).hour(0).minute(0).second(0),
    // 1988年以前は4/29
    '1984年の天皇誕生日': dayjs(now).year(1984).month(3).date(29).hour(0).minute(0).second(0),
    '2012年の天皇誕生日': dayjs(now).year(2012).month(11).date(23).hour(0).minute(0).second(0),
    // 2002年までは7/20固定
    '2001年の海の日': dayjs(now).year(2001).month(6).date(20).hour(0).minute(0).second(0),
    // 2002年までは9/15固定
    '2001年の敬老の日': dayjs(now).year(2001).month(8).date(15).hour(0).minute(0).second(0),
    // 1966~1999年までは10/10固定
    '1995年の体育の日': dayjs(now).year(1995).month(9).date(10).hour(0).minute(0).second(0),
    // 2016年が10/10だったので2015年のテストを追加
    '2015年の体育の日': dayjs().year(2015).month(9).date(12).hour(0).minute(0).second(0),
    '2016年の春分の日': dayjs().year(2016).month(2).date(20).hour(0).minute(0).second(0),
    '2017年の秋分の日': dayjs().year(2017).month(8).date(23).hour(0).minute(0).second(0),
    '6月21日の60日後': dayjs().month(5).date(21).hour(0).minute(0).second(0).add(60, 'days'),
    '6月22日の10時の60日後': dayjs().month(5).date(22).hour(10).minute(0).second(0).add(60, 'days'),
    '明日の11:52': dayjs(now).add(1, 'days').hour(11).minute(52).second(0),
    '9月23日の9:04:05': dayjs(now).month(8).date(23).hour(9).minute(4).second(5)
  };
  const keys = Object.keys(obj);
  const inputStr = keys.join(',');
  const dates = jpdate.getDate(inputStr, now);
  for (const [index, date] of dates.entries()) {
    const inputDate = obj[keys[index]];
    expect(date.getTime()).toStrictEqual(inputDate.toDate().getTime())
  }
  // '入力パターン数一致している'
  expect(dates.length).toStrictEqual(keys.length);
});

test('getDate 祝日制定範囲外', (t) => {
  const now = Date.now();
  const array = [
    '1966年の建国記念の日',
    '1979年のみどりの日',
    '2006年の昭和の日',
    '1995年の海の日',
    '2015年の山の日',
    '1960年の敬老の日',
    '1965年の体育の日'
  ];
  const inputStr = array.join(',');
  const dates = jpdate.getDate(inputStr, now);
  // '制定された年度外のものはひっかからない'
  expect(dates.length).toStrictEqual(0);
});
