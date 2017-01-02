'use strict';

const { convertRegExpToPattern } = require('jpdate-lib');

const dateRegExps = {
  today: {
    regexp: /今日|きょう/,
    relative: 0
  },
  tomorrow: {
    regexp: /明日|あした|あす|みょうじつ|翌日|よくじつ/,
    relative: 1
  },
  twoDaysAfterTomorrow: {
    regexp: /明々後日|しあさって/,
    relative: 3
  },
  dayAfterTomorrow: {
    regexp: /明後日|あさって/,
    relative: 2
  },
  dayBeforeYesterday: {
    regexp: /一昨日|おととい/,
    relative: -2
  },
  yesterday: {
    regexp: /昨日|きのう|さくじつ/,
    relative: -1
  }
};

// 判定順
const datePriority = [
  dateRegExps.today,
  dateRegExps.tomorrow,
  dateRegExps.twoDaysAfterTomorrow,
  dateRegExps.dayAfterTomorrow,
  dateRegExps.dayBeforeYesterday,
  dateRegExps.yesterday
];

const allPattern = datePriority.map((e) => {
  return convertRegExpToPattern(e.regexp);
}).join('|');

module.exports = {
  pattern: allPattern,
  getRelative: (inputStr) => {
    for (const date of datePriority) {
      if (date.regexp.test(inputStr)) {
        return date.relative;
      }
    }
  }
};
