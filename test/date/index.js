'use strict';

const { test } = require('ava');
const sinon = require('sinon');
const moment = require('moment');

test.beforeEach((t) => {
  const now = moment('2016-01-22 01:23:45');
  t.context.timer = sinon.useFakeTimers(now.toDate().getTime(), 'Date');
});
test.afterEach((t) => {
  t.context.timer = sinon.restore();
});

const { createReplacer, addReplacer, patternMatch } = require('src/lib');
const { replacer } = require('src/date');

test('check match pattern', (t) => {
  const { pattern, map } = addReplacer([createReplacer('days', replacer)]);
  const now = Date.now();
  const nowMoment = moment(now);
  const inputs = {
    '今日': 0, 'きょう': 0, '明日': 1, 'みょうじつ': 1, 'あした': 1,
    '翌日': 1, 'よくじつ': 1,
    '明後日': 2, 'あさって': 2, '明々後日': 3, 'しあさって': 3,
    '昨日': -1, '一昨日': -2, 'おととい': -2,
    '1日前': -1, '２日後': 2, '十日まえ': -10,
    '火曜日': -3, '来週の火曜日': 4, '先週の火曜日': -10, '再来週の水曜日': 12,
    '10日後': 10, '二十三日前': -23,
    '来月の11日': moment().add(1, 'month').date(11).diff(nowMoment, 'days'),
    '再来月の23日': moment().add(2, 'month').date(23).diff(nowMoment, 'days'),
    '先月の3日': moment().add(-1, 'month').date(3).diff(nowMoment, 'days'),
    'こんげつの11日': moment().date(11).diff(nowMoment, 'days'),
    '大晦日': moment().set({ month: 11, date: 31 }).diff(nowMoment, 'days'),
    'クリスマスイブ': moment().set({ month: 11, date: 24 }).diff(nowMoment, 'days'),
    'クリスマス': moment().set({ month: 11, date: 25 }).diff(nowMoment, 'days'),
    '元日': moment().set({ month: 0, date: 1 }).diff(nowMoment, 'days')
  };
  const today = moment();
  const yesterday = moment().add(-1, 'days');
  const tomorrow = moment().add(1, 'days');
  // 日付形式
  // YYYY/MM/DD
  inputs[today.format('YYYY/MM/DD')] = 0;
  // YYYY-MM-DD
  inputs[today.format('YYYY-MM-DD')] = 0;
  // YYYY年MM月DD日
  inputs[yesterday.format('YYYY年MM月DD日')] = -1;
  // MM/DD
  inputs[tomorrow.format('MM/DD')] = 1;
  // MM月DD日
  inputs[tomorrow.format('MM月DD日')] = 1;

  const inputStrs = Object.keys(inputs);
  const matched = patternMatch(inputStrs.join(''), pattern, map, Date.now());
  for (const entry of matched.entries()) {
    const match = entry[1];
    t.is(match.getRelative(match.elem, now), inputs[match.elem], `[${match.elem}]のパターン`);
  }
  t.is(matched.length, inputStrs.length, '全てのパターンにmatchしている');
});
