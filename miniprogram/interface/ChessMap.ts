import { KeyInfo, KeyPos, KeyType, EMPTY_KEYINFO, STATUS, CHANGE_TYPE, ChessResult, getChessResult } from './index';
import * as util from '../utils/util';
import * as stepUtils from '../utils/step';
import Log from '../utils/log';
import ChessItem, { getChessItem } from './ChessItem';

class ChessMap {
  private name = 'ChessMap';

  private keyInfos = [] as Array<KeyInfo>;

  private activeKey = EMPTY_KEYINFO; // 当前已经选中的棋子

  private activeKeyItem = new ChessItem(EMPTY_KEYINFO);

  public constructor() {
    this.hasActiveKey = this.hasActiveKey.bind(this);
  }

  public getCursorPos(): KeyPos {
    return {
      x: this.activeKey.x,
      y: this.activeKey.y,
    };
  }

  public getKeyInfos(): Array<KeyInfo> {
    return this.keyInfos;
  }

  // helper
  public hasActiveKey(): boolean {
    return this.activeKey.type !== KeyType.NONE;
  }

  public click(x: number, y: number): ChessResult {
    Log.d(this.name, `click at (${x}, ${y})`);

    // 判断是否是无效点击
    if (this.checkEmptyClick(x, y)) {
      return getChessResult(STATUS.OK, '无效点击');
    }

    // 判断是否可以移动到指定位置
    if (!this.checkMove(x, y)) {
      Log.w(this.name, '无法移动到目标位置');
      return getChessResult(STATUS.WARN, '出错了，无法移动到目标位置');
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
        };
      }
    }

    // 移动棋子
    Log.d(this.name, `移动棋子 "${activeKey.name}" from (${activeKey.x}, ${activeKey.y}) to (${x}, ${y})`);

    const step = stepUtils.getStep(this.activeKey, this.keyInfos, x, y);

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
    };
  }

  public setFenStr(fenStr: string): ChessResult {
    this.keyInfos = util.parseFenStr(fenStr);
    this.activeKey = EMPTY_KEYINFO;
    this.activeKeyItem = new ChessItem(EMPTY_KEYINFO);

    return {
      changed: [CHANGE_TYPE.ACTIVEKEY, CHANGE_TYPE.KEYINFO],
      status: STATUS.OK,
      msg: '初始化',
    };
  }

  private updateKeyInfos(keyInfos: Array<KeyInfo>): void {
    this.keyInfos = [...keyInfos];
    this.activeKey = EMPTY_KEYINFO;
    this.activeKeyItem = new ChessItem(EMPTY_KEYINFO);
  }

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
   * 判断是否是无效点击
   *
   * @param x 点击的x位置
   * @param y 点击的y位置
   */
  private checkEmptyClick(x: number, y: number): boolean {
    const focuskey = this.keyInfos.find(item => item.x === x && item.y === y);
    return !focuskey && !this.hasActiveKey();
  }
}

export default ChessMap;
