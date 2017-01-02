'use strict';

const calendar = require('./calendar');
const holiday = require('./holiday');

const map = new Map([
  ...calendar,
  ...holiday
]);

module.exports = map;
