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
  t.context.timer = sinon.restore();
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
    { elem: '10時', relative: (moment({ hour: 10 }).toDate().getTime() - Date.now()) / 1000, type: 'seconds' },
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
    }
  ];
  const inputStr = arr.map((e) => {
    return e.elem;
  }).join(',');
  const dates = jpdate.match(inputStr, Date.now());
  t.is(dates.length, arr.length);
  for (const entry of dates.entries()) {
    const date = entry[1];
    t.truthy(date.hasOwnProperty('index'));
    delete date.index;
    t.deepEqual(date, arr[entry[0]]);
  }
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
    '来月の11日': moment(now).add(1, 'month').date(11)
  };
  const keys = Object.keys(obj);
  const inputStr = keys.join(',');
  const dates = jpdate.getDate(inputStr, now);
  t.is(dates.length, keys.length);
  for (const entry of dates.entries()) {
    const date = entry[1];
    const inputDate = obj[keys[entry[0]]];
    t.deepEqual(date.getTime(), inputDate.toDate().getTime(), `${keys[entry[0]]}`);
  }
});
