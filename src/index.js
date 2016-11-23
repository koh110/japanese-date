'use strict';

const moment = require('moment');

const dateReplacer = require('./date').replacer;
const yearReplacer = require('./year').replacer;
const addPatterns = [].concat(dateReplacer.patterns).concat(yearReplacer.patterns);
const pattern = new RegExp(addPatterns.join('|'), 'g');
const patternMap = new Map();

for (const entry of dateReplacer.map.entries()) {
  entry[1].type = 'days';
  patternMap.set(entry[0], entry[1]);
}
for (const entry of yearReplacer.map.entries()) {
  entry[1].type = 'years';
  patternMap.set(entry[0], entry[1]);
}

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
    days: null
  };
  const pushRes = () => {
    const date = moment(now);
    if (tmp.years) {
      date.add(tmp.years.relative, 'years');
    }
    if (tmp.days) {
      date.add(tmp.days.relative, 'days');
    }
    res.push(date.toDate());
    tmp.years = null;
    tmp.days = null;
  };
  for (const elem of results) {
    if (elem.type === 'years') {
      if (tmp.years || tmp.days) {
        pushRes();
      }
      tmp.years = elem;
    } else if (elem.type === 'days') {
      if (tmp.days) {
        pushRes();
      }
      tmp.days = elem;
    }
  }
  if (tmp.years || tmp.days) {
    pushRes();
  }
  return res;
};
exports.getDate = getDate;
