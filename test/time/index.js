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

const { createReplacer, addReplacer, patternMatch } = require('src/node_modules/jpdate-lib');
const { replacer } = require('src/time');

test('check match pattern', (t) => {
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
    '12:34:56': moment({ hour: 12, minute: 34, second: 56 }).diff(nowMoment, 'seconds')
  };

  const inputStrs = Object.keys(inputs);
  const matched = patternMatch(inputStrs.join(''), pattern, map, now);
  t.is(matched.length, inputStrs.length, '全てのパターンにマッチしている');
  for (const entry of matched.entries()) {
    const match = entry[1];
    t.is(match.getRelative(match.elem, now), inputs[match.elem], `[${match.elem}]のパターン`);
  }
});
