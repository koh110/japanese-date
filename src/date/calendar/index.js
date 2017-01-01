'use strict';

const { convertRegExpToPattern } = require('../../lib');
const map = require('./map');

const keyStrs = [...map.keys()].map((regExp) => {
  return convertRegExpToPattern(regExp);
});

const pattern = `(${keyStrs.join('|')})`;

module.exports = {
  pattern: pattern,
  getRelative: (inputStr, now = Date.now()) => {
    let inputMoment = null;
    for (const elem of map.entries()) {
      const regExp = elem[0];
      if (regExp.test(inputStr)) {
        inputMoment = elem[1](inputStr, now);
        break;
      }
    }
    if (!inputMoment) {
      return null;
    }
    return inputMoment.diff(now, 'days');
  }
};
