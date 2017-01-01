'use strict';

const map = require('./map');

const keyStrs = [...map.keys()].map((regExp) => {
  const str = regExp.toString();
  return str.slice(1, str.length - 1);
});

const pattern = `(${keyStrs.join('|')})`;

exports.pattern = pattern;
exports.map = map;
