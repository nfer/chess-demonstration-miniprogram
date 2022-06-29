import { KeyInfo, KeyPos, KeyType, EMPTY_KEYINFO, StepInfo } from './index';
import * as util from '../utils/util';
import * as stepUtils from '../utils/step';
import Log from '../utils/log';
import { checkPosMove, checkBlockMove } from '../utils/checkMove';

const TAG = 'ChessClass';
export enum STATUS {
  OK = 0,
  WARN,
  ERROR,
}
export enum CHANGE_TYPE {
  KEYINFO,
  ACTIVEKEY,
  NOWSTEPS,
}

export interface ChessResult {
  changed: Array<CHANGE_TYPE>;
  status: STATUS;
  msg: string;
}

class Chess {
  keyInfos = [] as Array<KeyInfo>;

  nowSteps = [] as Array<StepInfo>;

  private _activeKey = EMPTY_KEYINFO; // 当前已经选中的棋子

  private _fenStr = ''; // 初始化时的棋局

  private _keyMapFenStrs = [] as Array<string>;

  private _expectSteps = [] as Array<string>;

  constructor() {
    this.init = this.init.bind(this);
    this.hasActiveKey = this.hasActiveKey.bind(this);
    this.click = this.click.bind(this);
    this.updateKeyInfos = this.updateKeyInfos.bind(this);
  }

  init(keyMapFenStr = '') {
    this._fenStr = keyMapFenStr || 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR';

    return this.reload();
  }

  setExpectSteps(expectSteps: Array<string>) {
    this._expectSteps = [...expectSteps];
  }

  getCursorPos(): KeyPos {
    return {
      x: this._activeKey.x,
      y: this._activeKey.y,
    };
  }

  // helper
  hasActiveKey(): boolean {
    return this._activeKey.type !== KeyType.NONE;
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

  checkMove(x: number, y: number): boolean {
    // 当前没有已选中棋子时，直接返回成功
    if (!this.hasActiveKey()) {
      return true;
    }

    // 判断是否可以移动到指定位置
    const posCheck = checkPosMove(this._activeKey, x, y);
    Log.d(TAG, 'posCheck:', posCheck);
    if (!posCheck) {
      return false;
    }

    // 判断移动到指定位置是否有阻碍，比如绊马腿、塞象眼
    const blockCheck = checkBlockMove(this._activeKey, this.keyInfos, x, y);
    Log.d(TAG, 'blockCheck:', blockCheck);
    if (!posCheck) {
      return false;
    }

    return true;
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

    // 判断是否可以移动到指定位置
    if (!this.checkMove(x, y)) {
      Log.w(TAG, '无法移动到目标位置');
      return {
        changed: [],
        status: STATUS.WARN,
        msg: '出错了，无法移动到目标位置”',
      };
    }

    const { keyInfos, nowSteps, hasActiveKey, _activeKey } = this;
    const focuskey = keyInfos.find(item => item.x === x && item.y === y);
    // 场景二：点击在棋子上
    if (focuskey) {
      Log.d(TAG, '点击在棋子上', focuskey);
      if (focuskey.type === KeyType.BLACK && nowSteps.length === 0 && !hasActiveKey()) {
        return {
          changed: [],
          status: STATUS.WARN,
          msg: '出错了，违反规则“执红棋的一方先走”',
        };
      }

      const lastKeyType = nowSteps.length % 2 ? KeyType.RED : KeyType.BLACK;
      if (_activeKey.type === KeyType.NONE && lastKeyType === focuskey.type) {
        return {
          changed: [],
          status: STATUS.WARN,
          msg: '出错了，违反规则“双方轮流各走一着”',
        };
      }

      // 1.1 选择棋子
      if (!hasActiveKey()) {
        Log.d(TAG, '选择棋子', focuskey);
        this._activeKey = { ...focuskey };
        return {
          changed: [CHANGE_TYPE.ACTIVEKEY],
          status: STATUS.OK,
          msg: '选择棋子',
        };
      }

      // 1.2 取消选择棋子
      if (this.checkSamePos(_activeKey, focuskey)) {
        Log.d(TAG, '取消选择棋子', focuskey);
        this._activeKey = { ...EMPTY_KEYINFO };
        return {
          changed: [CHANGE_TYPE.ACTIVEKEY],
          status: STATUS.OK,
          msg: '取消选择棋子',
        };
      }

      // 1.3 同色棋子，点击后进行焦点更新
      if (this.checkSameCamp(_activeKey, focuskey)) {
        Log.d(TAG, '同色棋子，点击后进行焦点更新', focuskey);
        this._activeKey = { ...focuskey };
        return {
          changed: [CHANGE_TYPE.ACTIVEKEY],
          status: STATUS.OK,
          msg: '同色棋子，点击后进行焦点更新',
        };
      }

      //  1.4 吃掉棋子
      Log.d(TAG, '吃掉棋子', _activeKey, focuskey);
      const curStep = stepUtils.getStep(_activeKey, keyInfos, x, y);
      nowSteps.push({ name: curStep, error: false });

      const idx = keyInfos.findIndex(item => item.hash === _activeKey.hash);
      keyInfos[idx].x = x;
      keyInfos[idx].y = y;
      const newKeyInfos = keyInfos.filter(item => item.hash !== focuskey.hash);

      this.updateKeyInfos(newKeyInfos, nowSteps);
      return {
        changed: [CHANGE_TYPE.ACTIVEKEY, CHANGE_TYPE.KEYINFO, CHANGE_TYPE.NOWSTEPS],
        status: STATUS.OK,
        msg: '吃掉棋子',
      };
    }

    // 场景三：点击在网格上
    Log.d(TAG, '点击在网格上', x, y);
    if (_activeKey.type !== KeyType.NONE) {
      //  移动棋子
      Log.d(TAG, '移动棋子', _activeKey, focuskey);
      const curStep = stepUtils.getStep(_activeKey, keyInfos, x, y);
      nowSteps.push({ name: curStep, error: false });

      const idx = keyInfos.findIndex(item => item.hash === _activeKey.hash);
      keyInfos[idx].y = y;
      keyInfos[idx].x = x;

      this.updateKeyInfos(keyInfos, nowSteps);
      return {
        changed: [CHANGE_TYPE.ACTIVEKEY, CHANGE_TYPE.KEYINFO, CHANGE_TYPE.NOWSTEPS],
        status: STATUS.OK,
        msg: '移动棋子',
      };
    }

    return {
      changed: [],
      status: STATUS.OK,
      msg: '',
    };
  }

  reload() {
    this._keyMapFenStrs.push(this._fenStr);
    this.keyInfos = util.parseFenStr(this._fenStr);
    this.nowSteps = [];
    this._activeKey = EMPTY_KEYINFO;

    return {
      changed: [CHANGE_TYPE.ACTIVEKEY, CHANGE_TYPE.KEYINFO, CHANGE_TYPE.NOWSTEPS],
      status: STATUS.OK,
      msg: '初始化',
    };
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

    // 取回退后的最后一条棋局进行重新渲染
    const fenStr = this._keyMapFenStrs[this._keyMapFenStrs.length - 1];
    this.keyInfos = util.parseFenStr(fenStr);

    // 重置当前已经选中的棋子
    this._activeKey = EMPTY_KEYINFO;

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

  updateKeyInfos(keyInfos: Array<KeyInfo>, nowSteps: Array<StepInfo>) {
    this.keyInfos = [...keyInfos];
    this._activeKey = EMPTY_KEYINFO;
    this._keyMapFenStrs.push(util.getFenStr(keyInfos));
    this.nowSteps = [...nowSteps];
    if (this.isError()) {
      const len = this.nowSteps.length;
      this.nowSteps[len - 1].error = true;
    }
  }
}

export default Chess;
