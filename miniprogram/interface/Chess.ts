import { KeyInfo, KeyPos, KeyType, StepInfo, STATUS, CHANGE_TYPE } from './index';
import Log from '../utils/log';
import ChessMap from './ChessMap';

const TAG = 'ChessClass';

class Chess {
  private nowSteps = [] as Array<StepInfo>;

  private _fenStr = ''; // 初始化时的棋局

  private _keyMapFenStrs = [] as Array<string>;

  private _expectSteps = [] as Array<string>;

  private chessMap = new ChessMap();

  constructor() {
    this.init = this.init.bind(this);
    this.click = this.click.bind(this);
  }

  init(keyMapFenStr = '') {
    this._fenStr = keyMapFenStr || 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR';
    return this.reload();
  }

  setExpectSteps(expectSteps: Array<string>) {
    this._expectSteps = [...expectSteps];
  }

  getCursorPos(): KeyPos {
    return this.chessMap.getCursorPos();
  }

  getNowSteps(): Array<StepInfo> {
    return this.nowSteps;
  }

  getKeyInfos(): Array<KeyInfo> {
    return this.chessMap.getKeyInfos();
  }

  isError(): boolean {
    if (this.nowSteps.length === 0) {
      return false;
    }

    return this.nowSteps.some((step, index) => step.name !== this._expectSteps[index]);
  }

  isSuccess(): boolean {
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
  checkRedFirst(x: number, y: number): boolean {
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
  checkCrossMove(x: number, y: number): boolean {
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

  checkSameCamp(keyInfo1: KeyInfo, keyInfo2: KeyInfo): boolean {
    return keyInfo1.type === keyInfo2.type;
  }

  checkSamePos(keyInfo1: KeyInfo, keyInfo2: KeyInfo): boolean {
    return keyInfo1.x === keyInfo2.x && keyInfo1.y === keyInfo2.y;
  }

  click(x: number, y: number) {
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

    return this.chessMap.click(x, y);
  }

  reload() {
    this._keyMapFenStrs = [this._fenStr];
    this.nowSteps = [];
    return this.chessMap.setFenStr(this._fenStr);
  }

  revert() {
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

    return {
      changed: [CHANGE_TYPE.ACTIVEKEY, CHANGE_TYPE.KEYINFO, CHANGE_TYPE.NOWSTEPS],
      status: STATUS.OK,
      msg: '悔棋',
    };
  }

  getHint() {
    const { nowSteps, _expectSteps } = this;
    const idx = nowSteps.length;
    const content = _expectSteps[idx];
    Log.d(TAG, 'hint', idx, content);
    return content;
  }
}

export default Chess;
