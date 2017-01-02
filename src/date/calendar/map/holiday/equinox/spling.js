'use strict';

const moment = require('moment');

// 春分の日
const date = {
  2000: 20, 2001: 20, 2002: 21, 2003: 21, 2004: 20,
  2005: 20, 2006: 21, 2007: 21, 2008: 20, 2009: 20,
  2010: 21, 2011: 21, 2012: 20, 2013: 20, 2014: 21,
  2015: 21, 2016: 20, 2017: 20, 2018: 21, 2019: 21,
  2020: 20, 2021: 20, 2022: 21, 2023: 21, 2024: 20,
  2025: 20, 2026: 20, 2027: 21, 2028: 20, 2029: 20,
  2030: 20
};

module.exports = [/(春分|しゅんぶん)の(日|ひ)/, (str, now = Date.now()) => {
  const year = moment(now).year();
  if (!date[year]) {
    return null;
  }
  const setDate = date[year];
  return moment(now).set({ month: 2, date: setDate });
}];
