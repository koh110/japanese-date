'use strict';

const test = require('ava').test;

const { createReplacer, addReplacer } = require('src/node_modules/jpdate-lib');

test('createReplacer', (t) => {
  const type = 'test';
  const replacerArray = [{
    pattern: 'パターン1',
    getRelative: (inputStr, now = Date.now()) => {
      return 1;
    }
  }, {
    pattern: 'パターン2',
    getRelative: (inputStr, now = Date.now()) => {
      return 2;
    }
  }];
  const replacer = createReplacer(type, replacerArray);
  t.is(replacer.patterns.length, replacerArray.length);
  let i = 0;
  for (const entry of replacer.map.entries()) {
    t.truthy(entry[0] instanceof RegExp);
    t.is(typeof entry[1].pattern, 'string');
    t.is(typeof entry[1].getRelative, 'function');
    t.is(entry[1].type, type);
    i++;
  }
  t.is(i, replacerArray.length);
});

test('addReplacer', (t) => {
  const type1 = 'タイプ1';
  const seed1 = [{
    pattern: 'パターン1-1',
    getRelative: (inputStr, now = Date.now()) => {
      return 1;
    }
  }, {
    pattern: 'パターン1-2',
    getRelative: (inputStr, now = Date.now()) => {
      return 2;
    }
  }];
  const replacer1 = createReplacer(type1, seed1);
  const seed2 = [{
    pattern: 'パターン2-1',
    getRelative: (inputStr, now = Date.now()) => {
      return 1;
    }
  }];
  const type2 = 'タイプ2';
  const replacer2 = createReplacer(type2, seed2);
  const add = addReplacer([replacer1, replacer2]);
  let i = 0;
  for (const entry of add.map.entries()) {
    t.truthy(entry[0] instanceof RegExp);
    const replace = entry[1];
    t.is(typeof replace.pattern, 'string');
    t.is(typeof replace.getRelative, 'function');
    t.truthy(replace.type === type1 || replace.type === type2);
    i++;
  }
  t.is(i, seed1.length + seed2.length);

});
