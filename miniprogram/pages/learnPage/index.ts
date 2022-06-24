import { ComponentWithComputed } from 'miniprogram-computed';
import * as util from '../../utils/util';
import Log from '../../utils/log';
import { KeyInfo, KeyType, KeyPos } from '../../interface/index';
import { steps } from '../../data/steps';
import Chess, { CHANGE_TYPE, ChessResult, STATUS } from '../../interface/Chess';

const keyMapFenStr = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';
const BAD_LASTKEY: KeyInfo = { hash: '', key: '', name: '', type: KeyType.NONE, x: 0, y: 0 };
const NONE_KEYPOS: KeyPos = { x: -1, y: -1 };

const TAG = 'LearnPage';

ComponentWithComputed({
  options: {
    pureDataPattern: /^_/, // 指定所有 _ 开头的数据字段为纯数据字段
  },
  data: {
    aspect: 1,
    keyInfos: [] as Array<KeyInfo>,
    nowSteps: [] as Array<string>,
    _activeKey: BAD_LASTKEY, // 当前已经选中的棋子
    _expectSteps: [] as Array<string>,
    _keyMapFenStrs: [] as Array<string>,
    _chess: {} as Chess,
  },
  computed: {
    isError(data): boolean {
      if (data.nowSteps.length === 0) {
        return false;
      }

      return data.nowSteps.some((value, index) => value !== data._expectSteps[index]);
    },
    isSuccess(data): boolean {
      if (data.nowSteps.length === 0) {
        return false;
      }

      return data.nowSteps.length === data._expectSteps.length;
    },
    // 当前的光标
    cursorPos(data): KeyPos {
      if (data._activeKey.type === KeyType.NONE) {
        return NONE_KEYPOS;
      }

      return {
        x: data._activeKey.x,
        y: data._activeKey.y,
      };
    },
  },
  methods: {
    onLoad(query: Record<string, string | undefined>) {
      // UI设置相关
      const name = query.name || '象棋打谱';
      wx.setNavigationBarTitle({
        title: name,
      });
      const info = util.getBaseInfo();
      this.setData({
        aspect: info.canvasAspect,
      });

      // 棋面记录
      this.setData({
        _keyMapFenStrs: [keyMapFenStr],
      });

      // 正确棋谱
      const id = Number(query.id) || 10001;
      const step = steps.find(item => item.id === id) || { id: -1, data: [] as Array<string> };
      this.setData({
        _expectSteps: step.data,
      });

      const chess = new Chess();
      chess.init(keyMapFenStr);
      this.setData({
        _chess: chess,
      });
      this.reload();
    },
    // 按钮事件：悔棋
    revert() {
      // 棋局记录最少2条才可以回退
      if (this.data._keyMapFenStrs.length < 2) {
        return;
      }

      // 去除最后一条棋局记录
      this.data._keyMapFenStrs.pop();
      this.setData({
        _keyMapFenStrs: this.data._keyMapFenStrs,
      });

      // 去除最后一条棋谱记录
      this.data.nowSteps.pop();
      this.setData({
        nowSteps: this.data.nowSteps,
      });

      // 取回退后的最后一条棋局进行重新渲染
      const fenStr = this.data._keyMapFenStrs[this.data._keyMapFenStrs.length - 1];
      const keyInfos = util.parseFenStr(fenStr);
      this.setData({
        keyInfos,
      });

      // 重置当前已经选中的棋子
      this.setData({
        _activeKey: BAD_LASTKEY,
      });
    },
    // 按钮事件：提示
    hint() {
      const { nowSteps, _expectSteps: expectSteps } = this.data;
      const idx = nowSteps.length;
      const content = expectSteps[idx];
      Log.d(TAG, 'hint', idx, content);
      wx.showModal({
        title: '提示',
        content: content,
        showCancel: false,
      });
    },
    // 按钮事件：重来
    reload() {
      const result = this.data._chess.reload();
      this.handleChessResult(this.data._chess, result);
    },
    // 棋子点击事件
    onChessClick(e: any) {
      const { isSuccess, isError, _chess } = this.data;
      // 出错时不再响应棋盘交互
      if (isError) {
        Log.w(TAG, '出错时不再响应棋盘交互');
        return;
      }

      // 打谱成功时不再响应棋盘交互
      if (isSuccess) {
        Log.w(TAG, '打谱成功时不再响应棋盘交互');
        return;
      }

      const { posX, posY } = e.detail as any;

      const result = _chess.click(posX, posY);
      Log.d(TAG, '_chess.click', result);
      this.handleChessResult(_chess, result);
    },

    handleChessResult(_chess: Chess, result: ChessResult) {
      // WARN级别只做日志打印，后续可以使用声音提示
      if (result.status === STATUS.WARN) {
        Log.w(TAG, result.msg);
        return;
      }

      // ERROR级别使用Toast提示用户
      if (result.status === STATUS.ERROR) {
        Log.e(TAG, result.msg);
        wx.showToast({
          title: result.msg,
          icon: 'error',
          duration: 2000,
        });
        return;
      }

      // 没有改变则直接返回
      if (result.changed.length === 0) {
        Log.d(TAG, '没有改变');
        return;
      }

      // 当前棋子改变
      if (result.changed.includes(CHANGE_TYPE.ACTIVEKEY)) {
        this.setData({
          _activeKey: _chess._activeKey,
        });
      }

      // 棋谱改变
      if (result.changed.includes(CHANGE_TYPE.NOWSTEPS)) {
        this.setData({
          nowSteps: [..._chess.nowSteps],
        });
      }

      // 棋局改变
      if (result.changed.includes(CHANGE_TYPE.KEYINFO)) {
        this.setData({
          keyInfos: [..._chess.keyInfos],
        });
      }

      if (this.data.isError) {
        wx.showToast({
          title: '出错了！',
          icon: 'error',
          duration: 2000,
        });
        return;
      }

      if (this.data.isSuccess) {
        wx.showToast({
          title: '打谱成功',
          icon: 'success',
          duration: 2000,
        });
      }
    },
  },
});
