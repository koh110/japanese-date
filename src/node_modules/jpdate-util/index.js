'use strict';

const zenToHan = require('./zentohan');

const suuji = require('./suuji');

module.exports = {
  zenToHan: zenToHan,
  convertNum: suuji.convertNum,
  kansuujiRegExp: suuji.kansuujiRegExp,
  kanjiToArabic: suuji.kanjiToArabic
};
