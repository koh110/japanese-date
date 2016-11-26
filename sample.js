'use strict';
const jpdate = require('./src');

let date = jpdate.getDate('今日、あしたとあさってと明々後日、さくじつ、おととい');
// eslint-disable-next-line no-console
console.log(date);

const match = jpdate.match('来年の昨日の10秒後と明日');
// eslint-disable-next-line no-console
console.log(match);

date = jpdate.getDate('来年の昨日の10秒後と明日');
// eslint-disable-next-line no-console
console.log(date);

date = jpdate.getDate('今週の金曜と来週の水曜日と先週の月曜日');
// eslint-disable-next-line no-console
console.log(date);
