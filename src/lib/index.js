'use strict';

exports.createReplacer = (type, replacerArray) => {
  const patternStrs = [];
  const replacementMap = new Map();
  for (const elem of replacerArray) {
    const str = `(${elem.pattern})`;
    patternStrs.push(str);
    elem.type = type;
    replacementMap.set(new RegExp(str), elem);
  }

  const replacer = {
    patterns: patternStrs,
    map: replacementMap
  };
  return replacer;
};

exports.addReplacer = (replacerArray) => {
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
    map: map
  };
};

exports.patternMatch = (str = '', pattern, map, now = Date.now()) => {
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
          relative: replace.getRelative(matchStr, now),
          type: replace.type
        });
        break;
      }
    }
  }
  return results;
};
