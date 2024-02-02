import type { DateReplacer } from '../../../../type.js'
import moment from 'moment';
import { getDateFromNthDay } from '../../../../lib/get-date-from-nth-day.js';
import { spling as equinoxSpling, autumnal as equinoxAutumnal } from './equinox/index.js'

const week = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
} as const;

const holidayMap = new Map<RegExp, DateReplacer>([
  equinoxSpling, equinoxAutumnal,
  [/元日|がんじつ/, (str, now = Date.now()) => {
    return moment(now).set({ month: 0, date: 1 });
  }],
  [/(成人|せいじん)の(日|ひ)/, (str, now = Date.now()) => {
    const nowMoment = moment(now);
    // 1999年までは1/15固定
    if (nowMoment.year() <= 1999) {
      return nowMoment.set({ month: 0, date: 15 });
    }
    // 1月の第2月曜日
    const date = getDateFromNthDay(nowMoment.year(), 0, 2, week.monday, now);
    return date;
  }],
  [/憲法記念日/, (str, now = Date.now()) => {
    const date = moment(now).set({ month: 4, date: 3 });
    return date;
  }],
  [/(建国記念|けんこくきねん)の?(日|ひ)/, (str, now = Date.now()) => {
    const nowMoment = moment(now);
    if (nowMoment.year() < 1967) {
      return null;
    }
    const date = nowMoment.set({ month: 1, date: 11 });
    return date;
  }],
  [/みどりの日/, (str, now = Date.now()) => {
    const nowMoment = moment(now);
    if (nowMoment.year() < 1989) {
      return null;
    } else if (nowMoment.year() < 2007) {
      // 2006年までは4/29
      return nowMoment.set({ month: 3, date: 29 });
    }
    const date = nowMoment.set({ month: 4, date: 4 });
    return date;
  }],
  [/昭和の日/, (str, now = Date.now()) => {
    const nowMoment = moment(now);
    if (nowMoment.year() < 2007) {
      return null;
    }
    const date = nowMoment.set({ month: 3, date: 29 });
    return date;
  }],
  [/こどもの日/, (str, now = Date.now()) => {
    const date = moment(now).set({ month: 4, date: 5 });
    return date;
  }],
  [/海の日/, (str, now = Date.now()) => {
    const nowMoment = moment(now);
    if (nowMoment.year() < 1996) {
      return null;
    } else if (nowMoment.year() < 2003) {
      // 2002年までは7/20
      return nowMoment.set({ month: 6, date: 20 });
    }
    // 7月の第3月曜日
    const date = getDateFromNthDay(nowMoment.year(), 6, 3, week.monday, now);
    return date;
  }],
  [/山の日/, (str, now = Date.now()) => {
    const nowMoment = moment(now);
    if (nowMoment.year() < 2016) {
      return null;
    }
    const date = nowMoment.set({ month: 7, date: 11 });
    return date;
  }],
  [/敬老の日/, (str, now = Date.now()) => {
    const nowMoment = moment(now);
    if (nowMoment.year() < 1966) {
      return null;
    } else if (nowMoment.year() < 2003) {
      // 2003年までは9/15
      return nowMoment.set({ month: 8, date: 15 });
    }
    // 9月の第3月曜日
    const date = getDateFromNthDay(nowMoment.year(), 8, 3, week.monday, now);
    return date;
  }],
  [/体育の日/, (str, now = Date.now()) => {
    const nowMoment = moment(now);
    if (nowMoment.year() < 1966) {
      return null;
    } else if (nowMoment.year() < 2000) {
      // 1999年までは10/10
      return nowMoment.set({ month: 9, date: 10 });
    }
    // 10月の第2月曜日
    const date = getDateFromNthDay(nowMoment.year(), 9, 2, week.monday, now);
    return date;
  }],
  [/文化の日/, (str, now = Date.now()) => {
    const date = moment(now).set({ month: 10, date: 3 });
    return date;
  }],
  [/勤労感謝の日/, (str, now = Date.now()) => {
    const date = moment(now).set({ month: 10, date: 23 });
    return date;
  }],
  [/天皇誕生日/, (str, now = Date.now()) => {
    // 1988年までは4/29
    const nowMoment = moment(now);
    if (nowMoment.year() <= 1988) {
      return nowMoment.set({ month: 3, date: 29 });
    }
    const date = moment(now).set({ month: 11, date: 23 });
    return date;
  }]
]);
export default holidayMap;
