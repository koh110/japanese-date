'use strict';

const zenToHan = (str) => {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) - 0xFEE0);
  });
};
module.exports = zenToHan;
