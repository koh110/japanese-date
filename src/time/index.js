'use strict';

const moment = require('moment');
const { convertNum, kansuujiRegExp } = require('../util');
const kansuuji = kansuujiRegExp.toString();
const kansuujiPattern = kansuuji.slice(1, kansuuji.length - 2);

const replacer = [{
  pattern: `(${kansuujiPattern}|[0-9０-９]+)(秒|分|時間半?)(後|ご|まえ|前)`,
  getRelative: (inputStr) => {
    let num = convertNum(inputStr);
    const unit = inputStr.match(/秒|分|時間/);
    if (unit[0] === '分') {
      num = num * 60;
    } else if (unit[0] === '時間') {
      num = num * 3600;
      if (/半/.test(inputStr)) {
        num += 1800;
      }
    }
    if (/(まえ|前)/.test(inputStr)) {
      num = num * (-1);
    }
    return num;
  }
}, {
  pattern: `(${kansuujiPattern}|[0-9０-９]{2})時半`,
  getRelative: (inputStr, now = Date.now()) => {
    const match = inputStr.match(/((.+)時)/);
    const hour = convertNum(match[2]);
    const diff = moment({ hour: hour, minute: 30 }).diff(now, 'seconds');
    return diff;
  }
}, {
  pattern: [
    `(${kansuujiPattern}|[0-9０-９]{1,2})時`,
    `((${kansuujiPattern}|[0-9０-９]{1,2})分)?`,
    `((${kansuujiPattern}|[0-9０-９]{1,2})秒)?`
  ].join(''),
  getRelative: (inputStr, now = Date.now()) => {
    const match = inputStr.match(/((.+)時)?((.+)分)?((.+)秒)?/);
    const dateObj = {};
    const hour = convertNum(match[2]);
    if (hour) {
      dateObj.hour = hour;
    }
    const minute = convertNum(match[4]);
    if (minute) {
      dateObj.minute = minute;
    }
    const second = convertNum(match[6]);
    if (second) {
      dateObj.second = second;
    }
    const date = moment(dateObj).toDate();
    const num = (date.getTime() - now) / 1000;

    return num;
  }
}];

exports.replacer = replacer;
