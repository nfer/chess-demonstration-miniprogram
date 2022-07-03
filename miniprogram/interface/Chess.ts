import { KeyType, StepInfo, STATUS, CHANGE_TYPE, DEMONSTRATION_RESULT, ChessResult, getChessResult } from './index';
import Log from '../utils/log';
import ChessMap from './ChessMap';

class Chess {
  private name = 'Chess';

  /** 棋谱记录 */
  private nowSteps = [] as Array<StepInfo>;

  /** 正确的棋谱记录（用于打谱对比） */
  private expectSteps = [] as Array<string>;

  /** 初始化时的棋局 */
  private fenStr = '';

  /** 棋局记录，用于悔棋 */
  private keyMapFenStrs = [] as Array<string>;

  private chessMap = new ChessMap();

  public init(keyMapFenStr = ''): ChessResult {
    this.fenStr = keyMapFenStr || 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR';
    return this.reload();
  }

  public setExpectSteps(expectSteps: Array<string>): void {
    this.expectSteps = [...expectSteps];
  }

  public getNowSteps(): Array<StepInfo> {
    return this.nowSteps;
  }

  /**
   * 处理点击坐标(x, y)的事件
   *
   * @param x 坐标x的值
   * @param y 坐标y的值
   */
  public click(x: number, y: number): ChessResult {
    Log.d(this.name, `click at (${x}, ${y})`);
    // 出错时不再响应棋盘交互
    if (this.isError()) {
      Log.w(this.name, '出错时不再响应棋盘交互');
      return getChessResult(STATUS.WARN, '出错时不再响应棋盘交互');
    }

    // 打谱成功时不再响应棋盘交互
    if (this.isSuccess()) {
      Log.w(this.name, '打谱成功时不再响应棋盘交互');
      return getChessResult(STATUS.WARN, '打谱成功时不再响应棋盘交互');
    }

    // 判断规则“执红棋的一方先走”
    if (!this.checkRedFirst(x, y)) {
      Log.w(this.name, '出错了，违反规则“执红棋的一方先走”');
      return getChessResult(STATUS.WARN, '出错了，违反规则“执红棋的一方先走”');
    }

    // 判断规则“双方轮流各走一着”
    if (!this.checkCrossMove(x, y)) {
      Log.w(this.name, '出错了，违反规则“双方轮流各走一着”');
      return getChessResult(STATUS.WARN, '出错了，违反规则“双方轮流各走一着”');
    }

    const result = this.chessMap.click(x, y);
    Log.d(this.name, 'click result', result);
    if (result.changed.includes(CHANGE_TYPE.KEYINFO)) {
      const fenStr = this.chessMap.getFenStr();
      Log.d(this.name, 'new fen str', fenStr);
      this.keyMapFenStrs.push(fenStr);
      this.nowSteps.push(result.step as StepInfo);
      if (this.isError()) {
        this.nowSteps[this.nowSteps.length - 1].error = true;
        result.result = DEMONSTRATION_RESULT.ERROR;
      } else if (this.isSuccess()) {
        result.result = DEMONSTRATION_RESULT.SUCCESS;
      } else {
        result.result = DEMONSTRATION_RESULT.NORMAL;
      }
    }
    return result;
  }

  public reload(): ChessResult {
    this.keyMapFenStrs = [this.fenStr];
    this.nowSteps = [];
    const lastestFenStr = this.keyMapFenStrs[this.keyMapFenStrs.length - 1];
    return this.chessMap.setFenStr(lastestFenStr);
  }

  public revert(): ChessResult {
    // 棋局记录最少2条才可以回退
    if (this.keyMapFenStrs.length < 2) {
      return getChessResult(STATUS.OK);
    }

    // 去除最后一条棋局记录
    this.keyMapFenStrs.pop();

    // 去除最后一条棋谱记录
    this.nowSteps.pop();

    const lastestFenStr = this.keyMapFenStrs[this.keyMapFenStrs.length - 1];
    return this.chessMap.setFenStr(lastestFenStr);
  }

  public getHint(): string {
    const idx = this.nowSteps.length;
    const content = this.expectSteps[idx];
    Log.d(this.name, 'hint', idx, content);
    return content;
  }

  private isError(): boolean {
    if (this.nowSteps.length === 0) {
      return false;
    }

    return this.nowSteps.some((step, index) => step.name !== this.expectSteps[index]);
  }

  private isSuccess(): boolean {
    if (this.nowSteps.length === 0) {
      return false;
    }

    return this.nowSteps.length === this.expectSteps.length;
  }

  /**
   * 判断规则“执红棋的一方先走”
   *
   * @param x 坐标x的值
   * @param y 坐标y的值
   */
  private checkRedFirst(x: number, y: number): boolean {
    const focuskey = this.chessMap.getKeyByPos(x, y);
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
   * @param x 坐标x的值
   * @param y 坐标y的值
   */
  private checkCrossMove(x: number, y: number): boolean {
    const focuskey = this.chessMap.getKeyByPos(x, y);
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
}

export default Chess;
