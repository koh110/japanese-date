# japanese-date

日本語からDateオブジェクトを取得するparser

# sample
```
const jpdate = require('japanese-date');
const match = jpdate.match('来年の昨日');
// [ { index: 0, elem: '来年', relative: 1, type: 'years' },
//   { index: 3, elem: '昨日', relative: -1, type: 'days' } ]
const date = jpdate.getDate('来年の昨日');
console.log(date);
// [ 2017-11-22T15:48:25.610Z ]
```
