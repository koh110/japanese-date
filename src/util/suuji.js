'use strict';

const zenTohan = require('./zentohan');

const suujiReplaceMap = {
  '零': '〇', '壱': '一', '弐': '二', '参': '三',
  '拾': '十', '萬': '万'
};
const suujiReplaceExp = new RegExp(`(${Object.keys(suujiReplaceMap).join('|')})`, 'g');
const suujiMap = {
  '〇': 0, '一': 1, '二': 2, '三': 3, '四': 4,
  '五': 5, '六': 6, '七': 7, '八': 8, '九': 9
};
const suujiMapRegExp = new RegExp(`(${Object.keys(suujiMap).join('|')})`, 'g');
const lowKetaMap = {
  '十': Math.pow(10, 1),
  '百': Math.pow(10, 2),
  '千': Math.pow(10, 3)
};
const highKetaMap = {
  '万': Math.pow(10, 4),
  '億': Math.pow(10, 8),
  '兆': Math.pow(10, 12),
  '京': Math.pow(10, 16),
  '垓': Math.pow(10, 20),
  '秭': Math.pow(10, 24),
  '𥝱': Math.pow(10, 24),
  '穰': Math.pow(10, 28),
  '溝': Math.pow(10, 32),
  '澗': Math.pow(10, 36),
  '正': Math.pow(10, 40),
  '載': Math.pow(10, 44),
  '極': Math.pow(10, 48),
  '恒河沙': Math.pow(10, 52),
  '阿僧祇': Math.pow(10, 56),
  '那由他': Math.pow(10, 60),
  '不可思議': Math.pow(10, 64),
  '無量大数': Math.pow(10, 68)
};
const highKetaRegExp = new RegExp(`(${Object.keys(highKetaMap).join('|')})`, 'g');

const kansuuji = [
  Object.keys(suujiReplaceMap).join('|'),
  Object.keys(suujiMap).join('|'),
  Object.keys(lowKetaMap).join('|'),
  Object.keys(highKetaMap).join('|')
].join('|');
const kansuujiRegExp = new RegExp(`[${kansuuji}]+`, 'g');

exports.kansuujiRegExp = kansuujiRegExp;

// 千以下の数字の計算
const calcUnderNum = (input) => {
  if (/^[0-9]+$/.exec(input)) {
    return Number(input);
  }
  let total = 0;
  let tmp = 0;
  for (let i = 0; i < input.length; i++) {
    const code = input.charAt(i);
    if (lowKetaMap[code]) {
      if (tmp > 0) {
        total += tmp * lowKetaMap[code];
        tmp = 0;
      } else {
        total += lowKetaMap[code];
      }
      continue;
    }
    tmp = Number(code);
  }
  if (tmp > 0) {
    total += tmp;
  }
  return total;
};

exports.kanjiToArabic = (str) => {
  const match = str.match(kansuujiRegExp);
  if (match.length <= 0) {
    return null;
  }
  let res = zenTohan(match[0])
  .replace(suujiReplaceExp, (match) => {
    return suujiReplaceMap[match];
  })
  .replace(suujiMapRegExp, (match) => {
    return suujiMap[match];
  });

  let result;
  let total = 0;
  while ((result = highKetaRegExp.exec(res)) !== null) {
    const unit = res.slice(0, result.index);
    total += calcUnderNum(unit) * highKetaMap[result[0]];
    res = res.slice(result.index + 1);
  }
  total += calcUnderNum(res);
  return total;
};
