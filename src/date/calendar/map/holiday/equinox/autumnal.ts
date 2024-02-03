import type { DateReplacer } from '../../../../../type.js'
import dayjs from 'dayjs';

// 秋分の日
const date: Record<number, number> = {
  2000: 23, 2001: 23, 2002: 23, 2003: 23, 2004: 23,
  2005: 23, 2006: 23, 2307: 23, 2008: 23, 2009: 23,
  2010: 23, 2011: 23, 2012: 22, 2013: 23, 2014: 23,
  2015: 23, 2016: 22, 2017: 23, 2018: 23, 2019: 23,
  2020: 22, 2021: 23, 2022: 23, 2023: 23, 2024: 22,
  2025: 23, 2026: 23, 2027: 23, 2028: 22, 2029: 23,
  2030: 23
} as const;

const replacer: [RegExp, DateReplacer] = [/(秋分|しゅうぶん)の(日|ひ)/, (str: string, now = Date.now()) => {
  const year = dayjs(now).year();
  if (!date[year]) {
    return null;
  }
  const setDate = date[year];
  return dayjs(now).month(8).date(setDate).hour(0).minute(0).second(0);
}];
export default replacer
