'use strict';

const moment = require('moment');
const { convertNum, kansuujiRegExp } = require('../util');
const kansuuji = kansuujiRegExp.toString();
const kansuujiPattern = kansuuji.slice(1, kansuuji.length - 2);

const replacer = [{
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
    const inputMoment = moment({
      year: year,
      month: month,
      date: date,
      hour: nowMoment.hour(),
      minute: nowMoment.minute(),
      second: nowMoment.second(),
      millisecond: nowMoment.millisecond()
    });
    const diff = inputMoment.diff(now, 'days');
    return diff;
  }
}, {
  pattern: '((再?来週|先週|今週)の)?(日|月|火|水|木|金|土)曜日?',
  getRelative: (inputStr, now = Date.now()) => {
    const week = ['日', '月', '火', '水', '木', '金', '土'];
    const nowDay = new Date(now).getDay();
    const match = /(日|月|火|水|木|金|土)/.exec(inputStr);
    const matchDay = week.indexOf(match[0]);
    let add = matchDay - nowDay;
    const weekMatch = inputStr.match(/再来週|来週|先週|今週/);
    if (weekMatch) {
      switch (weekMatch[0]) {
      case '来週':
        add += 7;
        break;
      case '再来週':
        add += 14;
        break;
      case '先週':
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
