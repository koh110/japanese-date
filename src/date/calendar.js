'use strict';

const map = new Map([
  [/クリスマス(イブ)?/, (str) => {
    let date = 25;
    if (/イブ/.test(str)) {
      date = 24;
    }
    return { month: 11, date: date };
  }],
  [/大晦日|おおみそか/, (str) => {
    return { month: 11, date: 31 };
  }],
  [/元日|がんじつ/, (str) => {
    return { month: 0, date: 1 };
  }]
]);

const keyStrs = [...map.keys()].map((regExp) => {
  const str = regExp.toString();
  return str.slice(1, str.length - 1);
});

const pattern = `(${keyStrs.join('|')})`;

exports.pattern = pattern;
exports.map = map;
