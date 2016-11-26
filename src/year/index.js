'use strict';

const { convertNum, kansuujiRegExp } = require('../util');
const kansuuji = kansuujiRegExp.toString();
const kansuujiPattern = kansuuji.slice(1, kansuuji.length - 2);

const replacer = [{
  pattern: `(${kansuujiPattern}|[0-9０-９]+)年(後|ご|まえ|前)`,
  getRelative: (inputStr) => {
    let num = convertNum(inputStr);
    if (/(まえ|前)/.test(inputStr)) {
      num = num * (-1);
    }
    return num;
  }
}, {
  pattern: '今年|ことし',
  getRelative: (inputStr) => {
    return 0;
  }
}, {
  pattern: '再来年|さらいねん',
  getRelative: (inputStr) => {
    return 2;
  }
}, {
  pattern: '来年|らいねん',
  getRelative: (inputStr) => {
    return 1;
  }
}, {
  pattern: '去年|きょねん',
  getRelative: (inputStr) => {
    return -1;
  }
}, {
  pattern: '一昨年|おととし',
  getRelative: (inputStr) => {
    return -2;
  }
}];

const patternStrs = [];
const replacementMap = new Map();
for (const elem of replacer) {
  const str = `(${elem.pattern})`;
  patternStrs.push(str);
  elem.type = 'years';
  replacementMap.set(new RegExp(str), elem);
}

const replacerObject = {
  patterns: patternStrs,
  map: replacementMap
};
exports.replacer = replacerObject;
