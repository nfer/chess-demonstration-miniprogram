import { ComponentWithComputed } from 'miniprogram-computed';
import * as util from '../../utils/util';
import * as stepUtils from '../../utils/step';
import { checkMove, checkSameCamp, checkSamePos } from '../../utils/checkMove';
import { KeyInfo, KeyType, KeyPos } from '../../interface/index';
import { steps } from '../../data/steps';

const keyMapFenStr = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';
const BAD_LASTKEY: KeyInfo = { hash: '', key: '', name: '', type: KeyType.NONE, x: 0, y: 0 };
const NONE_KEYPOS: KeyPos = { x: -1, y: -1 };

ComponentWithComputed({
  data: {
    aspect: 1,
    keyInfos: [] as Array<KeyInfo>,
    activeKey: BAD_LASTKEY, // 当前已经选中的棋子
    cursorPos: NONE_KEYPOS, // 当前的光标
    nowSteps: [] as Array<string>,
    expectSteps: [] as Array<string>,
    keyMapFenStrs: [] as Array<string>,
  },
  computed: {
    isError(data): boolean {
      if (data.nowSteps.length === 0) {
        return false;
      }

      return data.nowSteps.some((value, index) => value !== data.expectSteps[index]);
    },
    isSuccess(data): boolean {
      if (data.nowSteps.length === 0) {
        return false;
      }

      return data.nowSteps.length === data.expectSteps.length;
    },
    hasActiveKey(data): boolean {
      return data.activeKey.type !== KeyType.NONE;
    },
  },
  methods: {
    onLoad(query: Record<string, string | undefined>) {
      const id = Number(query.id) || 10001;
      const step = steps.find(item => item.id === id) || { id: -1, data: [] as Array<string> };
      this.setData({
        expectSteps: step.data,
      });

      this.init();
    },
    async init() {
      const info = util.getBaseInfo();
      this.setData({
        aspect: info.canvasAspect,
        keyMapFenStrs: [keyMapFenStr],
      });
      this.reload();
    },
    updateKeyInfos(keyInfos: Array<KeyInfo>, nowSteps: Array<string>) {
      this.setData({
        keyInfos,
        activeKey: BAD_LASTKEY,
        cursorPos: NONE_KEYPOS,
      });
      // util.drawChessKeys('itemCanvas', keyInfos);

      this.data.keyMapFenStrs.push(util.getFenStr(keyInfos));
      this.setData({
        keyMapFenStrs: this.data.keyMapFenStrs,
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
    // 事件处理函数
    revert() {
      // 棋局记录最少2条才可以回退
      if (this.data.keyMapFenStrs.length < 2) {
        return;
      }

      // 去除最后一条棋局记录
      this.data.keyMapFenStrs.pop();
      this.setData({
        keyMapFenStrs: this.data.keyMapFenStrs,
      });

      // 去除最后一条棋谱记录
      this.data.nowSteps.pop();
      this.setData({
        nowSteps: this.data.nowSteps,
      });

      // 取回退后的最后一条棋局进行重新渲染
      const fenStr = this.data.keyMapFenStrs[this.data.keyMapFenStrs.length - 1];
      const keyInfos = util.parseFenStr(fenStr);
      this.setData({
        keyInfos,
      });

      // util.drawChessKeys('itemCanvas', keyInfos);
      this.setData({
        cursorPos: NONE_KEYPOS,
      });
    },
    reload() {
      this.setData({
        nowSteps: [],
        keyMapFenStrs: [],
      });
      const keyInfos = util.parseFenStr(keyMapFenStr);
      this.updateKeyInfos(keyInfos, []);
    },
    selectItem(e: any) {
      const { keyInfos, activeKey, nowSteps, isSuccess, isError, hasActiveKey } = this.data;
      // 出错时不再响应棋盘交互
      if (isError) {
        console.warn('出错时不再响应棋盘交互');
        return;
      }

      // 打谱成功时不再响应棋盘交互
      if (isSuccess) {
        console.warn('打谱成功时不再响应棋盘交互');
        return;
      }

      const { focuskey, posX, posY } = e.detail as any;
      // 场景二：点击在棋子上
      if (focuskey) {
        console.debug('点击在棋子上', focuskey);
        if (focuskey.type === KeyType.BLACK && nowSteps.length === 0 && !hasActiveKey) {
          console.warn('出错了，违反规则“执红棋的一方先走”');
          return;
        }

        const lastKeyType = nowSteps.length % 2 ? KeyType.RED : KeyType.BLACK;
        if (activeKey.type === KeyType.NONE && lastKeyType === focuskey.type) {
          console.warn('出错了，违反规则“双方轮流各走一着”');
          return;
        }

        // 1.1 选择棋子
        if (!hasActiveKey) {
          console.debug('选择棋子', focuskey);
          this.setData({
            activeKey: focuskey,
            cursorPos: { x: posX, y: posY },
          });
          return;
        }

        // 1.2 取消选择棋子
        if (checkSamePos(activeKey, focuskey)) {
          console.debug('取消选择棋子', focuskey);
          this.setData({
            activeKey: BAD_LASTKEY,
            cursorPos: NONE_KEYPOS,
          });
          return;
        }

        // 1.3 同色棋子，点击后进行焦点更新
        if (checkSameCamp(activeKey, focuskey)) {
          console.debug('同色棋子，点击后进行焦点更新', focuskey);
          this.setData({
            activeKey: focuskey,
            cursorPos: { x: posX, y: posY },
          });
          return;
        }

        if (!checkMove(activeKey, keyInfos, focuskey.x, focuskey.y)) {
          console.warn('无法移动到目标位置', activeKey, focuskey);
          return;
        }

        //  1.4 吃掉棋子
        console.debug('吃掉棋子', activeKey, focuskey);
        const curStep = stepUtils.getStep(activeKey, keyInfos, posX, posY);
        nowSteps.push(curStep);

        const idx = keyInfos.findIndex(item => item.hash === activeKey.hash);
        keyInfos[idx].y = posY;
        keyInfos[idx].x = posX;
        const newKeyInfos = keyInfos.filter(item => item.hash !== focuskey.hash);

        this.updateKeyInfos(newKeyInfos, nowSteps);
        return;
      }

      // 场景三：点击在网格上
      console.debug('点击在网格上', posX, posY);
      if (activeKey.type !== KeyType.NONE) {
        if (!checkMove(activeKey, keyInfos, posX, posY)) {
          console.warn('bad posistion for activeKey', activeKey, posX, posY);
          return;
        }

        const curStep = stepUtils.getStep(activeKey, keyInfos, posX, posY);
        nowSteps.push(curStep);

        const idx = keyInfos.findIndex(item => item.hash === activeKey.hash);
        keyInfos[idx].y = posY;
        keyInfos[idx].x = posX;

        this.updateKeyInfos(keyInfos, nowSteps);
      }
    },
  },
});
