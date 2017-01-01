'use strict';

const calendar = require('./calendar');
const dateNotation = require('./date-notation');
const beforeAfter = require('./before-after');
const month = require('./month');

const replacer = [calendar, dateNotation, beforeAfter, month, {
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
