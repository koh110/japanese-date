import type { Dayjs } from 'dayjs'
import { RelativeReplacer } from '../../type.js'
import { convertRegExpToPattern } from '../../lib/jpdate-lib/index.js'
import map from './map/index.js'

const keyStrs = [...map.keys()].map((regExp) => {
  return convertRegExpToPattern(regExp);
});

const pattern = `(${keyStrs.join('|')})`;

const replacer: RelativeReplacer = {
  pattern: pattern,
  getRelative: (inputStr, now = Date.now()) => {
    let input: Dayjs | null = null;
    for (const [regExp, replacer] of map.entries()) {
      if (regExp.test(inputStr)) {
        input = replacer(inputStr, now);
        break;
      }
    }
    if (!input) {
      return null;
    }
    return input.diff(now, 'days');
  }
};
export default replacer
