/* eslint-disable @typescript-eslint/no-useless-constructor */
import { KeyInfo, KeyType } from './index';
import Log from '../utils/log';

const TAG = 'ChessItem';

class ChessItem {
  private type = KeyType.NONE;

  protected x = -1;

  protected y = -1;

  constructor(keyInfo: KeyInfo) {
    this.type = keyInfo.type;
    this.x = keyInfo.x;
    this.y = keyInfo.y;
  }

  isRed() {
    return this.type === KeyType.RED;
  }

  checkPosMove(x: number, y: number): boolean {
    Log.d(TAG, 'checkPosMove', x, y);
    return true;
  }

  checkBlockMove(x: number, y: number, keyInfos: Array<KeyInfo>): boolean {
    Log.d(TAG, 'checkBlockMove', x, y, keyInfos);
    return true;
  }

  checkMove(x: number, y: number, keyInfos: Array<KeyInfo>): boolean {
    Log.d(TAG, 'checkMove', x, y);

    // 判断是否可以移动到指定位置
    const posCheck = this.checkPosMove(x, y);
    Log.d(TAG, 'posCheck:', posCheck);
    if (!posCheck) {
      return false;
    }

    // 判断移动到指定位置是否有阻碍，比如绊马腿、塞象眼
    const blockCheck = this.checkBlockMove(x, y, keyInfos);
    Log.d(TAG, 'blockCheck:', blockCheck);
    if (!posCheck) {
      return false;
    }

    return true;
  }
}

/**
 * 将
 */
export class KChessItem extends ChessItem {
  constructor(keyInfo: KeyInfo) {
    super(keyInfo);
  }

  checkPosMove(x: number, y: number): boolean {
    Log.d(TAG, 'checkPosMove', x, y);
    if (x < 3 || x > 5) return false;

    if (this.isRed()) {
      if (y < 7 || y > 9) return false;
    } else {
      if (y < 0 || y > 3) return false;
    }

    const step = Math.abs(this.x - x) + Math.abs(this.y - y);
    return step === 1;
  }
}


/**
 * 士
 */
export class AChessItem extends ChessItem {
  constructor(keyInfo: KeyInfo) {
    super(keyInfo);
  }

  checkPosMove(x: number, y: number): boolean {
    Log.d(TAG, 'checkPosMove', x, y);
    let arr = [];
    if (this.isRed()) {
      arr = [[3, 7], [3, 9], [4, 8], [5, 7], [5, 9]];
    } else {
      arr = [[3, 0], [3, 2], [4, 1], [5, 0], [5, 2]];
    }

    const pos = arr.find(([px, py]) => px === x && py === y);
    if (!pos) return false;

    return Math.abs(this.x - x) === 1 && Math.abs(this.y - y) === 1;
  }
}

/**
 * 相
 */
export class BChessItem extends ChessItem {
  constructor(keyInfo: KeyInfo) {
    super(keyInfo);
  }

  checkPosMove(x: number, y: number): boolean {
    Log.d(TAG, 'checkPosMove', x, y);
    let arr = [];
    if (this.isRed()) {
      arr = [[2, 9], [6, 9], [0, 7], [4, 7], [8, 7], [2, 5], [6, 5]];
    } else {
      arr = [[2, 4], [6, 4], [0, 2], [4, 2], [8, 2], [2, 0], [6, 0]];
    }

    const pos = arr.find(([px, py]) => px === x && py === y);
    if (!pos) return false;

    return Math.abs(this.x - x) === 2 && Math.abs(this.y - y) === 2;
  }
}

/**
 * 马
 */
export class NChessItem extends ChessItem {
  constructor(keyInfo: KeyInfo) {
    super(keyInfo);
  }

  checkPosMove(x: number, y: number): boolean {
    Log.d(TAG, 'checkPosMove', x, y);
    const xRange = Math.abs(this.x - x);
    const yRange = Math.abs(this.y - y);
    if (xRange !== 1 && xRange !== 2) return false;
    if (yRange !== 1 && yRange !== 2) return false;
    return xRange + yRange === 3;
  }
}

/**
 * 车
 */
export class RChessItem extends ChessItem {
  constructor(keyInfo: KeyInfo) {
    super(keyInfo);
  }

  checkPosMove(x: number, y: number): boolean {
    Log.d(TAG, 'checkPosMove', x, y);
    const xRange = Math.abs(this.x - x);
    const yRange = Math.abs(this.y - y);
    return xRange === 0 || yRange === 0;
  }
}

/**
 * 炮
 */
export class CChessItem extends ChessItem {
  constructor(keyInfo: KeyInfo) {
    super(keyInfo);
  }

  checkPosMove(x: number, y: number): boolean {
    Log.d(TAG, 'checkPosMove', x, y);
    const xRange = Math.abs(this.x - x);
    const yRange = Math.abs(this.y - y);
    return xRange === 0 || yRange === 0;
  }
}

/**
 * 兵
 */
export class PChessItem extends ChessItem {
  constructor(keyInfo: KeyInfo) {
    super(keyInfo);
  }

  checkPosMove(x: number, y: number): boolean {
    Log.d(TAG, 'checkPosMove', x, y);
    const xRange = Math.abs(this.x - x);
    const yRange = Math.abs(this.y - y);
    if (xRange + yRange !== 1) return false;

    if (this.isRed()) {
      if (y > this.y) return false;
      if (this.y > 4 && x !== this.x) return false;
    } else {
      if (y < this.y) return false;
      if (this.y < 5 && x !== this.x) return false;
    }
    return true;
  }
}

export function getChessItem(keyInfo: KeyInfo) {
  switch (keyInfo.key) {
    case 'k':
    case 'K':
      return new KChessItem(keyInfo);
    case 'a':
    case 'A':
      return new AChessItem(keyInfo);
    case 'b':
    case 'B':
      return new BChessItem(keyInfo);
    case 'n':
    case 'N':
      return new NChessItem(keyInfo);
    case 'r':
    case 'R':
      return new RChessItem(keyInfo);
    case 'c':
    case 'C':
      return new CChessItem(keyInfo);
    case 'p':
    case 'P':
      return new PChessItem(keyInfo);
  }
  return new ChessItem(keyInfo);
}

export default ChessItem;
