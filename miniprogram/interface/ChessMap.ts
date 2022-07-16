import { KeyInfo, KeyPos, KeyType, EMPTY_KEYINFO, STATUS, CHANGE_TYPE, ChessResult, getChessResult } from './index';
import * as util from '../utils/util';
import Log from '../utils/log';
import ChessItem, { getChessItem } from './ChessItem';

const IDX_NAME = [
  ['九', '八', '七', '六', '五', '四', '三', '二', '一'],
  ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
];

const RANGE_NAME = [
  ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
];

class ChessMap {
  private name = 'ChessMap';

  private keyInfos = [] as Array<KeyInfo>;

  private activeKey = EMPTY_KEYINFO; // 当前已经选中的棋子

  private activeKeyItem = new ChessItem(EMPTY_KEYINFO);

  public constructor() {
    this.hasActiveKey = this.hasActiveKey.bind(this);
  }

  public getFenStr(): string {
    const fenStr = util.getFenStr(this.keyInfos);
    return fenStr;
  }

  // helper
  public hasActiveKey(): boolean {
    return this.activeKey.type !== KeyType.NONE;
  }

  /**
   * 查找坐标(x, y)处的棋子
   *
   * @param x 坐标x的值
   * @param y 坐标y的值
   */
  public getKeyByPos(x: number, y: number): KeyInfo | undefined {
    return this.keyInfos.find(item => item.x === x && item.y === y);
  }

  /**
   * 处理点击坐标(x, y)的事件
   *
   * @param x 坐标x的值
   * @param y 坐标y的值
   */
  public click(x: number, y: number): ChessResult {
    Log.d(this.name, `click at (${x}, ${y})`);

    // 判断是否是无效点击
    if (this.checkEmptyClick(x, y)) {
      return getChessResult(STATUS.OK, '无效点击');
    }

    const { keyInfos, hasActiveKey, activeKey } = this;
    const focuskey = keyInfos.find(item => item.x === x && item.y === y);
    // 场景：点击在棋子上
    if (focuskey) {
      Log.d(this.name, '点击在棋子上', focuskey);

      // 1.1 选择棋子
      if (!hasActiveKey()) {
        Log.d(this.name, '选择棋子', focuskey);
        this.activeKey = { ...focuskey };
        this.activeKeyItem = getChessItem(this.activeKey);
        return {
          changed: [CHANGE_TYPE.ACTIVEKEY],
          status: STATUS.OK,
          msg: '选择棋子',
          cursorPos: this.getCursorPos(),
        };
      }

      // 1.2 取消选择棋子
      if (this.checkSamePos(activeKey, focuskey)) {
        Log.d(this.name, '取消选择棋子', focuskey);
        this.activeKey = { ...EMPTY_KEYINFO };
        this.activeKeyItem = getChessItem(this.activeKey);
        return {
          changed: [CHANGE_TYPE.ACTIVEKEY],
          status: STATUS.OK,
          msg: '取消选择棋子',
          cursorPos: this.getCursorPos(),
        };
      }

      // 1.3 同色棋子，点击后进行焦点更新
      if (this.checkSameCamp(activeKey, focuskey)) {
        Log.d(this.name, '同色棋子，点击后进行焦点更新', focuskey);
        this.activeKey = { ...focuskey };
        this.activeKeyItem = getChessItem(this.activeKey);
        return {
          changed: [CHANGE_TYPE.ACTIVEKEY],
          status: STATUS.OK,
          msg: '同色棋子，点击后进行焦点更新',
          cursorPos: this.getCursorPos(),
        };
      }
    }

    // 判断是否可以移动到指定位置
    if (!this.checkMove(x, y)) {
      Log.w(this.name, '无法移动到目标位置');
      return getChessResult(STATUS.WARN, '出错了，无法移动到目标位置');
    }

    // 移动棋子
    Log.d(this.name, `移动棋子 "${activeKey.name}" from (${activeKey.x}, ${activeKey.y}) to (${x}, ${y})`);

    const step = this.getStep(this.activeKey, this.keyInfos, x, y);

    const newKeyInfos = keyInfos.filter(item => item.x !== x || item.y !== y);
    const idx = newKeyInfos.findIndex(item => item.hash === activeKey.hash);
    newKeyInfos[idx].x = x;
    newKeyInfos[idx].y = y;

    this.updateKeyInfos(newKeyInfos);
    return {
      changed: [CHANGE_TYPE.ACTIVEKEY, CHANGE_TYPE.KEYINFO],
      status: STATUS.OK,
      msg: '移动棋子',
      step: { name: step, error: false },
      cursorPos: this.getCursorPos(),
      keyInfos: this.getKeyInfos(),
    };
  }

  public run(step: string): ChessResult {
    const arr = step.split('');
    Log.d(this.name, 'run', step, arr);
    if (arr.length !== 4) {
      throw new Error('棋谱格式错误');
    }

    let key = '';
    let index = -1;
    const type = arr[2];
    let range = -1;

    let keyType = KeyType.NONE;
    if (RANGE_NAME[0].includes(arr[3])) {
      keyType = KeyType.RED;
      range = RANGE_NAME[0].indexOf(arr[3]);
    } else {
      keyType = KeyType.BLACK;
      range = RANGE_NAME[1].indexOf(arr[3]);
    }

    if (['前', '中', '后'].includes(arr[0])) {
      key = arr[1];
    } else {
      key = arr[0];
      if (keyType === KeyType.RED) {
        index = IDX_NAME[0].indexOf(arr[1]);
      } else {
        index = IDX_NAME[1].indexOf(arr[1]);
      }
    }
    Log.d(this.name, 'keyType', keyType);
    Log.d(this.name, 'key', key);
    Log.d(this.name, 'index', index);
    Log.d(this.name, 'type', type);
    Log.d(this.name, 'range', range);
    return this.move(keyType, key, index, type, range);
  }

  public setFenStr(fenStr: string): ChessResult {
    this.keyInfos = util.parseFenStr(fenStr);
    this.activeKey = EMPTY_KEYINFO;
    this.activeKeyItem = new ChessItem(EMPTY_KEYINFO);

    return {
      changed: [CHANGE_TYPE.ACTIVEKEY, CHANGE_TYPE.KEYINFO],
      status: STATUS.OK,
      msg: '初始化',
      cursorPos: this.getCursorPos(),
      keyInfos: this.getKeyInfos(),
    };
  }

  private move(keyType: KeyType, key: string, index: number, type: string, range: number): ChessResult {
    Log.d(this.name, keyType, key, index, type, range);
    const keyInfo = this.keyInfos.find(item => item.type === keyType && item.name === key && item.x === index);
    Log.d(this.name, keyInfo, this.keyInfos);
    if (!keyInfo) {
      throw new Error('棋谱格式错误');
    }
    return this.moveKey(keyInfo, type, range);
  }

  private moveKey(keyInfo: KeyInfo, type: string, range: number): ChessResult {
    const chessItem = getChessItem(keyInfo);
    const pos = chessItem.getDestPos(type, range);
    Log.d(this.name, 'moveKey1', chessItem, type, range, pos);
    const { x, y } = pos;

    // 移动棋子
    Log.d(this.name, `移动棋子 "${keyInfo.name}" from (${keyInfo.x}, ${keyInfo.y}) to (${x}, ${y})`);

    const step = this.getStep(keyInfo, this.keyInfos, x, y);

    const newKeyInfos = this.keyInfos.filter(item => item.x !== x || item.y !== y);
    const idx = newKeyInfos.findIndex(item => item.hash === keyInfo.hash);
    newKeyInfos[idx].x = x;
    newKeyInfos[idx].y = y;

    this.updateKeyInfos(newKeyInfos);
    return {
      changed: [CHANGE_TYPE.ACTIVEKEY, CHANGE_TYPE.KEYINFO],
      status: STATUS.OK,
      msg: '移动棋子',
      step: { name: step, error: false },
      cursorPos: this.getCursorPos(),
      keyInfos: this.getKeyInfos(),
    };
  }

  private getKeyInfos(): Array<KeyInfo> {
    return this.keyInfos;
  }

  private getCursorPos(): KeyPos {
    return {
      x: this.activeKey.x,
      y: this.activeKey.y,
    };
  }

  private updateKeyInfos(keyInfos: Array<KeyInfo>): void {
    this.keyInfos = [...keyInfos];
    this.activeKey = EMPTY_KEYINFO;
    this.activeKeyItem = new ChessItem(EMPTY_KEYINFO);
  }

  /**
   * 判断棋子是否可以移动到坐标(x, y)处
   *
   * @param x 坐标x的值
   * @param y 坐标y的值
   */
  private checkMove(x: number, y: number): boolean {
    // 当前没有已选中棋子时，直接返回成功
    if (!this.hasActiveKey()) {
      return true;
    }

    return this.activeKeyItem.checkMove(x, y, this.keyInfos);
  }

  private checkSameCamp(keyInfo1: KeyInfo, keyInfo2: KeyInfo): boolean {
    return keyInfo1.type === keyInfo2.type;
  }

  private checkSamePos(keyInfo1: KeyInfo, keyInfo2: KeyInfo): boolean {
    return keyInfo1.x === keyInfo2.x && keyInfo1.y === keyInfo2.y;
  }

  /**
   * 判断点击坐标(x, y)是否无效点击
   *
   * @param x 坐标x的值
   * @param y 坐标y的值
   */
  private checkEmptyClick(x: number, y: number): boolean {
    const focuskey = this.keyInfos.find(item => item.x === x && item.y === y);
    return !focuskey && !this.hasActiveKey();
  }

  private getStep(keyInfo: KeyInfo, keyInfos: Array<KeyInfo>, x: number, y: number): string {
    Log.d(this.name, `getStep from(${keyInfo.x}, ${keyInfo.y}) to(${x}, ${y})`);
    let type = '';
    let from = '';
    let to = '';
    const idxNames = IDX_NAME[keyInfo.type];
    const rangeNames = RANGE_NAME[keyInfo.type];

    if (y === keyInfo.y) {
      type = '平';
      from = `${keyInfo.name}${idxNames[keyInfo.x]}`;
      to = idxNames[x];
    } else if (['r', 'R', 'c', 'C', 'p', 'P', 'k', 'K'].includes(keyInfo.key)) {
      from = `${keyInfo.name}${idxNames[keyInfo.x]}`;
      if (keyInfo.type) {
        type = y < keyInfo.y ? '退' : '进';
      } else {
        type = y < keyInfo.y ? '进' : '退';
      }
      const range = Math.abs(y - keyInfo.y);
      to = rangeNames[range];
    } else {
      from = `${keyInfo.name}${idxNames[keyInfo.x]}`;
      if (keyInfo.type) {
        type = y < keyInfo.y ? '退' : '进';
      } else {
        type = y < keyInfo.y ? '进' : '退';
      }
      to = idxNames[x];
    }

    const sameKeys = keyInfos
      .filter(item => item.key === keyInfo.key && item.x === keyInfo.x)
      .sort((a, b) => a.type ? b.y - a.y : a.y - b.y);
    Log.d(this.name, 'getStep sameKeys.length:', sameKeys.length);
    if (sameKeys.length > 1) {
      if (sameKeys[0].hash === keyInfo.hash) {
        from = `前${keyInfo.name}`;
      } else if (sameKeys[sameKeys.length - 1].hash === keyInfo.hash) {
        from = `后${keyInfo.name}`;
      } else {
        from = `中${keyInfo.name}`;
      }
    }
    return `${from}${type}${to}`;
  }
}

export default ChessMap;
