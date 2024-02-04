import { kansuujiPattern } from '../jpdate-lib/index.js';

// 相対時間のパターン
export const beforeAfterPattern = `(${kansuujiPattern}|[0-9０-９]+)日(後|ご|まえ|前)`;
export const beforeAfterRegExp = new RegExp(beforeAfterPattern);
