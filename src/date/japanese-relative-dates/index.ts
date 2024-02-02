import type { RelativeReplacer } from '../../type.js'
import { convertRegExpToPattern } from '../../lib/jpdate-lib/index.js'

const dateRegExps: Record<string, { regexp: RegExp; relative: number }> = {
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
} as const;

// 判定順
const datePriority = [
  dateRegExps.today,
  dateRegExps.tomorrow,
  dateRegExps.twoDaysAfterTomorrow,
  dateRegExps.dayAfterTomorrow,
  dateRegExps.dayBeforeYesterday,
  dateRegExps.yesterday
] as const;

const allPattern = datePriority.map((e) => {
  return convertRegExpToPattern(e.regexp);
}).join('|');

const replacer: RelativeReplacer = {
  pattern: allPattern,
  getRelative: (inputStr, now = Date.now()) => {
    for (const date of datePriority) {
      if (date.regexp.test(inputStr)) {
        return date.relative;
      }
    }
    return null
  }
};
export default replacer
