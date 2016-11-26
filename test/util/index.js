'use strict';

const test = require('ava').test;

const { zenToHan, convertNum, kansuujiRegExp, kanjiToArabic } = require('src/util');

test('convertNum', (t) => {
  const data = new Map([
    ['０', 0],
    ['１', 1],
    ['１３', 13],
    ['参〇弐', 302],
    ['八千七百六十五万四千三百二十一', 87654321]
  ]);
  for (const entry of data.entries()) {
    t.is(convertNum(entry[0]), entry[1]);
  }
});

test('zenToHan', (t) => {
  const data = new Map([
    ['０', '0'],
    ['１', '1'],
    ['１３', '13']
  ]);
  for (const entry of data.entries()) {
    t.is(zenToHan(entry[0]), entry[1]);
  }
});

test('kansuujiRegExp', (t) => {
  const data = [
    '十',
    '百一',
    '一',
    '千',
    '零',
    '参〇弐'
  ];
  for (const elem of data) {
    const regExp = new RegExp(kansuujiRegExp);
    t.truthy(regExp.test(elem));
  }
});

test('kanjiToArabic', (t) => {
  const data = new Map([
    ['十', 10],
    ['百', 100],
    ['千', 1000],
    ['壱万', 10000],
    ['十二', 12],
    ['百二十三', 123],
    ['千二百三十四', 1234],
    ['一万二千三百四十五', 12345],
    ['十二万三千四百五十六', 123456],
    ['百二十三万四千五百六十七', 1234567],
    ['八千七百六十五万四千三百二十一', 87654321],
    ['壱億二千三百四十五萬六千七百八十九', 123456789],
    ['九億千二百三十四万八千七百拾五', 912348715],
    ['七不可思議十二', Math.pow(10, 64) * 7 + 12],
    ['一〇二', 102],
    ['二〇', 20],
    ['四三〇一二', 43012],
    ['参〇〇〇〇〇', 300000]
  ]);
  for (const entry of data.entries()) {
    t.is(kanjiToArabic(entry[0]), entry[1]);
  }
});
