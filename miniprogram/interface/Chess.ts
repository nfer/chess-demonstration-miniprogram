import { KeyInfo, KeyPos, KeyType, EMPTY_KEYINFO } from './index';
import * as util from '../utils/util';
import * as stepUtils from '../utils/step';
import Log from '../utils/log';
import { checkMove, checkSameCamp, checkSamePos } from '../utils/checkMove';

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
export enum STEP_RESULT {
  NONE = 0,
  SUCCESS,
  ERROR,
}

export interface ChessResult {
  changed: Array<CHANGE_TYPE>;
  status: STATUS;
  msg: string;
  result: STEP_RESULT;
}

class Chess {
  keyInfos = [] as Array<KeyInfo>;

  nowSteps = [] as Array<string>;

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

    return this.nowSteps.some((value, index) => value !== this._expectSteps[index]);
  }

  isSuccess(): boolean {
    if (this.nowSteps.length === 0) {
      return false;
    }

    return this.nowSteps.length === this._expectSteps.length;
  }

  click(x: number, y: number) {
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
          result: STEP_RESULT.NONE,
        };
      }

      const lastKeyType = nowSteps.length % 2 ? KeyType.RED : KeyType.BLACK;
      if (_activeKey.type === KeyType.NONE && lastKeyType === focuskey.type) {
        return {
          changed: [],
          status: STATUS.WARN,
          msg: '出错了，违反规则“双方轮流各走一着”',
          result: STEP_RESULT.NONE,
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
          result: STEP_RESULT.NONE,
        };
      }

      // 1.2 取消选择棋子
      if (checkSamePos(_activeKey, focuskey)) {
        Log.d(TAG, '取消选择棋子', focuskey);
        this._activeKey = { ...EMPTY_KEYINFO };
        return {
          changed: [CHANGE_TYPE.ACTIVEKEY],
          status: STATUS.OK,
          msg: '取消选择棋子',
          result: STEP_RESULT.NONE,
        };
      }

      // 1.3 同色棋子，点击后进行焦点更新
      if (checkSameCamp(_activeKey, focuskey)) {
        Log.d(TAG, '同色棋子，点击后进行焦点更新', focuskey);
        this._activeKey = { ...focuskey };
        return {
          changed: [CHANGE_TYPE.ACTIVEKEY],
          status: STATUS.OK,
          msg: '同色棋子，点击后进行焦点更新',
          result: STEP_RESULT.NONE,
        };
      }

      if (!checkMove(_activeKey, keyInfos, focuskey.x, focuskey.y)) {
        Log.w(TAG, '无法移动到目标位置', _activeKey, focuskey);
        return {
          changed: [],
          status: STATUS.WARN,
          msg: '出错了，无法移动到目标位置”',
          result: STEP_RESULT.NONE,
        };
      }

      //  1.4 吃掉棋子
      Log.d(TAG, '吃掉棋子', _activeKey, focuskey);
      const curStep = stepUtils.getStep(_activeKey, keyInfos, x, y);
      nowSteps.push(curStep);

      const idx = keyInfos.findIndex(item => item.hash === _activeKey.hash);
      keyInfos[idx].x = x;
      keyInfos[idx].y = y;
      const newKeyInfos = keyInfos.filter(item => item.hash !== focuskey.hash);

      this.updateKeyInfos(newKeyInfos, nowSteps);
      return {
        changed: [CHANGE_TYPE.ACTIVEKEY, CHANGE_TYPE.KEYINFO, CHANGE_TYPE.NOWSTEPS],
        status: STATUS.OK,
        msg: '吃掉棋子',
        result: this.isSuccess() ? STEP_RESULT.SUCCESS : this.isError() ? STEP_RESULT.ERROR : STEP_RESULT.NONE,
      };
    }

    // 场景三：点击在网格上
    Log.d(TAG, '点击在网格上', x, y);
    if (_activeKey.type !== KeyType.NONE) {
      if (!checkMove(_activeKey, keyInfos, x, y)) {
        Log.w(TAG, '无法移动到目标位置', _activeKey, focuskey);
        return {
          changed: [],
          status: STATUS.WARN,
          msg: '出错了，无法移动到目标位置”',
          result: STEP_RESULT.NONE,
        };
      }

      //  移动棋子
      Log.d(TAG, '移动棋子', _activeKey, focuskey);
      const curStep = stepUtils.getStep(_activeKey, keyInfos, x, y);
      nowSteps.push(curStep);

      const idx = keyInfos.findIndex(item => item.hash === _activeKey.hash);
      keyInfos[idx].y = y;
      keyInfos[idx].x = x;

      this.updateKeyInfos(keyInfos, nowSteps);
      return {
        changed: [CHANGE_TYPE.ACTIVEKEY, CHANGE_TYPE.KEYINFO, CHANGE_TYPE.NOWSTEPS],
        status: STATUS.OK,
        msg: '移动棋子',
        result: this.isSuccess() ? STEP_RESULT.SUCCESS : this.isError() ? STEP_RESULT.ERROR : STEP_RESULT.NONE,
      };
    }

    return {
      changed: [],
      status: STATUS.OK,
      msg: '',
      result: STEP_RESULT.NONE,
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
      result: STEP_RESULT.NONE,
    };
  }

  revert() {
    // 棋局记录最少2条才可以回退
    if (this._keyMapFenStrs.length < 2) {
      return {
        changed: [],
        status: STATUS.OK,
        msg: '',
        result: STEP_RESULT.NONE,
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
      result: STEP_RESULT.NONE,
    };
  }

  getHint() {
    const { nowSteps, _expectSteps } = this;
    const idx = nowSteps.length;
    const content = _expectSteps[idx];
    Log.d(TAG, 'hint', idx, content);
    return content;
  }

  updateKeyInfos(keyInfos: Array<KeyInfo>, nowSteps: Array<string>) {
    this.keyInfos = [...keyInfos];
    this._activeKey = EMPTY_KEYINFO;
    this._keyMapFenStrs.push(util.getFenStr(keyInfos));
    this.nowSteps = [...nowSteps];
  }
}

export default Chess;
