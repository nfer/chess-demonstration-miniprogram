/* eslint-disable @typescript-eslint/no-useless-constructor */
import { KeyInfo, KeyType } from './index';
import Log from '../utils/log';

const TAG = 'ChessItem';

class ChessItem {
  private type = KeyType.NONE;

  private x = -1;

  private y = -1;

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
}


/**
 * 士
 */
export class AChessItem extends ChessItem {
  constructor(keyInfo: KeyInfo) {
    super(keyInfo);
  }
}

/**
 * 相
 */
export class BChessItem extends ChessItem {
  constructor(keyInfo: KeyInfo) {
    super(keyInfo);
  }
}

/**
 * 马
 */
export class NChessItem extends ChessItem {
  constructor(keyInfo: KeyInfo) {
    super(keyInfo);
  }
}

/**
 * 车
 */
export class RChessItem extends ChessItem {
  constructor(keyInfo: KeyInfo) {
    super(keyInfo);
  }
}

/**
 * 炮
 */
export class CChessItem extends ChessItem {
  constructor(keyInfo: KeyInfo) {
    super(keyInfo);
  }
}

/**
 * 兵
 */
export class PChessItem extends ChessItem {
  constructor(keyInfo: KeyInfo) {
    super(keyInfo);
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
