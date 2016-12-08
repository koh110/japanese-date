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
const { replacer } = require('src/time');

test('check match pattern', (t) => {
  const { pattern, map } = addReplacer([createReplacer('years', replacer)]);
  const now = moment();
  const inputs = {
    '一分後': 1 * 60, '１５時間前': -15 * 60 * 60, '20秒まえ': -20,
    '一時間半後': 1 * 60 * 60 + 30 * 60,
    '１０時': moment({ hour: 10 }).diff(now, 'seconds'),
    '十時二十分': moment({ hour: 10, minute: 20 }).diff(now, 'seconds'),
    '十壱時半': moment({ hour: 11, minute: 30 }).diff(now, 'seconds'),
    '十時二十分三十五秒': moment({ hour: 10, minute: 20, second: 35 }).diff(now, 'seconds'),
    '正午': moment({ hour: 12, minute: 0, second: 0 }).diff(now, 'seconds'),
    '午後三時拾五分': moment({ hour: 15, minute: 15, second: 0 }).diff(now, 'seconds')
  };

  const inputStrs = Object.keys(inputs);
  const matched = patternMatch(inputStrs.join(''), pattern, map, Date.now());
  t.is(matched.length, inputStrs.length, '全てのパターンにマッチしている');
  for (const entry of matched.entries()) {
    const match = entry[1];
    t.is(match.relative, inputs[match.elem], `[${match.elem}]のパターン`);
  }
});
