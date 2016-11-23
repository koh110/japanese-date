'use strict';

const util = require('../util');
const kansuuji = util.kansuujiRegExp.toString();
const kansuujiPattern = kansuuji.slice(1, kansuuji.length - 2);

const replacer = [{
  pattern: `(${kansuujiPattern}|[0-9０-９]+)(秒|分|時間)(後|ご|まえ|前)`,
  getRelative: (inputStr) => {
    let num = null;
    if (util.kansuujiRegExp.test(inputStr)) {
      num = util.kanjiToArabic(inputStr);
    } else {
      inputStr = util.zenTohan(inputStr);
      const parse = inputStr.match(/[0-9]+/);
      num = parseInt(parse[0], 10);
    }
    const unit = inputStr.match(/秒|分|時間/);
    if (unit[0] === '分') {
      num = num * 60;
    } else if (unit[0] === '時間') {
      num = num * 3600;
    }
    if (/(まえ|前)/.test(inputStr)) {
      num = num * (-1);
    }
    return num;
  }
}];

const patternStrs = [];
const replacementMap = new Map();
for (const elem of replacer) {
  const str = `(${elem.pattern})`;
  patternStrs.push(str);
  elem.type = 'seconds';
  replacementMap.set(new RegExp(str), elem);
}

const replacerObject = {
  patterns: patternStrs,
  map: replacementMap
};
exports.replacer = replacerObject;
