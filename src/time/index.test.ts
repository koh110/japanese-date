import dayjs from 'dayjs';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import {
  addReplacer,
  createReplacer,
  patternMatch,
} from '../lib/jpdate-lib/index.js';
import { replacer } from './index.js';

beforeEach(() => {
  const now = dayjs('2016-01-22 01:23:45');
  vi.useFakeTimers();
  vi.setSystemTime(now.toDate());
});
afterEach(() => {
  vi.useRealTimers();
});

test('check match pattern', () => {
  const { pattern, map } = addReplacer([createReplacer('years', replacer)]);
  const now = Date.now();
  const nowInstance = dayjs(now);
  const inputs = {
    一分後: 1 * 60,
    '１５時間前': -15 * 60 * 60,
    '20秒まえ': -20,
    一時間半後: 1 * 60 * 60 + 30 * 60,
    '１０時': dayjs(now)
      .hour(10)
      .minute(0)
      .second(0)
      .diff(nowInstance, 'seconds'),
    十時二十分: dayjs(now)
      .hour(10)
      .minute(20)
      .second(0)
      .diff(nowInstance, 'seconds'),
    十壱時半: dayjs(now)
      .hour(11)
      .minute(30)
      .second(0)
      .diff(nowInstance, 'seconds'),
    十時二十分三十五秒: dayjs(now)
      .hour(10)
      .minute(20)
      .second(35)
      .diff(nowInstance, 'seconds'),
    正午: dayjs(now).hour(12).minute(0).second(0).diff(nowInstance, 'seconds'),
    午後三時拾五分: dayjs(now)
      .hour(15)
      .minute(15)
      .second(0)
      .diff(nowInstance, 'seconds'),
    '9:12:04': dayjs(now)
      .hour(9)
      .minute(12)
      .second(4)
      .diff(nowInstance, 'seconds'),
    '10:23': dayjs(now)
      .hour(10)
      .minute(23)
      .second(0)
      .diff(nowInstance, 'seconds'),
    '12:34:56': dayjs(now)
      .hour(12)
      .minute(34)
      .second(56)
      .diff(nowInstance, 'seconds'),
    '12時半': dayjs(now)
      .hour(12)
      .minute(30)
      .second(0)
      .diff(nowInstance, 'seconds'),
    '1時半': dayjs(now)
      .hour(1)
      .minute(30)
      .second(0)
      .diff(nowInstance, 'seconds'),
  };

  const inputStrs = Object.keys(inputs);
  const matched = patternMatch(inputStrs.join(''), pattern, map);
  // '全てのパターンにマッチしている'
  expect(matched.length).toStrictEqual(inputStrs.length);
  for (const entry of matched.entries()) {
    const match = entry[1];
    expect(match.getRelative(match.elem, now)).toStrictEqual(
      inputs[match.elem],
    );
  }
});
