'use strict';

const moment = require('moment');

const timeReplacer = require('./time').replacer;
const dateReplacer = require('./date').replacer;
const yearReplacer = require('./year').replacer;
const addPatterns = [...timeReplacer.patterns, ...dateReplacer.patterns, ...yearReplacer.patterns];
const pattern = new RegExp(addPatterns.join('|'), 'g');
const patternMap = new Map([...timeReplacer.map, ...dateReplacer.map, ...yearReplacer.map]);

const match = (str = '', now = Date.now()) => {
  let result;
  const results = [];
  while ((result = pattern.exec(str)) !== null) {
    const matchStr = result[0];
    for (const regexp of patternMap.keys()) {
      if (regexp.test(matchStr)) {
        const replace = patternMap.get(regexp);
        results.push({
          index: result.index,
          elem: result[0],
          relative: replace.getRelative(matchStr),
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
