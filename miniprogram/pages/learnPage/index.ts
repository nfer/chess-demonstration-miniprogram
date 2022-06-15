import { ComponentWithComputed } from 'miniprogram-computed';
import * as util from '../../utils/util';
import Log from '../../utils/log';
import * as stepUtils from '../../utils/step';
import { checkMove, checkSameCamp, checkSamePos } from '../../utils/checkMove';
import { KeyInfo, KeyType, KeyPos } from '../../interface/index';
import { steps } from '../../data/steps';

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
    cursorPos: NONE_KEYPOS, // 当前的光标
    nowSteps: [] as Array<string>,
    _activeKey: BAD_LASTKEY, // 当前已经选中的棋子
    _expectSteps: [] as Array<string>,
    _keyMapFenStrs: [] as Array<string>,
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
    hasActiveKey(data): boolean {
      return data._activeKey.type !== KeyType.NONE;
    },
  },
  methods: {
    onLoad(query: Record<string, string | undefined>) {
      const name = query.name || '象棋打谱';
      wx.setNavigationBarTitle({
        title: name,
      });

      const id = Number(query.id) || 10001;
      const step = steps.find(item => item.id === id) || { id: -1, data: [] as Array<string> };
      this.setData({
        _expectSteps: step.data,
      });

      this.init();
    },
    async init() {
      const info = util.getBaseInfo();
      this.setData({
        aspect: info.canvasAspect,
        _keyMapFenStrs: [keyMapFenStr],
      });
      this.reload();
    },
    updateKeyInfos(keyInfos: Array<KeyInfo>, nowSteps: Array<string>) {
      this.setData({
        keyInfos,
        _activeKey: BAD_LASTKEY,
        cursorPos: NONE_KEYPOS,
      });

      this.data._keyMapFenStrs.push(util.getFenStr(keyInfos));
      this.setData({
        _keyMapFenStrs: this.data._keyMapFenStrs,
      });

      this.setData({
        nowSteps,
      });

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

      this.setData({
        cursorPos: NONE_KEYPOS,
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
      this.setData({
        nowSteps: [],
        _keyMapFenStrs: [],
      });
      const keyInfos = util.parseFenStr(keyMapFenStr);
      this.updateKeyInfos(keyInfos, []);
    },
    // 棋子点击事件
    onChessClick(e: any) {
      const { keyInfos, _activeKey, nowSteps, isSuccess, isError, hasActiveKey } = this.data;
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

      const { focuskey, posX, posY } = e.detail as any;
      // 场景二：点击在棋子上
      if (focuskey) {
        Log.d(TAG, '点击在棋子上', focuskey);
        if (focuskey.type === KeyType.BLACK && nowSteps.length === 0 && !hasActiveKey) {
          Log.w(TAG, '出错了，违反规则“执红棋的一方先走”');
          return;
        }

        const lastKeyType = nowSteps.length % 2 ? KeyType.RED : KeyType.BLACK;
        if (_activeKey.type === KeyType.NONE && lastKeyType === focuskey.type) {
          Log.w(TAG, '出错了，违反规则“双方轮流各走一着”');
          return;
        }

        // 1.1 选择棋子
        if (!hasActiveKey) {
          Log.d(TAG, '选择棋子', focuskey);
          this.setData({
            _activeKey: focuskey,
            cursorPos: { x: posX, y: posY },
          });
          return;
        }

        // 1.2 取消选择棋子
        if (checkSamePos(_activeKey, focuskey)) {
          Log.d(TAG, '取消选择棋子', focuskey);
          this.setData({
            _activeKey: BAD_LASTKEY,
            cursorPos: NONE_KEYPOS,
          });
          return;
        }

        // 1.3 同色棋子，点击后进行焦点更新
        if (checkSameCamp(_activeKey, focuskey)) {
          Log.d(TAG, '同色棋子，点击后进行焦点更新', focuskey);
          this.setData({
            _activeKey: focuskey,
            cursorPos: { x: posX, y: posY },
          });
          return;
        }

        if (!checkMove(_activeKey, keyInfos, focuskey.x, focuskey.y)) {
          Log.w(TAG, '无法移动到目标位置', _activeKey, focuskey);
          return;
        }

        //  1.4 吃掉棋子
        Log.d(TAG, '吃掉棋子', _activeKey, focuskey);
        const curStep = stepUtils.getStep(_activeKey, keyInfos, posX, posY);
        nowSteps.push(curStep);

        const idx = keyInfos.findIndex(item => item.hash === _activeKey.hash);
        keyInfos[idx].y = posY;
        keyInfos[idx].x = posX;
        const newKeyInfos = keyInfos.filter(item => item.hash !== focuskey.hash);

        this.updateKeyInfos(newKeyInfos, nowSteps);
        return;
      }

      // 场景三：点击在网格上
      Log.d(TAG, '点击在网格上', posX, posY);
      if (_activeKey.type !== KeyType.NONE) {
        if (!checkMove(_activeKey, keyInfos, posX, posY)) {
          Log.w(TAG, 'bad posistion for _activeKey', _activeKey, posX, posY);
          return;
        }

        const curStep = stepUtils.getStep(_activeKey, keyInfos, posX, posY);
        nowSteps.push(curStep);

        const idx = keyInfos.findIndex(item => item.hash === _activeKey.hash);
        keyInfos[idx].y = posY;
        keyInfos[idx].x = posX;

        this.updateKeyInfos(keyInfos, nowSteps);
      }
    },
  },
});
