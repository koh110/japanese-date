'use strict';
const jpdate = require('./src');

let date = jpdate.getDate('今日、あしたとあさってと明々後日、さくじつ、おととい');
// eslint-disable-next-line no-console
console.log(date);

date = jpdate.getDate('来年の昨日');
// eslint-disable-next-line no-console
console.log(date);
