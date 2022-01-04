import { KeyInfo } from '../interface/index';

// 将
function checkKMove(keyInfo: KeyInfo, x: number, y: number, isRed: boolean) {
  if (x < 3 || x > 5) return false;

  if (isRed) {
    if (y < 7 || y > 9) return false;
  } else {
    if (y < 0 || y > 3) return false;
  }

  const step = Math.abs(keyInfo.x - x) + Math.abs(keyInfo.y - y);
  return step === 1;
}

// 士
function checkAMove(keyInfo: KeyInfo, x: number, y: number, isRed: boolean) {
  let arr = [];
  if (isRed) {
    arr = [[3,7], [3,9], [4,8], [5,7], [5,9]]
  } else {
    arr = [[3,0], [3,2], [4,1], [5,0], [5,2]]
  }

  const pos = arr.find(([px, py]) => px === x && py === y);
  if (!pos) return false;

  return Math.abs(keyInfo.x - x) === 1 && Math.abs(keyInfo.y - y) === 1;
}

// 相
function checkBMove(keyInfo: KeyInfo, x: number, y: number, isRed: boolean) {
  let arr = [];
  if (isRed) {
    arr = [[2,9], [6,9], [0,7], [4,7], [8,7], [2,5], [6,5]]
  } else {
    arr = [[2,4], [6,4], [0,2], [4,2], [8,2], [2,0], [6,0]]
  }

  const pos = arr.find(([px, py]) => px === x && py === y);
  if (!pos) return false;

  return Math.abs(keyInfo.x - x) === 2 && Math.abs(keyInfo.y - y) === 2;
}

// 马
function checkNMove(keyInfo: KeyInfo, x: number, y: number) {
  const xRange = Math.abs(keyInfo.x - x);
  const yRange = Math.abs(keyInfo.y - y);
  if (xRange !== 1 && xRange !== 2) return false;
  if (yRange !== 1 && yRange !== 2) return false;
  return xRange + yRange === 3;
}

// 车
function checkRMove(keyInfo: KeyInfo, x: number, y: number) {
  const xRange = Math.abs(keyInfo.x - x);
  const yRange = Math.abs(keyInfo.y - y);
  return xRange === 0 || yRange === 0;
}

// 炮
function checkCMove(keyInfo: KeyInfo, x: number, y: number) {
  const xRange = Math.abs(keyInfo.x - x);
  const yRange = Math.abs(keyInfo.y - y);
  return xRange === 0 || yRange === 0;
}

// 兵
function checPMove(keyInfo: KeyInfo, x: number, y: number, isRed: boolean) {
  const xRange = Math.abs(keyInfo.x - x);
  const yRange = Math.abs(keyInfo.y - y);
  if (xRange + yRange !== 1) return false

  if (isRed) {
    if (y > keyInfo.y) return false;
    if (keyInfo.y > 4 && x !== keyInfo.x) return false;
  } else {
    if (y < keyInfo.y) return false;
    if (keyInfo.y < 5 && x !== keyInfo.x) return false;
  }
  return true;
}

export const checkPosMove = (keyInfo: KeyInfo, x: number, y: number) => {
  switch (keyInfo.key) {
    case 'k':
      return checkKMove(keyInfo, x, y, false);
    case 'K':
      return checkKMove(keyInfo, x, y, true);
    case 'a':
      return checkAMove(keyInfo, x, y, false);
    case 'A':
      return checkAMove(keyInfo, x, y, true);
    case 'b':
      return checkBMove(keyInfo, x, y, false);
    case 'B':
      return checkBMove(keyInfo, x, y, true);
    case 'n':
    case 'N':
      return checkNMove(keyInfo, x, y);
    case 'r':
    case 'R':
      return checkRMove(keyInfo, x, y);
    case 'c':
    case 'C':
      return checkCMove(keyInfo, x, y);
    case 'p':
      return checPMove(keyInfo, x, y, false);
    case 'P':
      return checPMove(keyInfo, x, y, true);
  }
  return false;
};

export const checkSameCamp = (keyInfo1: KeyInfo, keyInfo2: KeyInfo) => {
  return keyInfo1.type !== keyInfo2.type;
};

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
function checkRBlockMove(keyInfo: KeyInfo, keyInfos: Array<KeyInfo>, x: number, y: number) {
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
function checkCBlockMove(keyInfo: KeyInfo, keyInfos: Array<KeyInfo>, x: number, y: number) {
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

export const checkMove = (keyInfo: KeyInfo, keyInfos: Array<KeyInfo>, x: number, y: number) => {
  const posCheck = checkPosMove(keyInfo, x, y);
  console.log('checkMove posCheck:', posCheck);
  if (!posCheck) return false;

  const blockCheck = checkBlockMove(keyInfo, keyInfos, x, y);
  console.log('checkMove blockCheck:', blockCheck);
  if (blockCheck) return false;

  return true;
};
