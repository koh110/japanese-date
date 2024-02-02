import moment from 'moment';

import { createReplacer, addReplacer, patternMatch } from './lib/jpdate-lib/index.js';
import { replacer as _timeReplacer } from './time/index.js'
import { replacer as _dateReplacer } from './date/index.js'
import { replacer as _yearReplacer } from './year/index.js'
const timeReplacer = createReplacer('seconds', _timeReplacer);
const dateReplacer = createReplacer('days', _dateReplacer);
const yearReplacer = createReplacer('years', _yearReplacer);
const { pattern, map } = addReplacer([timeReplacer, dateReplacer, yearReplacer]);

export const match = (str = '', now = Date.now()) => {
  const results = patternMatch(str, pattern, map);
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

type PatternMatchResponse = ReturnType<typeof patternMatch>

export const getDate = (str = '', now = Date.now()) => {
  const results = patternMatch(str, pattern, map);
  const res: Date[] = [];
  const tmp: {
    years: PatternMatchResponse[number] | null
    days: PatternMatchResponse[number] | null
    seconds: PatternMatchResponse[number] | null
  } = {
    years: null,
    days: null,
    seconds: null
  };
  const clearTmp = () => {
    tmp.years = null;
    tmp.days = null;
    tmp.seconds = null;
  };
  const pushRes = () => {
    let tmpNow = now;
    const date = moment(now);
    if (tmp.years) {
      const relative = tmp.years.getRelative(tmp.years.elem, tmpNow);
      if (relative === null) {
        clearTmp();
        return;
      }
      date.add(relative, 'years');
      tmpNow = date.toDate().getTime();
    }
    if (tmp.days) {
      const relative = tmp.days.getRelative(tmp.days.elem, tmpNow);
      if (relative === null) {
        clearTmp();
        return;
      }
      date.add(relative, 'days');
      tmpNow = date.toDate().getTime();
    }
    if (tmp.seconds) {
      const relative = tmp.seconds.getRelative(tmp.seconds.elem, tmpNow);
      if (relative === null) {
        clearTmp();
        return;
      }
      date.add(relative, 'seconds');
      tmpNow = date.toDate().getTime();
    }
    res.push(date.toDate());
    clearTmp();
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
