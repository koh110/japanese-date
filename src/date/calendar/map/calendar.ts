import type { DateReplacer } from '../../../type.js';
import moment from 'moment';

const calendarMap = new Map<RegExp, DateReplacer>([
  [/クリスマス(イブ)?/, (str, now = Date.now()) => {
    let date = 25;
    if (/イブ/.test(str)) {
      date = 24;
    }
    return moment(now).set({ month: 11, date: date });
  }],
  [/大晦日|おおみそか/, (str, now = Date.now()) => {
    return moment(now).set({ month: 11, date: 31 });
  }]
]);
export default calendarMap;
