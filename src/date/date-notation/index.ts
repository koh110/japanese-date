import dayjs from 'dayjs';
import {
  beforeAfterPattern,
  beforeAfterRegExp,
} from '../../lib/date-utils/index.js';
import { kansuujiPattern } from '../../lib/jpdate-lib/index.js';
import { convertNum } from '../../lib/jpdate-util/index.js';
import type { RelativeReplacer } from '../../type.js';

// 日付表記

const replacer: RelativeReplacer = {
  pattern: [
    `((${kansuujiPattern}|[0-9０-９]{4})(/|-|年))?`,
    `(${kansuujiPattern}|[0-9０-９]{1,2})(/|-|月)`,
    `(${kansuujiPattern}|[0-9０-９]{1,2})日?`,
    `(の?${beforeAfterPattern})?`,
  ].join(''),
  getRelative: (inputStr, now = Date.now()) => {
    const match = inputStr.match(/((.+)(\/|-|年))?(.+)(\/|-|月)(.+)日?/);
    if (!match) {
      return null;
    }
    const nowInstance = dayjs(now).hour(0).minute(0).second(0);
    let convert = convertNum(match[2]);
    const year = convert ? convert : nowInstance.year();
    convert = convertNum(match[4]);
    const month = convert ? convert - 1 : nowInstance.month();
    convert = convertNum(match[6]);
    const date = convert ? convert : nowInstance.date();

    let inputInstance = dayjs(now)
      .year(year)
      .month(month)
      .date(date)
      .hour(0)
      .minute(0)
      .second(0);

    // 何日前/後の指定がされていたら
    const beforeAfter = inputStr.match(beforeAfterRegExp);
    if (beforeAfter) {
      let num = convertNum(beforeAfter[1]);
      if (!num) {
        return null;
      }
      if (/(まえ|前)/.test(inputStr)) {
        num = num * -1;
      }
      inputInstance = inputInstance.add(num, 'days');
    }

    const diff = inputInstance.diff(nowInstance, 'days');
    return diff;
  },
};
export default replacer;
