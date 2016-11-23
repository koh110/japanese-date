'use strict';

const test = require('ava').test;
const sinon = require('sinon');

const year = require('src/year');

test.beforeEach((t) => {
  t.context.timer = sinon.useFakeTimers(new Date('2016/1/22 12:34:56').getTime(), 'Date');
});
test.afterEach((t) => {
  t.context.timer = sinon.restore();
});

test('getReplacer', (t) => {
  const replacer = year.replacer;
  t.true(replacer.hasOwnProperty('map'));
});
