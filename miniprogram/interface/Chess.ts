import { KeyInfo, KeyType } from './index';
import * as util from '../utils/util';

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
}

export default Chess;
