import type { Dayjs } from 'dayjs';

export type RelativeReplacer = {
  pattern: string;
  getRelative: (inputStr: string, now?: number) => number | null;
};

export type DateReplacer = (str: string, now?: number) => Dayjs | null;
