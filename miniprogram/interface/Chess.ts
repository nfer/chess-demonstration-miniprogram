import { KeyInfo, KeyType } from './index';
import * as util from '../utils/util';
import * as stepUtils from '../utils/step';
import Log from '../utils/log';
import { checkMove, checkSameCamp, checkSamePos } from '../utils/checkMove';

const TAG = 'ChessClass';
const BAD_LASTKEY: KeyInfo = { hash: '', key: '', name: '', type: KeyType.NONE, x: 0, y: 0 };

class Chess {
  _keyMapFenStrs = [] as Array<string>;

  keyInfos = [] as Array<KeyInfo>;

  nowSteps = [] as Array<string>;

  _activeKey = BAD_LASTKEY; // 当前已经选中的棋子

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
      if (focuskey.type === KeyType.BLACK && nowSteps.length === 0 && !hasActiveKey) {
        throw new Error('出错了，违反规则“执红棋的一方先走”');
      }

      const lastKeyType = nowSteps.length % 2 ? KeyType.RED : KeyType.BLACK;
      if (_activeKey.type === KeyType.NONE && lastKeyType === focuskey.type) {
        throw new Error('出错了，违反规则“双方轮流各走一着”');
      }

      // 1.1 选择棋子
      if (!hasActiveKey) {
        Log.d(TAG, '选择棋子', focuskey);
        this._activeKey = { ...focuskey };
        return;
      }

      // 1.2 取消选择棋子
      if (checkSamePos(_activeKey, focuskey)) {
        Log.d(TAG, '取消选择棋子', focuskey);
        this._activeKey = { ...BAD_LASTKEY };
        return;
      }

      // 1.3 同色棋子，点击后进行焦点更新
      if (checkSameCamp(_activeKey, focuskey)) {
        Log.d(TAG, '同色棋子，点击后进行焦点更新', focuskey);
        this._activeKey = { ...focuskey };
        return;
      }

      if (!checkMove(_activeKey, keyInfos, focuskey.x, focuskey.y)) {
        Log.w(TAG, '无法移动到目标位置', _activeKey, focuskey);
        return;
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
      return;
    }
  }

  updateKeyInfos(keyInfos: Array<KeyInfo>, nowSteps: Array<string>) {
    this.keyInfos = [...keyInfos];
    this._activeKey = BAD_LASTKEY;
    this._keyMapFenStrs.push(util.getFenStr(keyInfos));
    this.nowSteps = [...nowSteps];
  }
}

export default Chess;
