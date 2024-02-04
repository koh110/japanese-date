import { zenToHan } from './zentohan.js';

const kyuujiReplaceMap = new Map([
  ['零', '〇'],
  ['壱', '一'],
  ['壹', '一'],
  ['弌', '一'],
  ['弐', '二'],
  ['貳', '二'],
  ['貮', '二'],
  ['参', '三'],
  ['參', '三'],
  ['弎', '三'],
  ['肆', '四'],
  ['伍', '五'],
  ['陸', '六'],
  ['漆', '七'],
  ['柒', '七'],
  ['捌', '八'],
  ['玖', '九'],
  ['拾', '十'],
  ['廿', '二十'],
  ['卄', '二十'],
  ['卅', '三十'],
  ['丗', '三十'],
  ['卌', '四十'],
  ['陌', '百'],
  ['佰', '百'],
  ['阡', '千'],
  ['仟', '千'],
  ['萬', '万'],
]);
const kyuujiReplaceExp = new RegExp(
  `(${[...kyuujiReplaceMap.keys()].join('|')})`,
  'g',
);
const suujiMap = new Map([
  ['〇', 0],
  ['一', 1],
  ['二', 2],
  ['三', 3],
  ['四', 4],
  ['五', 5],
  ['六', 6],
  ['七', 7],
  ['八', 8],
  ['九', 9],
]);
const suujiMapRegExp = new RegExp(`(${[...suujiMap.keys()].join('|')})`, 'g');
const lowKetaMap = new Map([
  ['十', 10 ** 1],
  ['百', 10 ** 2],
  ['千', 10 ** 3],
]);
const highKetaMap = new Map([
  ['万', 10 ** 4],
  ['億', 10 ** 8],
  ['兆', 10 ** 12],
  ['京', 10 ** 16],
  ['垓', 10 ** 20],
  ['秭', 10 ** 24],
  ['𥝱', 10 ** 24],
  ['穰', 10 ** 28],
  ['溝', 10 ** 32],
  ['澗', 10 ** 36],
  ['正', 10 ** 40],
  ['載', 10 ** 44],
  ['極', 10 ** 48],
  ['恒河沙', 10 ** 52],
  ['阿僧祇', 10 ** 56],
  ['那由他', 10 ** 60],
  ['不可思議', 10 ** 64],
  ['無量大数', 10 ** 68],
]);
const highKetaRegExp = new RegExp(
  `(${[...highKetaMap.keys()].join('|')})`,
  'g',
);

const kansuuji = [
  ...kyuujiReplaceMap.keys(),
  ...suujiMap.keys(),
  ...lowKetaMap.keys(),
  ...highKetaMap.keys(),
].join('|');
export const kansuujiRegExp = new RegExp(`[${kansuuji}]+`, 'g');

// 千以下の数字の計算
const calcUnderNum = (input: string) => {
  if (/^[0-9]+$/.exec(input)) {
    return Number(input);
  }
  let total = 0;
  let tmp = 0;
  for (let i = 0; i < input.length; i++) {
    const code = input.charAt(i);
    const lowKeta = lowKetaMap.get(code);
    if (lowKeta) {
      if (tmp > 0) {
        total += tmp * lowKeta;
        tmp = 0;
      } else {
        total += lowKeta;
      }
      continue;
    }
    tmp = Number(code);
  }
  if (tmp > 0) {
    total += tmp;
  }
  return total;
};

export const kanjiToArabic = (str: string) => {
  const match = str.match(kansuujiRegExp);
  if (!match || match.length <= 0) {
    return null;
  }
  let res = zenToHan(match[0])
    .replace(kyuujiReplaceExp, (match) => {
      return kyuujiReplaceMap.get(match) as string;
    })
    .replace(suujiMapRegExp, (match) => {
      return `${suujiMap.get(match)}`;
    });

  let result: RegExpExecArray | null = null;
  let total = 0;
  // biome-ignore lint/suspicious/noAssignInExpressions:
  while ((result = highKetaRegExp.exec(res)) !== null) {
    const unit = res.slice(0, result.index);
    const highKeta = highKetaMap.get(result[0]);
    if (!highKeta) {
      continue;
    }
    total += calcUnderNum(unit) * highKeta;
    res = res.slice(result.index + 1);
  }
  total += calcUnderNum(res);
  return total;
};

// 数字だろうが漢数字だろうが変換
export const convertNum = (str: string | null) => {
  if (!str) {
    return null;
  }
  let num = null;
  if (kansuujiRegExp.test(str)) {
    num = kanjiToArabic(str);
  } else {
    const hanStr = zenToHan(str);
    const parse = hanStr.match(/[0-9]+/);
    if (!parse) {
      return null;
    }
    num = parseInt(parse[0], 10);
  }
  return num;
};
