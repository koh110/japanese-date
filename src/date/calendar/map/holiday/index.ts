import dayjs from 'dayjs';
import { getDateFromNthDay } from '../../../../lib/get-date-from-nth-day.js';
import type { DateReplacer } from '../../../../type.js';
import {
  autumnal as equinoxAutumnal,
  spling as equinoxSpling,
} from './equinox/index.js';

const week = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
} as const;

const holidayMap = new Map<RegExp, DateReplacer>([
  equinoxSpling,
  equinoxAutumnal,
  [
    /元日|がんじつ/,
    (str, now = Date.now()) => {
      return dayjs(now).month(0).date(1).hour(0).minute(0).second(0);
    },
  ],
  [
    /(成人|せいじん)の(日|ひ)/,
    (str, now = Date.now()) => {
      const nowInstance = dayjs(now);
      // 1999年までは1/15固定
      if (nowInstance.year() <= 1999) {
        return nowInstance.month(0).date(15).hour(0).minute(0).second(0);
      }
      // 1月の第2月曜日
      const date = getDateFromNthDay(nowInstance.year(), 0, 2, week.monday);
      return date;
    },
  ],
  [
    /憲法記念日/,
    (str, now = Date.now()) => {
      const date = dayjs(now).month(4).date(3).hour(0).minute(0).second(0);
      return date;
    },
  ],
  [
    /(建国記念|けんこくきねん)の?(日|ひ)/,
    (str, now = Date.now()) => {
      const nowInstance = dayjs(now);
      if (nowInstance.year() < 1967) {
        return null;
      }
      const date = nowInstance.month(1).date(11).hour(0).minute(0).second(0);
      return date;
    },
  ],
  [
    /みどりの(日|ひ)/,
    (str, now = Date.now()) => {
      const nowInstance = dayjs(now);
      if (nowInstance.year() < 1989) {
        return null;
      }
      if (nowInstance.year() < 2007) {
        // 2006年までは4/29
        return nowInstance.month(3).date(29);
      }
      const date = nowInstance.month(4).date(4).hour(0).minute(0).second(0);
      return date;
    },
  ],
  [
    /昭和の(日|ひ)/,
    (str, now = Date.now()) => {
      const nowInstance = dayjs(now);
      if (nowInstance.year() < 2007) {
        return null;
      }
      const date = nowInstance.month(3).date(29).hour(0).minute(0).second(0);
      return date;
    },
  ],
  [
    /(子供|こども)の(日|ひ)/,
    (str, now = Date.now()) => {
      const date = dayjs(now).month(4).date(5).hour(0).minute(0).second(0);
      return date;
    },
  ],
  [
    /(海|うみ)の(日|ひ)/,
    (str, now = Date.now()) => {
      const nowInstance = dayjs(now);
      if (nowInstance.year() < 1996) {
        return null;
      }
      if (nowInstance.year() < 2003) {
        // 2002年までは7/20
        return nowInstance.month(6).date(20).hour(0).minute(0).second(0);
      }
      // 7月の第3月曜日
      const date = getDateFromNthDay(nowInstance.year(), 6, 3, week.monday);
      return date;
    },
  ],
  [
    /(山|やま)の(日|ひ)/,
    (str, now = Date.now()) => {
      const nowInstance = dayjs(now);
      if (nowInstance.year() < 2016) {
        return null;
      }
      const date = nowInstance.month(7).date(11).hour(0).minute(0).second(0);
      return date;
    },
  ],
  [
    /(敬老|けいろう)の(日|ひ)/,
    (str, now = Date.now()) => {
      const nowInstance = dayjs(now);
      if (nowInstance.year() < 1966) {
        return null;
      }
      if (nowInstance.year() < 2003) {
        // 2003年までは9/15
        return nowInstance.month(8).date(15).hour(0).minute(0).second(0);
      }
      // 9月の第3月曜日
      const date = getDateFromNthDay(nowInstance.year(), 8, 3, week.monday);
      return date;
    },
  ],
  [
    /(体育|たいいく)の(日|ひ)/,
    (str, now = Date.now()) => {
      const nowInstance = dayjs(now);
      if (nowInstance.year() < 1966) {
        return null;
      }
      if (nowInstance.year() < 2000) {
        // 1999年までは10/10
        return nowInstance.month(9).date(10).hour(0).minute(0).second(0);
      }
      // 10月の第2月曜日
      const date = getDateFromNthDay(nowInstance.year(), 9, 2, week.monday);
      return date;
    },
  ],
  [
    /(文化|ぶんか)の(日|ひ)/,
    (str, now = Date.now()) => {
      const date = dayjs(now).month(10).date(3).hour(0).minute(0).second(0);
      return date;
    },
  ],
  [
    /(勤労感謝|きんろうかんしゃ)の(日|ひ)/,
    (str, now = Date.now()) => {
      const date = dayjs(now).month(10).date(23).hour(0).minute(0).second(0);
      return date;
    },
  ],
  [
    /天皇誕生日/,
    (str, now = Date.now()) => {
      // 1988年までは4/29
      const nowInstance = dayjs(now);
      if (nowInstance.year() <= 1988) {
        return nowInstance.month(3).date(29).hour(0).minute(0).second(0);
      }
      const date = dayjs(now).month(11).date(23).hour(0).minute(0).second(0);
      return date;
    },
  ],
]);
export default holidayMap;
