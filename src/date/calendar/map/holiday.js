'use strict';

const moment = require('moment');

const { getDateFromNthDay } = require('./lib');

const week = Object.freeze({
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
});

const holidayMap = new Map([
  [/(成人|せいじん)の(日|ひ)/, (str, now = Date.now()) => {
    const nowMoment = moment(now);
    const date = getDateFromNthDay(nowMoment.year(), nowMoment.month(), 2, week.monday, now);
    return date;
  }]
]);
module.exports = holidayMap;
