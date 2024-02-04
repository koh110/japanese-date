# japanese-date

[japanese-date](https://www.npmjs.com/package/japanese-date)
[![npm version](https://badge.fury.io/js/japanese-date.svg)](https://badge.fury.io/js/japanese-date)

日本語からDateオブジェクトを取得するparser

# Installation

```shell
$ npm install japanese-date
```

# Usage

```javascript
import { match, getDate } from 'japanese-date';
```

# api

## match

入力した日本語から日本語の日時表現にマッチした情報をarrayとして返します。

```javascript
import { match } from 'japanese-date';
const matched = match('来年の昨日の10秒後');
[{
  index: 0, // matchした先頭のindex
  elem: '来年', // matchした文字列
  relative: 1, // typeに対する相対数値
  type: 'years' // matchした文字列の種類[ years, days, seconds ]
}, {
  index: 3, elem: '昨日', relative: -1, type: 'days'
}, {
  index: 6, elem: '10秒後', relative: 10, type: 'seconds'
}]
```

## getDate

入力した日本語から日付のオブジェクトを配列で返します。  
入力された文字の先頭から年/日付/時間を取得し、その最短の組み合わせを計算したものを返します。  

```javascript
// 実行日: 2016-11-24T15:22:02.451Z
import { getDate } from 'japanese-date';
const matched = getDate('来年の昨日の10秒後');
[ 2017-11-23T15:18:48.514Z ]
```

# sample

```shell
$ npm run build
$ node sample.mjs
```

```javascript
import * as jpdate from 'japanese-date';
const match = jpdate.match('来年の昨日');
// [ { index: 0, elem: '来年', relative: 1, type: 'years' },
//   { index: 3, elem: '昨日', relative: -1, type: 'days' } ]
const date = jpdate.getDate('来年の昨日');
console.log(date);
// [ 2017-11-23T15:18:48.514Z ]
```

## 入力パターン例
```javascript
import * as jpdate from 'japanese-date';
const patterns = [
  '50分後',
  '10時半',
  'あさって',
  '2015年1月23日',
  '2015年の1月23日',
  '明日の一時間後',
  '来年のきょう',
  '来月の明日',
  '一年前の十日後',
  '2年後の21日前',
  '３年後',
  '10年後の昨日',
  '百年後の一昨日',
  '明日の10時',
  '来年の10時二十三分',
  '今週の土曜',
  '来週の水曜日',
  '先週の月曜日',
  '来月の11日',
  '来月の第三金曜日',
  '明日の正午',
  '来年の大晦日',
  '去年のクリスマスイブ',
  '一昨年の元日',
  '来年の成人の日',
  '２０１８年の建国記念の日',
];
for (const pattern of patterns) {
  console.log(jpdate.getDate(pattern));
}
```

# License
MIT
