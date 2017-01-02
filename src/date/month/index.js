'use strict';

// 今月/先月...のパターン

const { kansuujiPattern, convertRegExpToPattern } = require('jpdate-lib');
const { convertNum } = require('jpdate-util');
const { dayRegExp, getDayFromStr } = require('day-utils');
const getMomentFromNthDay = require('get-moment-from-nth-day');
const moment = require('moment');

const monthPattern = '(再?来月|先月|今月|こんげつ|さ?らいげつ|せんげつ)';
const monthRegExp = new RegExp(monthPattern);

const hinichiPattern = `(${kansuujiPattern}|[0-9０-９]+)日?`;
const hinichiRegExp = new RegExp(hinichiPattern);

const japaneseRelativeDates = require('../japanese-relative-dates');
const japaneseRelativeDatesRegExp = new RegExp(japaneseRelativeDates.pattern);

// 第[0-9]o曜日のパターン
const dayPattern = convertRegExpToPattern(dayRegExp);

module.exports = {
  pattern: `(${monthPattern}の)(${dayPattern}|${hinichiPattern}|${japaneseRelativeDates.pattern})`,
  getRelative: (inputStr, now = Date.now()) => {
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

    const inputMoment = moment(now).add(add, 'month');
    if (japaneseRelativeDatesRegExp.test(inputStr)) {
      const relative = japaneseRelativeDates.getRelative(inputStr);
      inputMoment.add(relative, 'days');
    } else if (dayRegExp.test(inputStr)) {
      const match = inputStr.match(dayRegExp);
      const nth = convertNum(match[3]);
      const day = getDayFromStr(inputStr);
      const resMoment = getMomentFromNthDay(inputMoment.year(), inputMoment.month(), nth, day, now);
      inputMoment.date(resMoment.date());
    } else {
      const dateMatch = inputStr.match(hinichiRegExp);
      const date = convertNum(dateMatch[1]);
      inputMoment.date(date);
    }

    const diff = inputMoment.diff(now, 'days');
    return diff;
  }
};
