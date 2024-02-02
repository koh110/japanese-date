import type { RelativeReplacer } from '../type.js'
import moment from 'moment';
import { convertNum } from '../lib/jpdate-util/index.js';
import { kansuujiPattern } from '../lib/jpdate-lib/index.js';

export const replacer: RelativeReplacer[] = [{
  pattern: `(${kansuujiPattern}|[0-9０-９]+)年(後|ご|まえ|前)`,
  getRelative: (inputStr) => {
    let num = convertNum(inputStr);
    if (!num) {
      return null;
    }
    if (/(まえ|前)/.test(inputStr)) {
      num = num * (-1);
    }
    return num;
  }
}, {
  pattern: `((${kansuujiPattern}|[0-9０-９]{4})+年)`,
  getRelative: (inputStr, now = Date.now()) => {
    const match = inputStr.match(/((.+)年)/);
    if (!match) {
      return null;
    }
    const year = convertNum(match[2]);
    if (!year) {
      return null
    }
    const nowMoment = moment(now);
    const inputMoment = moment(now).year(year);
    const diff = inputMoment.diff(nowMoment, 'years');
    return diff;
  }
}, {
  pattern: '今年|ことし',
  getRelative: (inputStr) => {
    return 0;
  }
}, {
  pattern: '再来年|さらいねん',
  getRelative: (inputStr) => {
    return 2;
  }
}, {
  pattern: '来年|らいねん',
  getRelative: (inputStr) => {
    return 1;
  }
}, {
  pattern: '去年|きょねん',
  getRelative: (inputStr) => {
    return -1;
  }
}, {
  pattern: '一昨年|おととし',
  getRelative: (inputStr) => {
    return -2;
  }
}];
