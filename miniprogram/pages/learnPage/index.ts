import { ComponentWithComputed } from 'miniprogram-computed';
import * as util from '../../utils/util';
import Log from '../../utils/log';
import { KeyInfo, EMPTY_KEYPOS, KeyPos } from '../../interface/index';
import { steps } from '../../data/steps';
import Chess, { CHANGE_TYPE, ChessResult, STATUS, STEP_RESULT } from '../../interface/Chess';

const keyMapFenStr = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';

const TAG = 'LearnPage';

ComponentWithComputed({
  options: {
    pureDataPattern: /^_/, // 指定所有 _ 开头的数据字段为纯数据字段
  },
  data: {
    aspect: 1,
    keyInfos: [] as Array<KeyInfo>,
    nowSteps: [] as Array<string>,
    cursorPos: EMPTY_KEYPOS, // 当前光标
    _expectSteps: [] as Array<string>,
    _chess: {} as Chess,
    isError: false,
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

      // 正确棋谱
      const id = Number(query.id) || 10001;
      const step = steps.find(item => item.id === id) || { id: -1, data: [] as Array<string> };

      const chess = new Chess();
      chess.init(keyMapFenStr);
      chess.setExpectSteps(step.data);
      this.setData({
        _chess: chess,
      });
      this.reload();
    },
    // 按钮事件：悔棋
    revert() {
      const result = this.data._chess.revert();
      this.handleChessResult(this.data._chess, result);
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
    onChessClick(e: WechatMiniprogram.CustomEvent) {
      const { _chess } = this.data;
      // 出错时不再响应棋盘交互
      if (_chess.isError()) {
        Log.w(TAG, '出错时不再响应棋盘交互');
        return;
      }

      // 打谱成功时不再响应棋盘交互
      if (_chess.isSuccess()) {
        Log.w(TAG, '打谱成功时不再响应棋盘交互');
        return;
      }

      const { x, y } = e.detail as KeyPos;

      const result = _chess.click(x, y);
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
          cursorPos: _chess.getCursorPos(),
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

      this.setData({
        isError: result.result === STEP_RESULT.ERROR,
      });

      if (result.result === STEP_RESULT.ERROR) {
        wx.showToast({
          title: '出错了！',
          icon: 'error',
          duration: 2000,
        });
        return;
      }

      if (result.result === STEP_RESULT.SUCCESS) {
        wx.showToast({
          title: '打谱成功',
          icon: 'success',
          duration: 2000,
        });
      }
    },
  },
});
