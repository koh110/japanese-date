'use strict';

const moment = require('moment');

const calendarMap = new Map([
  [/クリスマス(イブ)?/, (str, now = Date.now()) => {
    let date = 25;
    if (/イブ/.test(str)) {
      date = 24;
    }
    return moment(now).set({ month: 11, date: date });
  }],
  [/大晦日|おおみそか/, (str, now = Date.now()) => {
    return moment(now).set({ month: 11, date: 31 });
  }],
  [/元日|がんじつ/, (str, now = Date.now()) => {
    return moment(now).set({ month: 0, date: 1 });
  }]
]);

module.exports = calendarMap;
