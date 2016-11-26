'use strict';

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
  elem.type = 'days';
  replacementMap.set(new RegExp(str), elem);
}

const replacerObject = {
  patterns: patternStrs,
  map: replacementMap
};
exports.replacer = replacerObject;
