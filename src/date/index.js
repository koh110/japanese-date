'use strict';

const calendar = require('./calendar');
const dateNotation = require('./date-notation');
const beforeAfter = require('./before-after');
const month = require('./month');
const jpRelativeDates = require('./japanese-relative-dates');

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
}, jpRelativeDates];

exports.replacer = replacer;
