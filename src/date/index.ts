import beforeAfter from './before-after/index.js';
import calendar from './calendar/index.js';
import dateNotation from './date-notation/index.js';
import jpRelativeDates from './japanese-relative-dates/index.js';
import month from './month/index.js';
import week from './week/index.js';

export const replacer = [
  calendar,
  dateNotation,
  beforeAfter,
  month,
  week,
  jpRelativeDates,
];
