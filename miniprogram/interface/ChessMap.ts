import { KeyInfo, KeyPos, KeyType, EMPTY_KEYINFO, STATUS, CHANGE_TYPE, ChessResult } from './index';
import * as util from '../utils/util';
import Log from '../utils/log';
import ChessItem, { getChessItem } from './ChessItem';

const TAG = 'ChessMap';

class ChessMap {
  private keyInfos = [] as Array<KeyInfo>;

  private _activeKey = EMPTY_KEYINFO; // 当前已经选中的棋子

  private activeKeyItem = new ChessItem(EMPTY_KEYINFO);

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

  checkMove(x: number, y: number): boolean {
    // 当前没有已选中棋子时，直接返回成功
    if (!this.hasActiveKey()) {
      return true;
    }

    return this.activeKeyItem.checkMove(x, y, this.keyInfos);
  }

  checkSameCamp(keyInfo1: KeyInfo, keyInfo2: KeyInfo): boolean {
    return keyInfo1.type === keyInfo2.type;
  }

  checkSamePos(keyInfo1: KeyInfo, keyInfo2: KeyInfo): boolean {
    return keyInfo1.x === keyInfo2.x && keyInfo1.y === keyInfo2.y;
  }

  click(x: number, y: number): ChessResult {
    Log.d(TAG, `click at (${x}, ${y})`);

    // 判断是否可以移动到指定位置
    if (!this.checkMove(x, y)) {
      Log.w(TAG, '无法移动到目标位置');
      return {
        changed: [],
        status: STATUS.WARN,
        msg: '出错了，无法移动到目标位置',
      };
    }

    const { keyInfos, hasActiveKey, _activeKey } = this;
    const focuskey = keyInfos.find(item => item.x === x && item.y === y);
    // 场景：点击在棋子上
    if (focuskey) {
      Log.d(TAG, '点击在棋子上', focuskey);

      // 1.1 选择棋子
      if (!hasActiveKey()) {
        Log.d(TAG, '选择棋子', focuskey);
        this._activeKey = { ...focuskey };
        this.activeKeyItem = getChessItem(this._activeKey);
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
        this.activeKeyItem = getChessItem(this._activeKey);
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
        this.activeKeyItem = getChessItem(this._activeKey);
        return {
          changed: [CHANGE_TYPE.ACTIVEKEY],
          status: STATUS.OK,
          msg: '同色棋子，点击后进行焦点更新',
        };
      }

      //  1.4 吃掉棋子
      Log.d(TAG, '吃掉棋子', _activeKey, focuskey);

      const idx = keyInfos.findIndex(item => item.hash === _activeKey.hash);
      keyInfos[idx].x = x;
      keyInfos[idx].y = y;
      const newKeyInfos = keyInfos.filter(item => item.hash !== focuskey.hash);

      this.updateKeyInfos(newKeyInfos);
      return {
        changed: [CHANGE_TYPE.ACTIVEKEY, CHANGE_TYPE.KEYINFO, CHANGE_TYPE.NOWSTEPS],
        status: STATUS.OK,
        msg: '吃掉棋子',
      };
    }

    // 场景：点击在网格上
    Log.d(TAG, '点击在网格上', x, y);
    if (this.hasActiveKey()) {
      //  移动棋子
      Log.d(TAG, '移动棋子', _activeKey, focuskey);

      const idx = keyInfos.findIndex(item => item.hash === _activeKey.hash);
      keyInfos[idx].y = y;
      keyInfos[idx].x = x;

      this.updateKeyInfos(keyInfos);
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

  setFenStr(fenStr: string) {
    this.keyInfos = util.parseFenStr(fenStr);
    this._activeKey = EMPTY_KEYINFO;
    this.activeKeyItem = new ChessItem(EMPTY_KEYINFO);

    return {
      changed: [CHANGE_TYPE.ACTIVEKEY, CHANGE_TYPE.KEYINFO, CHANGE_TYPE.NOWSTEPS],
      status: STATUS.OK,
      msg: '初始化',
    };
  }

  updateKeyInfos(keyInfos: Array<KeyInfo>) {
    this.keyInfos = [...keyInfos];
    this._activeKey = EMPTY_KEYINFO;
    this.activeKeyItem = new ChessItem(EMPTY_KEYINFO);
  }
}

export default ChessMap;
