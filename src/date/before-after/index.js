'use strict';

// 何日前/後のパターン

const { beforeAfterPattern, beforeAfterRegExp } = require('date-utils');

const { convertNum } = require('jpdate-util');

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
