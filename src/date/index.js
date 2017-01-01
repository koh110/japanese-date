'use strict';

const moment = require('moment');
const { convertRegExpToPattern } = require('../lib');
const { convertNum, kansuujiRegExp } = require('../util');
const kansuujiPattern = convertRegExpToPattern(kansuujiRegExp);

const calendarReplacer = require('./calendar');

const replacer = [calendarReplacer, {
  pattern: `(${kansuujiPattern}|[0-9０-９]+)日(後|ご|まえ|前)`,
  getRelative: (inputStr) => {
    let num = convertNum(inputStr);
    if (/(まえ|前)/.test(inputStr)) {
      num = num * (-1);
    }
    return num;
  }
}, {
  pattern: [
    `((${kansuujiPattern}|[0-9０-９]{4})(/|-|年))?`,
    `(${kansuujiPattern}|[0-9０-９]{1,2})(/|-|月)`,
    `(${kansuujiPattern}|[0-9０-９]{1,2})日?`
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
    const diff = inputMoment.diff(now, 'days');
    return diff;
  }
}, {
  pattern: `((再?来月|先月|今月|こんげつ|さ?らいげつ|せんげつ)の)(${kansuujiPattern}|[0-9０-９]{1,2})日?`,
  getRelative: (inputStr, now = Date.now()) => {
    const numberRegExp = new RegExp(`${kansuujiPattern}|[0-9０-９]{1,2}`);
    const match = inputStr.match(numberRegExp);
    const date = convertNum(match[0]);
    const inputMoment = moment(now).date(date);
    const monthMatch = inputStr.match(/再?来月|先月|今月|こんげつ|さ?らいげつ|せんげつ/);
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
}, {
  pattern: '((再?来週|先週|今週|さ?らいしゅう|せんしゅう|こんしゅう)の)?(日|月|火|水|木|金|土)曜日?',
  getRelative: (inputStr, now = Date.now()) => {
    const week = ['日', '月', '火', '水', '木', '金', '土'];
    const nowDay = new Date(now).getDay();
    const match = /(日|月|火|水|木|金|土)/.exec(inputStr);
    const matchDay = week.indexOf(match[0]);
    let add = matchDay - nowDay;
    const weekMatch = inputStr.match(/再来週|来週|先週|さらいしゅう|らいしゅう|せんしゅう/);
    if (weekMatch) {
      switch (weekMatch[0]) {
      case '来週':
      case 'らいしゅう':
        add += 7;
        break;
      case '再来週':
      case 'さらいしゅう':
        add += 14;
        break;
      case '先週':
      case 'せんしゅう':
        add += -7;
        break;
      }
    }
    return add;
  }
}, {
  pattern: '今日|きょう',
  getRelative: (inputStr) => {
    return 0;
  }
}, {
  pattern: '明日|あした|あす|みょうじつ|翌日|よくじつ',
  getRelative: (inputStr) => {
    return 1;
  }
}, {
  pattern: '明々後日|しあさって',
  getRelative: (inputStr) => {
    return 3;
  }
}, {
  pattern: '明後日|あさって',
  getRelative: (inputStr) => {
    return 2;
  }
}, {
  pattern: '一昨日|おととい',
  getRelative: (inputStr) => {
    return -2;
  }
}, {
  pattern: '昨日|きのう|さくじつ',
  getRelative: (inputStr) => {
    return -1;
  }
}];

exports.replacer = replacer;
