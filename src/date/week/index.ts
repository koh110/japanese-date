import { dayPattern, getDayFromStr } from '../../lib/day-utils.js';
import type { RelativeReplacer } from '../../type.js';

const pattern: RelativeReplacer = {
  pattern: `((再?来週|先週|今週|さ?らいしゅう|せんしゅう|こんしゅう)の?)?${dayPattern}`,
  getRelative: (inputStr, now = Date.now()) => {
    const nowDay = new Date(now).getDay();
    const matchDay = getDayFromStr(inputStr);
    if (!matchDay) {
      return null;
    }
    let add = matchDay - nowDay;
    const weekMatch = inputStr.match(
      /再来週|来週|先週|さらいしゅう|らいしゅう|せんしゅう/,
    );
    if (weekMatch) {
      switch (weekMatch[0]) {
        case '来週':
        case 'らいしゅう':
          add += 7;
          break;
        case '再来週':
        case 'さらいしゅう':
          add += 14;
          break;
        case '先週':
        case 'せんしゅう':
          add += -7;
          break;
      }
    }
    return add;
  },
};
export default pattern;
