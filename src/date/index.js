'use strict';

const util = require('../util');
const kansuuji = util.kansuujiRegExp.toString();
const kansuujiPattern = kansuuji.slice(1, kansuuji.length - 2);

const replacer = [{
  pattern: '([0-9０-９])+日(後|ご|まえ|前)',
  getRelative: (inputStr) => {
    inputStr = util.zenTohan(inputStr);
    const num = inputStr.match(/[0-9]+/);
    let parse = parseInt(num[0], 10);
    if (/(まえ|前)/.test(inputStr)) {
      parse = parse * (-1);
    }
    return parse;
  }
}, {
  pattern: `${kansuujiPattern}日(後|ご|まえ|前)`,
  getRelative: (inputStr) => {
    let num = util.kanjiToArabic(inputStr);
    if (/(まえ|前)/.test(inputStr)) {
      num = num * (-1);
    }
    return num;
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

const patternStrs = [];
const replacementMap = new Map();
for (const elem of replacer) {
  const str = `(${elem.pattern})`;
  patternStrs.push(str);
  replacementMap.set(new RegExp(str), elem);
}

const replacerObject = {
  patterns: patternStrs,
  map: replacementMap
};
exports.replacer = replacerObject;
