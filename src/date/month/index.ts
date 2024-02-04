// 今月/先月...のパターン
import type { RelativeReplacer } from '../../type.js';
import dayjs from 'dayjs';
import { kansuujiPattern } from '../../lib/jpdate-lib/index.js';
import { convertNum } from '../../lib/jpdate-util/index.js';
import { dayPattern, dayRegExp, getDayFromStr } from '../../lib/day-utils.js';
import { getDateFromNthDay } from '../../lib/get-date-from-nth-day.js';
import japaneseRelativeDates from '../japanese-relative-dates/index.js';

const monthPattern = '(再?来月|先月|今月|こんげつ|さ?らいげつ|せんげつ)';
const monthRegExp = new RegExp(monthPattern);

const hinichiPattern = `(${kansuujiPattern}|[0-9０-９]+)日?`;
const hinichiRegExp = new RegExp(hinichiPattern);

const japaneseRelativeDatesRegExp = new RegExp(japaneseRelativeDates.pattern);

const pattern: RelativeReplacer = {
  pattern: `(${monthPattern}の?)(${dayPattern}|${hinichiPattern}|${japaneseRelativeDates.pattern})`,
  getRelative: (inputStr, now = Date.now()) => {
    const monthMatch = inputStr.match(monthRegExp);
    let add = 0;
    if (monthMatch) {
      switch (monthMatch[0]) {
        case '来月':
        case 'らいげつ':
          add = 1;
          break;
        case '再来月':
        case 'さらいげつ':
          add = 2;
          break;
        case '先月':
        case 'せんげつ':
          add = -1;
          break;
      }
    }

    let inputInstance = dayjs(now)
      .hour(0)
      .minute(0)
      .second(0)
      .add(add, 'month');
    if (japaneseRelativeDatesRegExp.test(inputStr)) {
      const relative = japaneseRelativeDates.getRelative(inputStr, now);
      if (!relative) {
        return null;
      }
      inputInstance = inputInstance.add(relative, 'days');
    } else if (dayRegExp.test(inputStr)) {
      const match = inputStr.match(dayRegExp);
      if (!match) {
        return null;
      }
      const nth = convertNum(match[3]);
      if (!nth) {
        return null;
      }
      const day = getDayFromStr(inputStr);
      if (!day) {
        return null;
      }
      const res = getDateFromNthDay(
        inputInstance.year(),
        inputInstance.month(),
        nth,
        day,
      );
      if (!res) {
        return null;
      }
      inputInstance = inputInstance.date(res.date());
    } else {
      const dateMatch = inputStr.match(hinichiRegExp);
      if (!dateMatch) {
        return null;
      }
      const date = convertNum(dateMatch[1]);
      if (!date) {
        return null;
      }
      inputInstance = inputInstance.date(date);
    }

    const diff = inputInstance.diff(now, 'days');
    return diff;
  },
};
export default pattern;
