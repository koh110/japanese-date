'use strict';

const moment = require('moment');

const { kansuujiPattern } = require('jpdate-lib');
const { convertNum } = require('jpdate-util');
const { beforeAfterPattern, beforeAfterRegExp } = require('date-utils');

// 日付表記

module.exports = {
  pattern: [
    `((${kansuujiPattern}|[0-9０-９]{4})(/|-|年))?`,
    `(${kansuujiPattern}|[0-9０-９]{1,2})(/|-|月)`,
    `(${kansuujiPattern}|[0-9０-９]{1,2})日?`,
    `(の?${beforeAfterPattern})?`
  ].join(''),
  getRelative: (inputStr, now = Date.now()) => {
    const match = inputStr.match(/((.+)(\/|-|年))?(.+)(\/|-|月)(.+)日?/);
    const nowMoment = moment(now);
    let convert = convertNum(match[2]);
    const year = convert ? convert : nowMoment.year();
    convert = convertNum(match[4]);
    const month = convert ? convert - 1 : nowMoment.month();
    convert = convertNum(match[6]);
    const date = convert ? convert : nowMoment.date();

    const inputMoment = moment(now).set({
      year: year,
      month: month,
      date: date
    });

    // 何日前/後の指定がされていたら
    const beforeAfter = inputStr.match(beforeAfterRegExp);
    if (beforeAfter) {
      let num = convertNum(beforeAfter[1]);
      if (/(まえ|前)/.test(inputStr)) {
        num = num * (-1);
      }
      inputMoment.add(num, 'days');
    }

    const diff = inputMoment.diff(now, 'days');
    return diff;
  }
};
