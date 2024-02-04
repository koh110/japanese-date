// 何日前/後のパターン

import {
  beforeAfterPattern,
  beforeAfterRegExp,
} from '../../lib/date-utils/index.js';
import { convertNum } from '../../lib/jpdate-util/index.js';
import type { RelativeReplacer } from '../../type.js';

const replacer: RelativeReplacer = {
  pattern: `${beforeAfterPattern}`,
  getRelative: (inputStr, now = Date.now()) => {
    const dateMatch = inputStr.match(beforeAfterRegExp);
    if (!dateMatch) {
      return null;
    }
    const num = convertNum(dateMatch[1]);
    if (!num) {
      return null;
    }
    if (/(まえ|前)/.test(inputStr)) {
      return num * -1;
    }
    return num;
  },
};
export default replacer;
