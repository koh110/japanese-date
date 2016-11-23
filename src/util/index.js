'use strict';

const zenTohan = require('./zenTohan');

const suuji = require('./suuji');

module.exports = {
  zenTohan: zenTohan,
  kansuujiRegExp: suuji.kansuujiRegExp,
  kanjiToArabic: suuji.kanjiToArabic
};
