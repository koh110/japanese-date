'use strict';

const calendar = require('./calendar');
const dateNotation = require('./date-notation');
const beforeAfter = require('./before-after');
const month = require('./month');
const jpRelativeDates = require('./japanese-relative-dates');
const week = require('./week');

const replacer = [calendar, dateNotation, beforeAfter, month, week, jpRelativeDates];

exports.replacer = replacer;
