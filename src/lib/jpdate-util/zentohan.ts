export const zenToHan = (str: string) => {
  if (typeof str !== 'string') {
    return `${str}`;
  }
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) - 0xFEE0);
  });
};
