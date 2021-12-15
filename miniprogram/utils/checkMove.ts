import { KeyInfo } from '../interface/index';

// 将和帅
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

// 士和仕
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

// 相和象
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

export const checkMove = (keyInfo: KeyInfo, x: number, y: number) => {
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
  }
  return false;
};