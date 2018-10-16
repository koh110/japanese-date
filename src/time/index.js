'use strict';

const moment = require('moment');
const { convertNum } = require('jpdate-util');
const { kansuujiPattern } = require('jpdate-lib');
const { beforeAfterPattern, beforeAfterRegExp } = require('date-utils');

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
  pattern: '[0-2０-２]?[0-9０-９]:[0-5０-５][0-9０-９](:[0-5０-５][0-9０-９])?',
  getRelative: (inputStr, now = Date.now()) => {
    const splitChars = inputStr.split(':');
    const hour = splitChars[0];
    const minute = splitChars[1];
    const seconds = splitChars[2] ? splitChars[2] : 0;
    const diff = moment(now).set({ hour, minute, seconds }).diff(now, 'seconds');
    return diff;
  }
}, {
  pattern: '正午',
  getRelative: (inputStr, now = Date.now()) => {
    const diff = moment(now).set({ hour: 12, minute: 0, seconds: 0 }).diff(now, 'seconds');
    return diff;
  }
}, {
  pattern: `(${kansuujiPattern}|[0-9０-９]{1,2})時半`,
  getRelative: (inputStr, now = Date.now()) => {
    const match = inputStr.match(/((.+)時)/);
    const hour = convertNum(match[2]);
    const diff = moment({ hour: hour, minute: 30 }).diff(now, 'seconds');
    return diff;
  }
}, {
  pattern: [
    '(午前|ごぜん|午後|ごご)?',
    `(${kansuujiPattern}|[0-9０-９]{1,2})時`,
    `((${kansuujiPattern}|[0-9０-９]{1,2})分)?`,
    `((${kansuujiPattern}|[0-9０-９]{1,2})秒)?`,
    `(の${beforeAfterPattern})?`
  ].join(''),
  getRelative: (inputStr, now = Date.now()) => {
    const match = inputStr.match(/((.+)時)?((.+)分)?((.+)秒)?/);
    const dateObj = {};
    const hour = convertNum(match[2]);
    if (hour) {
      let add = 0;
      if (/午後|ごご/.test(inputStr) && hour <= 12) {
        add = 12;
      }
      dateObj.hour = hour + add;
    }
    const minute = convertNum(match[4]);
    dateObj.minute = minute ? minute : 0;
    const second = convertNum(match[6]);
    dateObj.second = second ? second : 0;
    const inputMoment = moment(now).set(dateObj);

    // 何日前/後の指定がされていたら
    const beforeAfter = inputStr.match(beforeAfterRegExp);
    if (beforeAfter) {
      let num = convertNum(beforeAfter[1]);
      if (/(まえ|前)/.test(inputStr)) {
        num = num * (-1);
      }
      inputMoment.add(num, 'days');
    }

    const num = (inputMoment.toDate().getTime() - now) / 1000;

    return num;
  }
}];

exports.replacer = replacer;
