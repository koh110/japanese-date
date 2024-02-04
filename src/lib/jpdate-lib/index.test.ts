import { test, expect } from 'vitest';

import { createReplacer, addReplacer } from './index.js';

test('createReplacer', () => {
  const type = 'test';
  const replacerArray = [
    {
      pattern: 'パターン1',
      getRelative: (inputStr, now = Date.now()) => {
        return 1;
      },
    },
    {
      pattern: 'パターン2',
      getRelative: (inputStr, now = Date.now()) => {
        return 2;
      },
    },
  ];
  const replacer = createReplacer(type as any, replacerArray);
  expect(replacer.patterns.length).toStrictEqual(replacerArray.length);
  let i = 0;
  for (const entry of replacer.map.entries()) {
    expect(entry[0] instanceof RegExp).toStrictEqual(true);
    expect(typeof entry[1].pattern).toStrictEqual('string');
    expect(typeof entry[1].getRelative).toStrictEqual('function');
    expect(entry[1].type).toStrictEqual(type);
    i++;
  }
  expect(i).toStrictEqual(replacerArray.length);
});

test('addReplacer', () => {
  const type1 = 'タイプ1';
  const seed1 = [
    {
      pattern: 'パターン1-1',
      getRelative: (inputStr, now = Date.now()) => {
        return 1;
      },
    },
    {
      pattern: 'パターン1-2',
      getRelative: (inputStr, now = Date.now()) => {
        return 2;
      },
    },
  ];
  const replacer1 = createReplacer(type1 as any, seed1);
  const seed2 = [
    {
      pattern: 'パターン2-1',
      getRelative: (inputStr, now = Date.now()) => {
        return 1;
      },
    },
  ];
  const type2 = 'タイプ2';
  const replacer2 = createReplacer(type2 as any, seed2);
  const add = addReplacer([replacer1, replacer2]);
  let i = 0;
  const mapArray = Array.from(add.map.entries());
  for (const entry of mapArray) {
    expect(entry[0] instanceof RegExp).toStrictEqual(true);
    const replace = entry[1];
    expect(typeof replace.pattern).toStrictEqual('string');
    expect(typeof replace.getRelative).toStrictEqual('function');
    i++;
  }
  expect(mapArray[0][1].type).toStrictEqual(type1);
  expect(mapArray[1][1].type).toStrictEqual(type1);
  expect(mapArray[2][1].type).toStrictEqual(type2);
  expect(i).toStrictEqual(seed1.length + seed2.length);
});
