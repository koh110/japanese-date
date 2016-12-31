'use strict';

const moment = require('moment');

const { createReplacer, addReplacer, patternMatch } = require('./lib');
const timeReplacer = createReplacer('seconds', require('./time').replacer);
const dateReplacer = createReplacer('days', require('./date').replacer);
const yearReplacer = createReplacer('years', require('./year').replacer);
const { pattern, map } = addReplacer([timeReplacer, dateReplacer, yearReplacer]);

const match = (str = '', now = Date.now()) => {
  const results = patternMatch(str, pattern, map, now);
  const res = results.map((elem) => {
    return {
      index: elem.index,
      elem: elem.elem,
      relative: elem.getRelative(elem.elem, now),
      type: elem.type
    };
  });
  return res;
};
exports.match = match;

const getDate = (str = '', now = Date.now()) => {
  const results = patternMatch(str, pattern, map, now);
  const res = [];
  const tmp = {
    years: null,
    days: null,
    seconds: null
  };
  const pushRes = () => {
    let tmpNow = now;
    const date = moment(now);
    if (tmp.years) {
      date.add(tmp.years.getRelative(tmp.years.elem, tmpNow), 'years');
      tmpNow = date.toDate().getTime();
    }
    if (tmp.days) {
      date.add(tmp.days.getRelative(tmp.days.elem, tmpNow), 'days');
      tmpNow = date.toDate().getTime();
    }
    if (tmp.seconds) {
      date.add(tmp.seconds.getRelative(tmp.seconds.elem, tmpNow), 'seconds');
      tmpNow = date.toDate().getTime();
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
