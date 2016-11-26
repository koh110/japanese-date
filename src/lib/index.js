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
