'use strict';

const test = require('ava').test;

const util = require('src/util');

test('kanjiToArabic', (t) => {
  let arabic = util.kanjiToArabic('十');
  t.is(arabic, 10);
  arabic = util.kanjiToArabic('百');
  t.is(arabic, 100);
  arabic = util.kanjiToArabic('千');
  t.is(arabic, 1000);
  arabic = util.kanjiToArabic('壱万');
  t.is(arabic, 10000);
  arabic = util.kanjiToArabic('十二');
  t.is(arabic, 12);
  arabic = util.kanjiToArabic('百二十三');
  t.is(arabic, 123);
  arabic = util.kanjiToArabic('千二百三十四');
  t.is(arabic, 1234);
  arabic = util.kanjiToArabic('一万二千三百四十五');
  t.is(arabic, 12345);
  arabic = util.kanjiToArabic('十二万三千四百五十六');
  t.is(arabic, 123456);
  arabic = util.kanjiToArabic('百二十三万四千五百六十七');
  t.is(arabic, 1234567);
  arabic = util.kanjiToArabic('八千七百六十五万四千三百二十一');
  t.is(arabic, 87654321);
  arabic = util.kanjiToArabic('壱億二千三百四十五萬六千七百八十九');
  t.is(arabic, 123456789);
  arabic = util.kanjiToArabic('九億千二百三十四万八千七百拾五');
  t.is(arabic, 912348715);
  arabic = util.kanjiToArabic('九不可思議十二');
  t.is(arabic, Math.pow(10, 64) * 9 + 12);
  arabic = util.kanjiToArabic('一〇二');
  t.is(arabic, 102);
  arabic = util.kanjiToArabic('二〇');
  t.is(arabic, 20);
  arabic = util.kanjiToArabic('四三〇一二');
  t.is(arabic, 43012);
  arabic = util.kanjiToArabic('参〇〇〇〇〇');
  t.is(arabic, 300000);
});
