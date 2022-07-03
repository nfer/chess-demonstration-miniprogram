import { KeyInfo, KeyPos, KeyType, StepInfo, STATUS, CHANGE_TYPE } from './index';
import * as util from '../utils/util';
import Log from '../utils/log';
import ChessMap from './ChessMap';

const TAG = 'ChessClass';

class Chess {
  private nowSteps = [] as Array<StepInfo>;

  private _fenStr = ''; // 初始化时的棋局

  private _keyMapFenStrs = [] as Array<string>;

  private _expectSteps = [] as Array<string>;

  private chessMap = new ChessMap();

  public constructor() {
    this.init = this.init.bind(this);
    this.click = this.click.bind(this);
  }

  public init(keyMapFenStr = '') {
    this._fenStr = keyMapFenStr || 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR';
    return this.reload();
  }

  public setExpectSteps(expectSteps: Array<string>) {
    this._expectSteps = [...expectSteps];
  }

  public getCursorPos(): KeyPos {
    return this.chessMap.getCursorPos();
  }

  public getNowSteps(): Array<StepInfo> {
    return this.nowSteps;
  }

  public getKeyInfos(): Array<KeyInfo> {
    return this.chessMap.getKeyInfos();
  }

  public isError(): boolean {
    if (this.nowSteps.length === 0) {
      return false;
    }

    return this.nowSteps.some((step, index) => step.name !== this._expectSteps[index]);
  }

  public isSuccess(): boolean {
    if (this.nowSteps.length === 0) {
      return false;
    }

    return this.nowSteps.length === this._expectSteps.length;
  }

  /**
   * 判断规则“执红棋的一方先走”
   *
   * @param focuskey KeyInfo
   */
  private checkRedFirst(x: number, y: number): boolean {
    const focuskey = this.chessMap.getKeyInfos().find(item => item.x === x && item.y === y);
    if (!focuskey) {
      return true;
    }

    // 如果是不是第一步，跳过判断
    if (this.nowSteps.length) {
      return true;
    }

    // 如果是已选择了棋子，则这里是吃子或移动棋子，跳过判断
    if (this.chessMap.hasActiveKey()) {
      return true;
    }

    return focuskey.type === KeyType.RED;
  }

  /**
   * 判断规则“双方轮流各走一着”
   *
   * @param focuskey KeyInfo
   */
  private checkCrossMove(x: number, y: number): boolean {
    const focuskey = this.chessMap.getKeyInfos().find(item => item.x === x && item.y === y);
    if (!focuskey) {
      return true;
    }

    // 如果是已选择了棋子，则这里是吃子或移动棋子，跳过判断
    if (this.chessMap.hasActiveKey()) {
      return true;
    }

    const lastKeyType = this.nowSteps.length % 2 ? KeyType.RED : KeyType.BLACK;
    return focuskey.type !== lastKeyType;
  }

  public click(x: number, y: number) {
    Log.d(TAG, `click at (${x}, ${y})`);
    // 出错时不再响应棋盘交互
    if (this.isError()) {
      Log.w(TAG, '出错时不再响应棋盘交互');
      return {
        changed: [],
        status: STATUS.WARN,
        msg: '出错时不再响应棋盘交互',
      };
    }

    // 打谱成功时不再响应棋盘交互
    if (this.isSuccess()) {
      Log.w(TAG, '打谱成功时不再响应棋盘交互');
      return {
        changed: [],
        status: STATUS.WARN,
        msg: '打谱成功时不再响应棋盘交互',
      };
    }

    // 判断规则“执红棋的一方先走”
    if (!this.checkRedFirst(x, y)) {
      return {
        changed: [],
        status: STATUS.WARN,
        msg: '出错了，违反规则“执红棋的一方先走”',
      };
    }

    // 判断规则“双方轮流各走一着”
    if (!this.checkCrossMove(x, y)) {
      return {
        changed: [],
        status: STATUS.WARN,
        msg: '出错了，违反规则“双方轮流各走一着”',
      };
    }

    const result = this.chessMap.click(x, y);
    Log.d(TAG, 'click result', result);
    if (result.changed.includes(CHANGE_TYPE.KEYINFO)) {
      const fenStr = util.getFenStr(this.chessMap.getKeyInfos());
      Log.d(TAG, 'new fen str', fenStr);
      this._keyMapFenStrs.push(fenStr);
    }
    return result;
  }

  public reload() {
    this._keyMapFenStrs = [this._fenStr];
    this.nowSteps = [];
    const lastestFenStr = this._keyMapFenStrs[this._keyMapFenStrs.length - 1];
    return this.chessMap.setFenStr(lastestFenStr);
  }

  public revert() {
    // 棋局记录最少2条才可以回退
    if (this._keyMapFenStrs.length < 2) {
      return {
        changed: [],
        status: STATUS.OK,
        msg: '',
      };
    }

    // 去除最后一条棋局记录
    this._keyMapFenStrs.pop();

    // 去除最后一条棋谱记录
    this.nowSteps.pop();

    const lastestFenStr = this._keyMapFenStrs[this._keyMapFenStrs.length - 1];
    return this.chessMap.setFenStr(lastestFenStr);
  }

  public getHint() {
    const idx = this.nowSteps.length;
    const content = this._expectSteps[idx];
    Log.d(TAG, 'hint', idx, content);
    return content;
  }
}

export default Chess;
