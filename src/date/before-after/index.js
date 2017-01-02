'use strict';

// 何日前/後のパターン

const { kansuujiPattern } = require('jpdate-lib');
const { convertNum } = require('jpdate-util');

const beforeAfterPattern = `(${kansuujiPattern}|[0-9０-９]+)日(後|ご|まえ|前)`;
const beforeAfterRegExp = new RegExp(beforeAfterPattern);

module.exports = {
  pattern: `${beforeAfterPattern}`,
  getRelative: (inputStr, now = Date.now()) => {
    const dateMatch = inputStr.match(beforeAfterRegExp);
    const num = convertNum(dateMatch[1]);
    if (/(まえ|前)/.test(inputStr)) {
      return num * (-1);
    }
    return num;
  }
};
