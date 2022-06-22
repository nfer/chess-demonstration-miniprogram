import { KeyInfo, KeyType } from './index';
import * as util from '../utils/util';
import * as stepUtils from '../utils/step';
import Log from '../utils/log';
import { checkMove, checkSameCamp, checkSamePos } from '../utils/checkMove';

const TAG = 'ChessClass';
const BAD_LASTKEY: KeyInfo = { hash: '', key: '', name: '', type: KeyType.NONE, x: 0, y: 0 };
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

class Chess {
  _keyMapFenStrs = [] as Array<string>;

  keyInfos = [] as Array<KeyInfo>;

  nowSteps = [] as Array<string>;

  _activeKey = BAD_LASTKEY; // 当前已经选中的棋子

  constructor() {
    this.init = this.init.bind(this);
    this.hasActiveKey = this.hasActiveKey.bind(this);
    this.click = this.click.bind(this);
    this.updateKeyInfos = this.updateKeyInfos.bind(this);
  }

  init(keyMapFenStr = '') {
    let str = keyMapFenStr;
    if (!str) {
      str = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR';
    }

    this._keyMapFenStrs.push(str);
    this.keyInfos = util.parseFenStr(str);
    this.nowSteps = [];
    this._activeKey = BAD_LASTKEY;
  }

  // helper
  hasActiveKey(): boolean {
    return this._activeKey.type !== KeyType.NONE;
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
      if (checkSamePos(_activeKey, focuskey)) {
        Log.d(TAG, '取消选择棋子', focuskey);
        this._activeKey = { ...BAD_LASTKEY };
        return {
          changed: [CHANGE_TYPE.ACTIVEKEY],
          status: STATUS.OK,
          msg: '取消选择棋子',
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
        };
      }

      if (!checkMove(_activeKey, keyInfos, focuskey.x, focuskey.y)) {
        Log.w(TAG, '无法移动到目标位置', _activeKey, focuskey);
        return {
          changed: [],
          status: STATUS.WARN,
          msg: '出错了，无法移动到目标位置”',
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
      };
    }

    return {
      changed: [],
      status: STATUS.OK,
      msg: '',
    };
  }

  updateKeyInfos(keyInfos: Array<KeyInfo>, nowSteps: Array<string>) {
    this.keyInfos = [...keyInfos];
    this._activeKey = BAD_LASTKEY;
    this._keyMapFenStrs.push(util.getFenStr(keyInfos));
    this.nowSteps = [...nowSteps];
  }
}

export default Chess;
