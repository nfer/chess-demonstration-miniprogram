import { KeyInfo } from '../interface/index';

// 相
function checkBBlockMove(keyInfo: KeyInfo, keyInfos: Array<KeyInfo>, x: number, y: number) {
  const keyX = (x + keyInfo.x) / 2;
  const keyY = (y + keyInfo.y) / 2;

  return keyInfos.some(item => item.x === keyX && item.y === keyY);
}

// 马
function checkNBlockMove(keyInfo: KeyInfo, keyInfos: Array<KeyInfo>, x: number, y: number) {
  const xRange = x - keyInfo.x;
  let keyX = 0, keyY = 0;
  if (Math.abs(xRange) === 2) {
    keyY = keyInfo.y;
    keyX = (keyInfo.x + x) / 2;
  } else {
    keyX = keyInfo.x;
    keyY = (y + keyInfo.y) / 2;
  }

  return keyInfos.some(item => item.x === keyX && item.y === keyY);
}

// 炮
function checkCBlockMove(keyInfo: KeyInfo, keyInfos: Array<KeyInfo>, x: number, y: number) {
  let innerKeys = [] as Array<KeyInfo>;
  if (x === keyInfo.x) {
    const minY = Math.min(keyInfo.y, y);
    const maxY = Math.max(keyInfo.y, y);
    innerKeys = keyInfos.filter(item => item.x === x && (item.y > minY && item.y < maxY));
  } else {
    const minX = Math.min(keyInfo.x, x);
    const maxX = Math.max(keyInfo.x, x);
    innerKeys = keyInfos.filter(item => item.y === y && (item.x > minX && item.x < maxX));
  }
  const targetKey = keyInfos.find(item => item.x === x && item.y === y);
  if (targetKey) {
    return innerKeys.length !== 1;
  } else {
    return !!innerKeys.length;
  }
}

// 车
function checkRBlockMove(keyInfo: KeyInfo, keyInfos: Array<KeyInfo>, x: number, y: number) {
  if (x === keyInfo.x) {
    const minY = Math.min(keyInfo.y, y);
    const maxY = Math.max(keyInfo.y, y);
    return keyInfos.some(item => item.x === x && (item.y > minY && item.y < maxY));
  } else {
    const minX = Math.min(keyInfo.x, x);
    const maxX = Math.max(keyInfo.x, x);
    return keyInfos.some(item => item.y === y && (item.x > minX && item.x < maxX));
  }
}

export const checkBlockMove = (keyInfo: KeyInfo, keyInfos: Array<KeyInfo>, x: number, y: number) => {
  switch (keyInfo.key) {
    case 'b':
    case 'B':
      return checkBBlockMove(keyInfo, keyInfos, x, y);
    case 'n':
    case 'N':
      return checkNBlockMove(keyInfo, keyInfos, x, y);
    case 'r':
    case 'R':
      return checkRBlockMove(keyInfo, keyInfos, x, y);
    case 'c':
    case 'C':
      return checkCBlockMove(keyInfo, keyInfos, x, y);
  }
  return false;
};
