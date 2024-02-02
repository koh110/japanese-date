import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import moment from 'moment'
import { createReplacer, addReplacer, patternMatch } from '../lib/jpdate-lib/index.js';
import { replacer } from './index.js';

beforeEach(() => {
  const now = moment('2016-01-22 01:23:45');
  vi.useFakeTimers();
  vi.setSystemTime(now.toDate());
});
afterEach(() => {
  vi.useRealTimers();
});

test('check match pattern', () => {
  const { pattern, map } = addReplacer([createReplacer('years', replacer)]);
  const now = Date.now();
  const nowMoment = moment(now);
  const inputs = {
    '一分後': 1 * 60, '１５時間前': -15 * 60 * 60, '20秒まえ': -20,
    '一時間半後': 1 * 60 * 60 + 30 * 60,
    '１０時': moment({ hour: 10 }).diff(nowMoment, 'seconds'),
    '十時二十分': moment({ hour: 10, minute: 20 }).diff(nowMoment, 'seconds'),
    '十壱時半': moment({ hour: 11, minute: 30 }).diff(nowMoment, 'seconds'),
    '十時二十分三十五秒': moment({ hour: 10, minute: 20, second: 35 }).diff(nowMoment, 'seconds'),
    '正午': moment({ hour: 12, minute: 0, second: 0 }).diff(nowMoment, 'seconds'),
    '午後三時拾五分': moment({ hour: 15, minute: 15, second: 0 }).diff(nowMoment, 'seconds'),
    '9:12:04': moment({ hour: 9, minute: 12, second: 4 }).diff(nowMoment, 'seconds'),
    '10:23': moment({ hour: 10, minute: 23, second: 0 }).diff(nowMoment, 'seconds'),
    '12:34:56': moment({ hour: 12, minute: 34, second: 56 }).diff(nowMoment, 'seconds'),
    '12時半': moment({ hour: 12, minute: 30, second: 0 }).diff(nowMoment, 'seconds'),
    '1時半': moment({ hour: 1, minute: 30, second: 0 }).diff(nowMoment, 'seconds')
  };

  const inputStrs = Object.keys(inputs);
  const matched = patternMatch(inputStrs.join(''), pattern, map);
  // '全てのパターンにマッチしている'
  expect(matched.length).toStrictEqual(inputStrs.length);
  for (const entry of matched.entries()) {
    const match = entry[1];
    expect(match.getRelative(match.elem, now)).toStrictEqual(inputs[match.elem]);
  }
});
