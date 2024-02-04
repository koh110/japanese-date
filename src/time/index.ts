import type { RelativeReplacer } from '../type.js';
import dayjs from 'dayjs';
import { convertNum } from '../lib/jpdate-util/index.js';
import { kansuujiPattern } from '../lib/jpdate-lib/index.js';
import {
  beforeAfterPattern,
  beforeAfterRegExp,
} from '../lib/date-utils/index.js';

export const replacer: RelativeReplacer[] = [
  {
    pattern: `(${kansuujiPattern}|[0-9０-９]+)(秒|分|時間半?)(後|ご|まえ|前)`,
    getRelative: (inputStr) => {
      let num = convertNum(inputStr);
      if (!num) {
        return null;
      }
      const unit = inputStr.match(/秒|分|時間/);
      if (!unit) {
        return null;
      }
      if (unit[0] === '分') {
        num = num * 60;
      } else if (unit[0] === '時間') {
        num = num * 3600;
        if (/半/.test(inputStr)) {
          num += 1800;
        }
      }
      if (/(まえ|前)/.test(inputStr)) {
        num = num * -1;
      }
      return num;
    },
  },
  {
    pattern:
      '[0-2０-２]?[0-9０-９]:[0-5０-５][0-9０-９](:[0-5０-５][0-9０-９])?',
    getRelative: (inputStr, now = Date.now()) => {
      const [_hour, _minute, _seconds] = inputStr.split(':');
      if (!_hour || !_minute) {
        return null;
      }
      const hour = Number(_hour);
      const minute = Number(_minute);
      const seconds = _seconds ? Number(_seconds) : 0;
      const diff = dayjs(now)
        .hour(hour)
        .minute(minute)
        .second(seconds)
        .diff(now, 'seconds');
      return diff;
    },
  },
  {
    pattern: '正午',
    getRelative: (inputStr, now = Date.now()) => {
      const diff = dayjs(now).hour(12).minute(0).second(0).diff(now, 'seconds');
      return diff;
    },
  },
  {
    pattern: `(${kansuujiPattern}|[0-9０-９]{1,2})時半`,
    getRelative: (inputStr, now = Date.now()) => {
      const match = inputStr.match(/((.+)時)/);
      if (!match) {
        return null;
      }
      const hour = convertNum(match[2]);
      if (!hour) {
        return null;
      }
      const diff = dayjs(now)
        .hour(hour)
        .minute(30)
        .second(0)
        .diff(now, 'seconds');
      return diff;
    },
  },
  {
    pattern: [
      '(午前|ごぜん|午後|ごご)?',
      `(${kansuujiPattern}|[0-9０-９]{1,2})時`,
      `((${kansuujiPattern}|[0-9０-９]{1,2})分)?`,
      `((${kansuujiPattern}|[0-9０-９]{1,2})秒)?`,
      `(の${beforeAfterPattern})?`,
    ].join(''),
    getRelative: (inputStr, now = Date.now()) => {
      const match = inputStr.match(/((.+)時)?((.+)分)?((.+)秒)?/);
      if (!match) {
        return null;
      }
      let inputInstance = dayjs(now);
      const hour = convertNum(match[2]);
      if (hour) {
        let add = 0;
        if (/午後|ごご/.test(inputStr) && hour <= 12) {
          add = 12;
        }
        inputInstance = inputInstance.hour(hour + add);
      }
      const minute = convertNum(match[4]);
      inputInstance = inputInstance.minute(minute ? minute : 0);
      const second = convertNum(match[6]);
      inputInstance = inputInstance.second(second ? second : 0);

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

      const num = (inputInstance.toDate().getTime() - now) / 1000;

      return num;
    },
  },
];
