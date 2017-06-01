'use strict';

const test = require('ava').test;
const sinon = require('sinon');
const moment = require('moment');

const jpdate = require('src');

test.beforeEach((t) => {
  const now = moment('2016-01-22 01:23:45');
  t.context.timer = sinon.useFakeTimers(now.toDate().getTime(), 'Date');
});
test.afterEach((t) => {
  t.context.timer.restore();
});

test('match', (t) => {
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
    { elem: '1月23日', relative: 1, type: 'days' },
    { elem: '2015年1月23日', relative: -364, type: 'days' },
    { elem: '2015/1/23', relative: -364, type: 'days' },
    { elem: '二〇一五/一/二三', relative: -364, type: 'days' },
    { elem: '3秒後', relative: 3, type: 'seconds' },
    { elem: '30分後', relative: 30 * 60, type: 'seconds' },
    { elem: '二十三時間後', relative: 23 * 60 * 60, type: 'seconds' },
    { elem: '2時間半前', relative: -(2 * 60 * 60 + 30 * 60), type: 'seconds' },
    { elem: '10時', relative: (moment({ hour: 10 }).toDate().getTime() - Date.now()) / 1000, type: 'seconds' },
    { elem: '拾伍時', relative: (moment({ hour: 15 }).toDate().getTime() - Date.now()) / 1000, type: 'seconds' },
    {
      elem: '10時1分',
      relative: (moment({ hour: 10, minute: 1 }).toDate().getTime() - Date.now()) / 1000,
      type: 'seconds'
    },
    {
      elem: '十時二十分',
      relative: (moment({ hour: 10, minute: 20 }).toDate().getTime() - Date.now()) / 1000,
      type: 'seconds'
    },
    {
      elem: '十壱時半',
      relative: (moment({ hour: 11, minute: 30 }).toDate().getTime() - Date.now()) / 1000,
      type: 'seconds'
    },
    {
      elem: '十時二十分三十五秒',
      relative: (moment({ hour: 10, minute: 20, second: 35 }).toDate().getTime() - Date.now()) / 1000,
      type: 'seconds'
    },
    {
      elem: '正午',
      relative: (moment({ hour: 12 }).toDate().getTime() - Date.now()) / 1000,
      type: 'seconds'
    }
  ];
  const inputStr = arr.map((e) => {
    return e.elem;
  }).join(',');
  const dates = jpdate.match(inputStr, Date.now());
  for (const entry of dates.entries()) {
    const date = entry[1];
    t.truthy(date.hasOwnProperty('index'));
    delete date.index;
    t.deepEqual(date, arr[entry[0]]);
  }
  t.is(dates.length, arr.length, '入力パターン数と一致している');
});

test('getDate', (t) => {
  const now = Date.now();
  const obj = {
    '50分後': moment(now).add(50, 'minutes'),
    '10時半': moment({ hour: 10, minute: 30 }),
    'あさって': moment(now).add(2, 'days'),
    '2015年1月23日': moment(now).add(-1, 'years').add(1, 'days'),
    '2015年の1月23日': moment(now).add(-1, 'years').add(1, 'days'),
    '明日の一時間後': moment(now).add(1, 'days').add(1, 'hours'),
    '来年のきょう': moment(now).add(1, 'years'),
    '来月の明日': moment(now).add(1, 'months').add(1, 'days'),
    '一年前の十日後': moment(now).add(-1, 'years').add(10, 'days'),
    '2年後の21日前': moment(now).add(2, 'years').add(-21, 'days'),
    '３年後': moment(now).add(3, 'years'),
    '10年後の昨日': moment(now).add(10, 'years').add(-1, 'days'),
    '百年後の一昨日': moment(now).add(100, 'years').add(-2, 'days'),
    '明日の10時': moment({ hour: 10 }).add(1, 'days'),
    '来年の10時二十三分': moment({ hour: 10, minute: 23 }).add(1, 'years'),
    '今週の土曜': moment(now).add(1, 'days'),
    '来週の水曜日': moment(now).add(5, 'days'),
    '先週の月曜日': moment(now).add(-11, 'days'),
    '来月の11日': moment(now).add(1, 'month').date(11),
    '来月の第三金曜日': moment(now).add(1, 'month').date(19),
    '明日の正午': moment({ hour: 12 }).add(1, 'days').hours(12),
    '来年の大晦日': moment(now).set({ month: 11, date: 31 }).add(1, 'years'),
    '去年のクリスマスイブ': moment(now).set({ month: 11, date: 24 }).add(-1, 'years'),
    '一昨年の元日': moment(now).set({ month: 0, date: 1 }).add(-2, 'years'),
    '1990年の成人の日': moment(now).set({ year: 1990, month: 0, date: 15 }),
    '来年の成人の日': moment(now).set({ month: 0, date: 9 }).add(1, 'years'),
    '２０１８年の建国記念の日': moment(now).set({ year: 2018, month: 1, date: 11 }),
    '2003年の成人の日': moment(now).set({ year: 2003, month: 0, date: 13 }),
    // 1989 ~ 2006年までは4/29
    '1991年のみどりの日': moment(now).set({ year: 1991, month: 3, date: 29 }),
    // 2007年から5/4
    '2007年のみどりの日': moment(now).set({ year: 2007, month: 4, date: 4 }),
    // 1996 ~ 2002年までは7/20
    '1997年の海の日': moment(now).set({ year: 1997, month: 6, date: 20 }),
    // 2003年以降は第3月曜日
    '2013年の海の日': moment(now).set({ year: 2013, month: 6, date: 15 }),
    // 1966 ~ 2002年までは9/15
    '1970年の敬老の日': moment(now).set({ year: 1970, month: 8, date: 15 }),
    // 2003年からは9月の第3月曜日
    '2013年の敬老の日': moment(now).set({ year: 2013, month: 8, date: 16 }),
    // 1988年以前は4/29
    '1984年の天皇誕生日': moment(now).set({ year: 1984, month: 3, date: 29 }),
    '2012年の天皇誕生日': moment(now).set({ year: 2012, month: 11, date: 23 }),
    // 2002年までは7/20固定
    '2001年の海の日': moment(now).set({ year: 2001, month: 6, date: 20 }),
    // 2002年までは9/15固定
    '2001年の敬老の日': moment(now).set({ year: 2001, month: 8, date: 15 }),
    // 1966~1999年までは10/10固定
    '1995年の体育の日': moment(now).set({ year: 1995, month: 9, date: 10 }),
    // 2016年が10/10だったので2015年のテストを追加
    '2015年の体育の日': moment(now).set({ year: 2015, month: 9, date: 12 }),
    '2015年の春分の日': moment(now).set({ year: 2015, month: 2, date: 21 }),
    '2015年の秋分の日': moment(now).set({ year: 2015, month: 8, date: 23 }),
    '6月21日の60日後': moment(now).set({ month: 5, date: 21 }).add(60, 'days'),
    '6月21日の10時の60日後': moment(now).set({ month: 5, date: 21, hour: 10, minute: 0, second: 0 }).add(60, 'days'),
    '明日の11:52': moment(now).add(1, 'days').set({ hour: 11, minute: 52, second: 0 }),
    '9月23日の9:04:05': moment({ month: 8, day: 23, hour: 9, minute: 4, second: 5 })
  };
  const keys = Object.keys(obj);
  const inputStr = keys.join(',');
  const dates = jpdate.getDate(inputStr, now);
  for (const entry of dates.entries()) {
    const date = entry[1];
    const inputDate = obj[keys[entry[0]]];
    t.deepEqual(date.getTime(), inputDate.toDate().getTime(), `${keys[entry[0]]}`);
  }
  t.is(dates.length, keys.length, '入力パターン数一致している');
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
  t.is(dates.length, 0, '制定された年度外のものはひっかからない');
});
