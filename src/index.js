'use strict';

const moment = require('moment');

const { createReplacer, addReplacer } = require('./lib');
const timeReplacer = createReplacer('seconds', require('./time').replacer);
const dateReplacer = createReplacer('days', require('./date').replacer);
const yearReplacer = createReplacer('years', require('./year').replacer);
const { pattern, map } = addReplacer([timeReplacer, dateReplacer, yearReplacer]);

const match = (str = '', now = Date.now()) => {
  let result;
  const results = [];
  while ((result = pattern.exec(str)) !== null) {
    const matchStr = result[0];
    for (const entry of map.entries()) {
      const regexp = entry[0];
      if (regexp.test(matchStr)) {
        const replace = entry[1];
        results.push({
          index: result.index,
          elem: result[0],
          relative: replace.getRelative(matchStr, now),
          type: replace.type
        });
        break;
      }
    }
  }
  return results;
};
exports.match = match;

const getDate = (str = '', now = Date.now()) => {
  const results = match(str, now);
  const res = [];
  const tmp = {
    years: null,
    days: null,
    seconds: null
  };
  const pushRes = () => {
    const date = moment(now);
    if (tmp.years) {
      date.add(tmp.years.relative, 'years');
    }
    if (tmp.days) {
      date.add(tmp.days.relative, 'days');
    }
    if (tmp.seconds) {
      date.add(tmp.seconds.relative, 'seconds');
    }
    res.push(date.toDate());
    tmp.years = null;
    tmp.days = null;
    tmp.seconds = null;
  };
  for (const elem of results) {
    if (elem.type === 'years') {
      if (tmp.years || tmp.days || tmp.seconds) {
        pushRes();
      }
      tmp.years = elem;
    } else if (elem.type === 'days') {
      if (tmp.days || tmp.seconds) {
        pushRes();
      }
      tmp.days = elem;
    } else if (elem.type === 'seconds') {
      if (tmp.seconds) {
        pushRes();
      }
      tmp.seconds = elem;
    }
  }
  if (tmp.years || tmp.days || tmp.seconds) {
    pushRes();
  }
  return res;
};
exports.getDate = getDate;
