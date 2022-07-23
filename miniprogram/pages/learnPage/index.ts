import * as util from '../../utils/util';
import Log from '../../utils/log';
import { KeyInfo, EMPTY_KEYPOS, KeyPos, StepInfo, CHANGE_TYPE, ChessResult, STATUS, DEMONSTRATION_RESULT } from '../../interface/index';
import { steps } from '../../data/steps';
import Chess from '../../interface/Chess';

const keyMapFenStr = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';

const TAG = 'LearnPage';

const audioCtx = wx.createInnerAudioContext();

Component({
  options: {
    pureDataPattern: /^_/, // 指定所有 _ 开头的数据字段为纯数据字段
  },
  data: {
    aspect: 1,
    chapterId: 0,
    keyInfos: [] as Array<KeyInfo>,
    nowSteps: [] as Array<StepInfo>,
    cursorPos: EMPTY_KEYPOS, // 当前光标
    _chess: {} as Chess,
    loadDialogShow: false,
  },
  methods: {
    onLoad(query: Record<string, string | undefined>) {
      Log.d(TAG, `onLoad:${JSON.stringify(query)}`);
      // UI设置相关
      const chapterName = wx.getStorageSync('chapterName');
      if (chapterName) {
        wx.setNavigationBarTitle({
          title: chapterName,
        });
      }
      const info = util.getBaseInfo();
      this.setData({
        aspect: info.canvasAspect,
      });

      const chess = new Chess();
      chess.init(keyMapFenStr);
      this.setData({
        _chess: chess,
      }, () => {
        // 确保设置 _chess 成功后再调用 reload
        this.reload();
      });

      // 正确棋谱
      const chapterId = wx.getStorageSync('chapterId');
      const step = steps.find(item => item.id === Number(chapterId)) || { id: -1, data: [] as Array<string> };
      if (step.data.length) {
        chess.setExpectSteps(step.data);
      } else {
        wx.showToast({
          title: '未加载棋谱，当前为自由模式。',
          icon: 'none',
          duration: 2000,
        });
      }
    },
    // 按钮事件：悔棋
    revert() {
      const result = this.data._chess.revert();
      this.handleChessResult(this.data._chess, result);
    },
    // 按钮事件：提示
    hint() {
      const result = this.data._chess.getHint();
      this.handleChessResult(this.data._chess, result);
    },
    // 按钮事件：重来
    reload() {
      const result = this.data._chess.reload();
      Log.d(TAG, 'reload result', result);
      this.handleChessResult(this.data._chess, result);
    },
    // 按钮事件：载入
    load() {
      Log.d(TAG, 'load');
      this.setData({
        loadDialogShow: true,
      });
    },
    // 用户点击载入-更多界面 关闭 按钮
    onLoadDialogClosed(event: WechatMiniprogram.BaseEvent) {
      Log.d(TAG, `onLoadDialogClosed:${JSON.stringify(event)}`);
      this.setData({
        loadDialogShow: false,
      });
    },
    // 用户选择棋谱
    onSelectChapter(e: WechatMiniprogram.TouchEvent) {
      this.setData({
        loadDialogShow: false,
      });
      Log.d(TAG, `onSelectChapter:${JSON.stringify(e)}`);
      const { chapterId, chapterName } = e.detail;
      Log.d(TAG, `onSelectChapter: ${chapterId}`, chapterName);

      wx.setStorageSync('chapterId', chapterId);
      wx.setStorageSync('chapterName', chapterName);

      this.setData({
        chapterId,
      });

      // 设置标题
      wx.setNavigationBarTitle({
        title: chapterName,
      });

      // 重新加载棋谱
      const step = steps.find(item => item.id === chapterId) || { id: -1, data: [] as Array<string> };
      this.data._chess.setExpectSteps(step.data);
      this.reload();
    },
    // 棋子点击事件
    onChessClick(e: WechatMiniprogram.CustomEvent) {
      const { x, y } = e.detail as KeyPos;

      const result = this.data._chess.click(x, y);
      Log.d(TAG, 'click result', result);
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
          cursorPos: result.cursorPos,
        });
      }

      // 棋局改变
      if (result.changed.includes(CHANGE_TYPE.KEYINFO)) {
        Log.d(TAG, '棋局改变', result.keyInfos, result.nowSteps);
        this.setData({
          keyInfos: result.keyInfos,
          nowSteps: result.nowSteps || [],
        });
      }

      if (result.result === DEMONSTRATION_RESULT.ERROR) {
        audioCtx.src = 'pages/learnPage/warn.mp3';
        audioCtx.play();
        wx.showToast({
          title: '出错了！',
          icon: 'error',
          duration: 2000,
        });
        return;
      }

      if (result.result === DEMONSTRATION_RESULT.SUCCESS) {
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
