import type { RelativeReplacer } from '../../type.js';
import { kansuujiRegExp } from '../jpdate-util/index.js';

// 正規表現を前後の/を落とした文字列化する
export const convertRegExpToPattern = (regExp: RegExp) => {
  const str = regExp.toString();
  // /で終わってない場合はgとかがついてるので2個削る
  if (str.charAt(str.length - 1) !== '/') {
    return str.slice(1, str.length - 2);
  }
  return str.slice(1, str.length - 1);
};

export const kansuujiPattern = convertRegExpToPattern(kansuujiRegExp);

type CreateReplacerType = 'seconds' | 'days' | 'years';
type ReplacerMap = Map<RegExp, RelativeReplacer & { type: CreateReplacerType }>;
type CreateReplacerResponse = {
  patterns: string[];
  map: ReplacerMap;
};

export const createReplacer = (
  type: CreateReplacerType,
  replacerArray: RelativeReplacer[],
): CreateReplacerResponse => {
  const patternStrs = [];
  const replacementMap: CreateReplacerResponse['map'] = new Map();
  for (const elem of replacerArray) {
    patternStrs.push(elem.pattern);
    replacementMap.set(new RegExp(elem.pattern), { ...elem, type });
  }

  return {
    patterns: patternStrs,
    map: replacementMap,
  } as const;
};

export const addReplacer = (
  replacerArray: CreateReplacerResponse[],
): { pattern: RegExp; map: ReplacerMap } => {
  const addPatterns = [];
  const mapSeed = [];
  for (const replacer of replacerArray) {
    addPatterns.push(...replacer.patterns);
    mapSeed.push(...replacer.map);
  }
  const pattern = new RegExp(addPatterns.join('|'), 'g');
  const map = new Map(mapSeed);
  return {
    pattern: pattern,
    map: map,
  };
};

type PatternMatchResponse = {
  index: number;
  elem: string;
  getRelative: RelativeReplacer['getRelative'];
  type: CreateReplacerType;
}[];

export const patternMatch = (
  str = '',
  pattern: RegExp,
  map: ReturnType<typeof addReplacer>['map'],
): PatternMatchResponse => {
  let result;
  const results = [];
  while ((result = pattern.exec(str)) !== null) {
    const matchStr = result[0];
    for (const entry of map.entries()) {
      const regexp = entry[0];
      if (regexp.test(matchStr)) {
        const replace = entry[1];
        results.push({
          index: result.index,
          elem: result[0],
          getRelative: replace.getRelative,
          type: replace.type,
        });
        break;
      }
    }
  }
  return results;
};
