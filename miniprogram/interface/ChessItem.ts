import { EMPTY_KEYPOS, KeyInfo, KeyPos, KeyType } from './index';
import Log from '../utils/log';

class ChessItem {
  protected x = -1;

  protected pronounceX = -1;

  protected y = -1;

  protected name = 'ChessItem';

  protected direction = 0;

  private type = KeyType.NONE;

  public constructor(keyInfo: KeyInfo) {
    this.type = keyInfo.type;
    this.x = keyInfo.x;
    this.y = keyInfo.y;
    if (this.type === KeyType.RED) {
      this.pronounceX = 9 - this.x;
      this.direction = 1;
    } else {
      this.pronounceX = 1 + this.x;
      this.direction = -1;
    }
  }

  public getDestPos(type: string, range: number): KeyPos {
    Log.d(this.name, 'getDestPos', type, range);
    return EMPTY_KEYPOS;
  }

  public checkMove(x: number, y: number, keyInfos: Array<KeyInfo>): boolean {
    Log.d(this.name, 'checkMove', x, y);

    // 判断是否可以移动到指定位置
    const posCheck = this.checkPosMove(x, y);
    Log.d(this.name, 'posCheck:', posCheck);
    if (!posCheck) {
      return false;
    }

    // 判断移动到指定位置是否有阻碍，比如绊马腿、塞象眼
    const blockCheck = this.checkBlockMove(x, y, keyInfos);
    Log.d(this.name, 'blockCheck:', blockCheck);
    if (!blockCheck) {
      return false;
    }

    return true;
  }

  protected isRed(): boolean {
    return this.type === KeyType.RED;
  }

  protected checkPosMove(x: number, y: number): boolean {
    Log.d(this.name, 'checkPosMove', x, y);
    return true;
  }

  protected checkBlockMove(x: number, y: number, keyInfos: Array<KeyInfo>): boolean {
    Log.d(this.name, 'checkBlockMove', x, y, keyInfos);
    return true;
  }
}

/**
 * 将
 */
export class KChessItem extends ChessItem {
  public constructor(keyInfo: KeyInfo) {
    super(keyInfo);
    this.name = 'KChessItem';
  }

  protected checkPosMove(x: number, y: number): boolean {
    Log.d(this.name, 'checkPosMove', x, y);
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
  public constructor(keyInfo: KeyInfo) {
    super(keyInfo);
    this.name = 'AChessItem';
  }

  public getDestPos(type: string, range: number): KeyPos {
    Log.d(this.name, 'getDestPos', type, range, this.pronounceX - range);
    switch (type) {
      case '进':
        return {
          x: this.x + (this.pronounceX - range) * this.direction,
          y: this.y - Math.abs(this.pronounceX - range) * this.direction,
        };
      case '退':
        return {
          x: this.x + (this.pronounceX - range) * this.direction,
          y: this.y + Math.abs(this.pronounceX - range) * this.direction,
        };
      default:
        return EMPTY_KEYPOS;
    }
  }

  protected checkPosMove(x: number, y: number): boolean {
    Log.d(this.name, 'checkPosMove', x, y);
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
  public constructor(keyInfo: KeyInfo) {
    super(keyInfo);
    this.name = 'BChessItem';
  }

  protected checkPosMove(x: number, y: number): boolean {
    Log.d(this.name, 'checkPosMove', x, y);
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

  protected checkBlockMove(x: number, y: number, keyInfos: Array<KeyInfo>): boolean {
    Log.d(this.name, `checkBlockMove now(${this.x}, ${this.y}) to dest(${x}, ${y})`);
    const keyX = (x + this.x) / 2;
    const keyY = (y + this.y) / 2;

    // 判断象眼位置是否存在棋子
    const targetKey = keyInfos.find(item => item.x === keyX && item.y === keyY);
    Log.d(this.name, `checkBlockMove targetKey exist: ${!!targetKey}`);
    return !targetKey;
  }
}

/**
 * 马
 */
export class NChessItem extends ChessItem {
  public constructor(keyInfo: KeyInfo) {
    super(keyInfo);
    this.name = 'NChessItem';
  }

  public getDestPos(type: string, range: number): KeyPos {
    Log.d(this.name, 'getDestPos', type, range, this.pronounceX - range);
    switch (type) {
      case '进':
        return {
          x: this.x + (this.pronounceX - range) * this.direction,
          y: this.y - (3 - Math.abs(this.pronounceX - range)) * this.direction,
        };
      default:
        return EMPTY_KEYPOS;
    }
  }

  protected checkPosMove(x: number, y: number): boolean {
    Log.d(this.name, 'checkPosMove', x, y);
    const xRange = Math.abs(this.x - x);
    const yRange = Math.abs(this.y - y);
    if (xRange !== 1 && xRange !== 2) return false;
    if (yRange !== 1 && yRange !== 2) return false;
    return xRange + yRange === 3;
  }

  protected checkBlockMove(x: number, y: number, keyInfos: Array<KeyInfo>): boolean {
    Log.d(this.name, `checkBlockMove now(${this.x}, ${this.y}) to dest(${x}, ${y})`);
    let keyX = 0, keyY = 0;
    const xRange = x - this.x;
    Log.d(this.name, `checkBlockMove xRange :${xRange}`);
    if (Math.abs(xRange) === 2) { // 判断是垂直方向的移动
      keyY = this.y;
      keyX = (this.x + x) / 2;
    } else { // 判断是水平方向的移动
      keyX = this.x;
      keyY = (y + this.y) / 2;
    }

    // 判断马脚位置是否存在棋子
    const targetKey = keyInfos.find(item => item.x === keyX && item.y === keyY);
    Log.d(this.name, `checkBlockMove targetKey exist: ${!!targetKey}`);
    return !targetKey;
  }
}

/**
 * 车
 */
export class RChessItem extends ChessItem {
  public constructor(keyInfo: KeyInfo) {
    super(keyInfo);
    this.name = 'RChessItem';
  }

  public getDestPos(type: string, range: number): KeyPos {
    Log.d(this.name, 'getDestPos', type, range, this.pronounceX - range);
    switch (type) {
      case '平':
        return {
          x: this.x + (this.pronounceX - range) * this.direction,
          y: this.y,
        };
      case '进':
        return {
          x: this.x,
          y: this.y - range * this.direction,
        };
      default:
        return EMPTY_KEYPOS;
    }
  }

  protected checkPosMove(x: number, y: number): boolean {
    Log.d(this.name, 'checkPosMove', x, y);
    const xRange = Math.abs(this.x - x);
    const yRange = Math.abs(this.y - y);
    return xRange === 0 || yRange === 0;
  }

  protected checkBlockMove(x: number, y: number, keyInfos: Array<KeyInfo>): boolean {
    Log.d(this.name, `checkBlockMove now(${this.x}, ${this.y}) to dest(${x}, ${y})`);
    let innerKeys = [] as Array<KeyInfo>;

    if (x === this.x) { // 判断是垂直方向的移动
      const minY = Math.min(this.y, y);
      const maxY = Math.max(this.y, y);
      innerKeys = keyInfos.filter(item => item.x === x && (item.y > minY && item.y < maxY));
    } else { // 判断是水平方向的移动
      const minX = Math.min(this.x, x);
      const maxX = Math.max(this.x, x);
      innerKeys = keyInfos.filter(item => item.y === y && (item.x > minX && item.x < maxX));
    }
    Log.d(this.name, `checkBlockMove innerKeys.length: ${innerKeys.length}`);

    // 判断是否可以移动到指定位置
    return innerKeys.length === 0;
  }
}

/**
 * 炮
 */
export class CChessItem extends ChessItem {
  public constructor(keyInfo: KeyInfo) {
    super(keyInfo);
    this.name = 'CChessItem';
  }

  public getDestPos(type: string, range: number): KeyPos {
    Log.d(this.name, 'getDestPos', type, range, this.pronounceX - range);
    switch (type) {
      case '平':
        return {
          x: this.x + (this.pronounceX - range) * this.direction,
          y: this.y,
        };
      case '进':
        return {
          x: this.x,
          y: this.y - range * this.direction,
        };
      default:
        return EMPTY_KEYPOS;
    }
  }

  protected checkPosMove(x: number, y: number): boolean {
    Log.d(this.name, 'checkPosMove', x, y);
    const xRange = Math.abs(this.x - x);
    const yRange = Math.abs(this.y - y);
    return xRange === 0 || yRange === 0;
  }

  protected checkBlockMove(x: number, y: number, keyInfos: Array<KeyInfo>): boolean {
    Log.d(this.name, `checkBlockMove now(${this.x}, ${this.y}) to dest(${x}, ${y})`);
    let innerKeys = [] as Array<KeyInfo>;

    if (x === this.x) { // 判断是垂直方向的移动
      const minY = Math.min(this.y, y);
      const maxY = Math.max(this.y, y);
      innerKeys = keyInfos.filter(item => item.x === x && (item.y > minY && item.y < maxY));
    } else { // 判断是水平方向的移动
      const minX = Math.min(this.x, x);
      const maxX = Math.max(this.x, x);
      innerKeys = keyInfos.filter(item => item.y === y && (item.x > minX && item.x < maxX));
    }
    Log.d(this.name, `checkBlockMove innerKeys.length: ${innerKeys.length}`);

    const targetKey = keyInfos.find(item => item.x === x && item.y === y);
    Log.d(this.name, `checkBlockMove targetKey exist: ${!!targetKey}`);

    // 判断是非可以吃子
    if (!!targetKey) {
      return innerKeys.length === 1;
    }

    // 判断是否可以移动到指定位置
    return innerKeys.length === 0;
  }
}

/**
 * 兵
 */
export class PChessItem extends ChessItem {
  public constructor(keyInfo: KeyInfo) {
    super(keyInfo);
    this.name = 'PChessItem';
  }

  public getDestPos(type: string, range: number): KeyPos {
    Log.d(this.name, 'getDestPos', type, range, this.pronounceX - range);
    switch (type) {
      case '平':
        return {
          x: this.x + (this.pronounceX - range) * this.direction,
          y: this.y,
        };
      case '进':
        return {
          x: this.x,
          y: this.y - range * this.direction,
        };
      default:
        return EMPTY_KEYPOS;
    }
  }

  protected checkPosMove(x: number, y: number): boolean {
    Log.d(this.name, 'checkPosMove', x, y);
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

export function getChessItem(keyInfo: KeyInfo): ChessItem {
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
