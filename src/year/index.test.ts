import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import dayjs from 'dayjs';
import {
  createReplacer,
  addReplacer,
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
  const inputs = {
    今年: 0,
    来年: 1,
    再来年: 2,
    去年: -1,
    一昨年: -2,
    一年後: 1,
    二十年前: -20,
  };
  const next = dayjs().add(1, 'years');
  // YYYY/MM/DD
  inputs[next.format('YYYY年')] = 1;

  const inputStrs = Object.keys(inputs);
  const now = Date.now();
  const matched = patternMatch(inputStrs.join(''), pattern, map);
  expect(matched.length).toStrictEqual(inputStrs.length);
  for (const entry of matched.entries()) {
    const match = entry[1];
    expect(match.getRelative(match.elem, now)).toStrictEqual(
      inputs[match.elem],
    );
  }
});
