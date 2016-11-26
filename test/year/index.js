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
const { replacer } = require('src/year');

test('check match pattern', (t) => {
  const { pattern, map } = addReplacer([createReplacer('years', replacer)]);
  const inputs = {
    '今年': 0, '来年': 1, '再来年': 2,
    '去年': -1, '一昨年': -2,
    '一年後': 1, '二十年前': -20
  };
  const next = moment().add(1, 'years');
  // YYYY/MM/DD
  inputs[next.format('YYYY年')] = 1;

  const inputStrs = Object.keys(inputs);
  const matched = patternMatch(inputStrs.join(''), pattern, map, Date.now());
  t.is(matched.length, inputStrs.length);
  for (const entry of matched.entries()) {
    const match = entry[1];
    t.is(match.relative, inputs[match.elem], `[${match.elem}]のパターンが間違っています`);
  }
});
