'use strict';

import { kansuujiPattern } from './jpdate-lib/index.js';

const week: string[] = ['日', '月', '火', '水', '木', '金', '土'] as const;

export const dayPattern = `((第|だい)(いち|に|さん|よん|ご|${kansuujiPattern}|[0-9０-９]+))?(日|月|火|水|木|金|土)曜日?`;
export const dayRegExp = new RegExp(dayPattern);

// 文字列から曜日の取得
export const getDayFromStr = (str: string): number | null => {
  const match = str.match(dayRegExp);
  if (!match) {
    return null;
  }
  const matchDay = week.indexOf(match[4]);
  return matchDay;
};
