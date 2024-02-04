import type { DateReplacer } from '../../../type.js';
import dayjs from 'dayjs';

const calendarMap = new Map<RegExp, DateReplacer>([
  [
    /クリスマス(イブ)?/,
    (str, now = Date.now()) => {
      let date = 25;
      if (/イブ/.test(str)) {
        date = 24;
      }
      return dayjs(now).month(11).date(date).hour(0).minute(0).second(0);
    },
  ],
  [
    /大晦日|おおみそか/,
    (str, now = Date.now()) => {
      return dayjs(now).month(11).date(31).hour(0).minute(0).second(0);
    },
  ],
]);
export default calendarMap;
