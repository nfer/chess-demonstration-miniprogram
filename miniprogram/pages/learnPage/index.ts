import * as util from '../../utils/util';
import Log from '../../utils/log';
import { KeyInfo, EMPTY_KEYPOS, KeyPos, StepInfo } from '../../interface/index';
import { steps } from '../../data/steps';
import Chess, { CHANGE_TYPE, ChessResult, STATUS } from '../../interface/Chess';

const keyMapFenStr = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';

const TAG = 'LearnPage';

const audioCtx = wx.createInnerAudioContext();

Component({
  options: {
    pureDataPattern: /^_/, // 指定所有 _ 开头的数据字段为纯数据字段
  },
  data: {
    aspect: 1,
    keyInfos: [] as Array<KeyInfo>,
    nowSteps: [] as Array<StepInfo>,
    cursorPos: EMPTY_KEYPOS, // 当前光标
    _chess: {} as Chess,
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
      const hint = this.data._chess.getHint();
      Log.d(TAG, 'hint', hint);
      wx.showModal({
        title: '提示',
        content: hint,
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
      const { x, y } = e.detail as KeyPos;

      const result = this.data._chess.click(x, y);
      this.handleChessResult(this.data._chess, result);
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

      if (_chess.isError()) {
        audioCtx.src = 'pages/learnPage/warn.mp3';
        audioCtx.play();
        wx.showToast({
          title: '出错了！',
          icon: 'error',
          duration: 2000,
        });
        return;
      }

      if (_chess.isSuccess()) {
        audioCtx.src = 'pages/learnPage/success.mp3';
        audioCtx.play();
        wx.showToast({
          title: '打谱成功',
          icon: 'success',
          duration: 2000,
        });
      }
    },
  },
});
