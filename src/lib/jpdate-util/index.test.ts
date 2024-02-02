import { test, expect } from 'vitest'
import { zenToHan, convertNum, kansuujiRegExp, kanjiToArabic } from './index.js';

test.each([
  ['０', 0],
  ['１', 1],
  ['１３', 13],
  ['参〇弐', 302],
  ['八千七百六十五万四千三百二十一', 87654321]
])('convertNum', (str, num) => {
  expect(convertNum(str)).toStrictEqual(num);
});

test.each([
  ['０', '0'],
  ['１', '1'],
  ['１３', '13']
])('zenToHan', (zenkaku, hankaku) => {
  expect(zenToHan(zenkaku)).toStrictEqual(hankaku);
});

test.each([
  '十',
  '百一',
  '一',
  '千',
  '零',
  '参〇弐'
])('kansuujiRegExp', (elem) => {
  const regExp = new RegExp(kansuujiRegExp);
  expect(regExp.test(elem)).toStrictEqual(true);
});

test.each([
  ['十', 10],
  ['百', 100],
  ['陌', 100],
  ['佰', 100],
  ['千', 1000],
  ['阡', 1000],
  ['仟', 1000],
  ['壱万', 10000],
  ['十貳', 12],
  ['百二十参', 123],
  ['千二百參十肆', 1234],
  ['一千二百弎十四', 1234],
  ['一万二千三百四十伍', 12345],
  ['十二万三千四百五十陸', 123456],
  ['百二十三万四千五百六十漆', 1234567],
  ['八千柒百六十五万四千三百二十一', 87654321],
  ['壱億二千三百四十五萬六千七百捌十九', 123456789],
  ['玖億千二百三十四万八千七百拾五', 912348715],
  ['七不可思議十二', Math.pow(10, 64) * 7 + 12],
  ['壹〇二', 102],
  ['二〇', 20],
  ['四三〇弌弐', 43012],
  ['参〇〇〇〇〇', 300000],
  ['零', 0],
  ['廿', 20],
  ['卅', 30],
  ['卌', 40],
  ['五十九', 59],
  ['三百七十', 370]
])('kanjiToArabic', (str, num) => {
  expect(kanjiToArabic(str)).toStrictEqual(num);
});
