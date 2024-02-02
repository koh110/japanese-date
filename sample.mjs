'use strict';
import { match, getDate } from './dist/src/index.js';

const matched = match('来年の昨日の10秒後と明日');
console.log(matched);

const patterns = [
  '50分後',
  '10時半',
  'あさって',
  '2015年1月23日',
  '2015年の1月23日',
  '明日の一時間後',
  '来年のきょう',
  '一年前の十日後',
  '2年後の21日前',
  '３年後',
  '10年後の昨日',
  '百年後の一昨日',
  '明日の10時',
  '来年の10時二十三分',
  '来年の昨日の10秒後と明日',
  '今週の土曜と来週の水曜日と先週の月曜日',
  '来月の11日'
];
for (const pattern of patterns) {
  console.log(getDate(pattern));
}
