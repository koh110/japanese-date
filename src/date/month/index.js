'use strict';

// 今月/先月...のパターン

const { kansuujiPattern, convertRegExpToPattern } = require('jpdate-lib');
const { convertNum } = require('jpdate-util');
const moment = require('moment');

const monthRegExp = /(再?来月|先月|今月|こんげつ|さ?らいげつ|せんげつ)/;
const monthPattern = convertRegExpToPattern(monthRegExp);
const hinichiPattern = `(${kansuujiPattern}|[0-9０-９]+)日?`;
const hinichiRegExp = new RegExp(hinichiPattern);

module.exports = {
  pattern: `(${monthPattern}の)${hinichiPattern}`,
  getRelative: (inputStr, now = Date.now()) => {
    const dateMatch = inputStr.match(hinichiRegExp);
    const date = convertNum(dateMatch[1]);
    const inputMoment = moment(now).date(date);
    const monthMatch = inputStr.match(monthRegExp);
    let add = 0;
    if (monthMatch) {
      switch (monthMatch[0]) {
      case '来月':
      case 'らいげつ':
        add = 1;
        break;
      case '再来月':
      case 'さらいげつ':
        add = 2;
        break;
      case '先月':
      case 'せんげつ':
        add = -1;
        break;
      }
    }
    inputMoment.add(add, 'month');
    const diff = inputMoment.diff(now, 'days');
    return diff;
  }
};
