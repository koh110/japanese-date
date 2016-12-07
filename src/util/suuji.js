'use strict';

const zenToHan = require('./zentohan');

const kyuujiReplaceMap = {
  '零': '〇',
  '壱': '一', '壹': '一', '弌': '一',
  '弐': '二', '貳': '二', '貮': '二',
  '参': '三', '參': '三', '弎': '三',
  '肆': '四', '伍': '五', '陸': '六',
  '漆': '七', '柒': '七', '捌': '八',
  '玖': '九', '拾': '十',
  '廿': '二十', '卄': '二十',
  '卅': '三十', '丗': '三十',
  '卌': '四十',
  '陌': '百', '佰': '百',
  '阡': '千', '仟': '千',
  '萬': '万'
};
const kyuujiReplaceExp = new RegExp(`(${Object.keys(kyuujiReplaceMap).join('|')})`, 'g');
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
  Object.keys(kyuujiReplaceMap).join('|'),
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

const kanjiToArabic = (str) => {
  const match = str.match(kansuujiRegExp);
  if (match.length <= 0) {
    return null;
  }
  let res = zenToHan(match[0])
  .replace(kyuujiReplaceExp, (match) => {
    return kyuujiReplaceMap[match];
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
exports.kanjiToArabic = kanjiToArabic;

// 数字だろうが漢数字だろうが変換
exports.convertNum = (str) => {
  if (!str) {
    return null;
  }
  let num = null;
  if (kansuujiRegExp.test(str)) {
    num = kanjiToArabic(str);
  } else {
    str = zenToHan(str);
    const parse = str.match(/[0-9]+/);
    num = parseInt(parse[0], 10);
  }
  return num;
};
