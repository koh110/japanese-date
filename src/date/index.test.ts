import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import dayjs from 'dayjs';
import { createReplacer, addReplacer, patternMatch } from '../lib/jpdate-lib/index.js'
import { replacer } from './index.js';

beforeEach(() => {
  const now = dayjs().year(2016).month(0).date(22).hour(1).minute(23).second(45);
  vi.useFakeTimers();
  vi.setSystemTime(now.toDate());
});
afterEach(() => {
  vi.useRealTimers();
});

test('check match pattern', () => {
  const { pattern, map } = addReplacer([createReplacer('days', replacer)]);
  const now = dayjs(Date.now());
  const inputs = {
    '今日': 0, 'きょう': 0, '明日': 1, 'みょうじつ': 1, 'あした': 1,
    '翌日': 1, 'よくじつ': 1,
    '明後日': 2, 'あさって': 2, '明々後日': 3, 'しあさって': 3,
    '昨日': -1, '一昨日': -2, 'おととい': -2,
    '1日前': -1, '２日後': 2, '十日まえ': -10,
    '火曜日': -3, '来週の火曜日': 4, '先週の火曜日': -10, '再来週の水曜日': 12,
    '10日後': 10, '二十三日前': -23,
    '来月の11日': dayjs(now).add(1, 'month').date(11).hour(0).minute(0).second(0).diff(now, 'days'),
    '再来月の23日': dayjs(now).add(2, 'month').date(23).hour(0).minute(0).second(0).diff(now, 'days'),
    '先月の3日': dayjs(now).add(-1, 'month').date(3).hour(0).minute(0).second(0).diff(now, 'days'),
    '先月の昨日': dayjs(now).add(-1, 'month').add(-1, 'days').hour(0).minute(0).second(0).diff(now, 'days'),
    'こんげつの11日': dayjs(now).date(11).hour(0).minute(0).second(0).diff(now, 'days'),
    '今月の第二木曜日': dayjs(now).date(14).hour(0).minute(0).second(0).diff(now, 'days'),
    '大晦日': dayjs(now).month(11).date(31).hour(0).minute(0).second(0).diff(now, 'days'),
    'クリスマスイブ': dayjs(now).month(11).date(24).hour(0).minute(0).second(0).diff(now, 'days'),
    'クリスマス': dayjs(now).month(11).date(25).hour(0).minute(0).second(0).diff(now, 'days'),
    '元日': dayjs(now).month(0).date(1).hour(0).minute(0).second(0).diff(now, 'days'),
    '成人の日': dayjs(now).month(0).date(11).hour(0).minute(0).second(0).diff(now, 'days'),
    '建国記念日': dayjs(now).month(1).date(11).hour(0).minute(0).second(0).diff(now, 'days'),
    '憲法記念日': dayjs(now).month(4).date(3).hour(0).minute(0).second(0).diff(now, 'days'),
    'みどりの日': dayjs(now).month(4).date(4).hour(0).minute(0).second(0).diff(now, 'days'),
    '昭和の日': dayjs(now).month(3).date(29).hour(0).minute(0).second(0).diff(now, 'days'),
    'こどもの日': dayjs(now).month(4).date(5).hour(0).minute(0).second(0).diff(now, 'days'),
    '海の日': dayjs(now).month(6).date(18).hour(0).minute(0).second(0).diff(now, 'days'),
    '山の日': dayjs(now).month(7).date(11).hour(0).minute(0).second(0).diff(now, 'days'),
    '敬老の日': dayjs(now).month(8).date(19).hour(0).minute(0).second(0).diff(now, 'days'),
    '体育の日': dayjs(now).month(9).date(10).hour(0).minute(0).second(0).diff(now, 'days'),
    '文化の日': dayjs(now).month(10).date(3).hour(0).minute(0).second(0).diff(now, 'days'),
    '勤労感謝の日': dayjs(now).month(10).date(23).hour(0).minute(0).second(0).diff(now, 'days'),
    '天皇誕生日': dayjs(now).month(11).date(23).hour(0).minute(0).second(0).diff(now, 'days'),
    '春分の日': dayjs(now).month(2).date(20).hour(0).minute(0).second(0).diff(now, 'days'),
    '秋分の日': dayjs(now).month(8).date(22).hour(0).minute(0).second(0).diff(now, 'days')
  };
  const today = dayjs(now);
  const yesterday = dayjs(now).add(-1, 'days');
  const tomorrow = dayjs(now).add(1, 'days');
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
  const matched = patternMatch(inputStrs.join(''), pattern, map);
  for (const [, match] of matched.entries()) {
    expect(match.getRelative(match.elem, now.toDate().getTime())).toStrictEqual(inputs[match.elem]);
  }
  // '全てのパターンにmatchしている'
  expect(matched.length).toStrictEqual(inputStrs.length);
});
