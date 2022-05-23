import { CANVAS_MARGIN } from '../../utils/constants';
import * as util from '../../utils/util';
import * as step from '../../utils/step';
import { checkMove, checkSameCamp } from '../../utils/checkMove';
import { KeyInfo, KeyType } from '../../interface/index';
import { steps } from '../../data/steps';

const keyMapFenStr = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1'
const MIN_ASPECT_SHOW_STEPS = 1.9;

Page({
  data: {
    stepIdx: 1,
    scale: 1,
    showSteps: false,
    oriKeyInfos: [] as Array<KeyInfo>,
    keyInfos: [] as Array<KeyInfo>,
    lastKey: null as KeyInfo | null,
    lastMoveType: KeyType.NONE,
    nowSteps: [] as Array<string>,
    expectSteps: [] as Array<string>,
    errorIndex: -1,
    success: false,
    keyMapFenStrs: [] as Array<string>,
  },
  onLoad(query: Record<string, string | undefined>) {
    const id = Number(query.id) || 10001;
    const step = steps.find(item => item.id === id) || {id: -1, data: [] as Array<string>};
    this.setData({
      expectSteps: step.data,
    });
    
    this.init();
  },
  async init() {
    const aspect = util.getAspect();
    const scale = util.getScale();
    const oriKeyInfos = util.parseFenStr(keyMapFenStr);
    this.setData({
      showSteps: aspect > MIN_ASPECT_SHOW_STEPS,
      scale,
      oriKeyInfos,
      keyMapFenStrs: [keyMapFenStr],
    });
    util.drawChessBackground('bgCanvas');
    this.reload();
  },
  updateStepAndCheck(curStep: string) {
    const curIndex = this.data.nowSteps.length;
    const expectStep = this.data.expectSteps[curIndex];
    const errorIndex = curStep === expectStep ? -1 : curIndex;
    console.log(curStep, curIndex, expectStep, errorIndex);
    this.data.nowSteps.push(curStep);
    this.setData({
      errorIndex,
      nowSteps: this.data.nowSteps, // 数组变化强制更新
    });

    if (errorIndex !== -1) {
      wx.showToast({
        title: '出错了！',
        icon: 'error',
        duration: 2000
      })
      return;
    }

    if (this.data.nowSteps.length === this.data.expectSteps.length) {
      wx.showToast({
        title: '打谱成功',
        icon: 'success',
        duration: 2000
      })
      this.setData({
        success: true,
      });
    }
  },
  updateKeyInfos(keyInfos: Array<KeyInfo>) {
    util.drawChessKeys('itemCanvas', keyInfos);
    util.clearCursor('cursorCanvas');

    this.data.keyMapFenStrs.push(util.getFenStr(keyInfos));
    this.setData({
      keyMapFenStrs: this.data.keyMapFenStrs,
    })
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
    })

    // 取回退后的最后一条棋局进行重新渲染
    const fenStr = this.data.keyMapFenStrs[this.data.keyMapFenStrs.length - 1];
    const keyInfos = util.parseFenStr(fenStr);
    util.drawChessKeys('itemCanvas', keyInfos);
    util.clearCursor('cursorCanvas');

    // 去除最后一条棋谱记录
    this.data.nowSteps.pop();
    this.setData({
      nowSteps: this.data.nowSteps,
    })
  },
  reload() {
    const keyInfos = this.data.oriKeyInfos.map(item => ({ ...item }));
    this.setData({
      keyInfos,
      lastKey: null,
      lastMoveType: KeyType.NONE,
      nowSteps: [],
      errorIndex: -1,
      success: false,
      keyMapFenStrs: [],
    });
    this.updateKeyInfos(keyInfos);
  },
  selectItem(e: any) {
    if (this.data.success || this.data.errorIndex !== -1) {
      return;
    }

    const { scale, keyInfos, lastKey, lastMoveType } = this.data;
    const offsetX = Math.floor(e.detail.x / scale) - CANVAS_MARGIN;
    const offsetY = Math.floor(e.detail.y / scale) - CANVAS_MARGIN;
    const posX = Math.round(offsetX / 100);
    const posY = Math.round(offsetY / 100);

    // 场景一：点击在空白处
    if (Math.abs(offsetX - posX * 100) > 30 || Math.abs(offsetY - posY * 100) > 30) {
      return;
    }

    const key = keyInfos.find(item => item.x === posX && item.y === posY);

    // 场景二：点击在棋子上
    if (key) {
      if (key.type === KeyType.BLACK && this.data.nowSteps.length === 0 && !lastKey) {
        console.warn('出错了，违反规则“执红棋的一方先走”', key, lastKey);
        return;
      }

      if (!lastKey && lastMoveType === key.type) {
        console.warn('出错了，违反规则“双方轮流各走一着”', lastMoveType, key.type);
        return;
      }

      // 1.1 选择棋子
      if (!lastKey) {
        this.setData({ lastKey: key });
        util.drawCursor('cursorCanvas', posX, posY);
        return;
      }

      // 1.2 取消选择棋子
      if (lastKey.x === key.x && lastKey.y === key.y) {
        this.setData({ lastKey: null });
        util.clearCursor('cursorCanvas');
        return;
      }

      // 1.3 同色棋子，点击后进行焦点更新
      if (checkSameCamp(lastKey, key)) {
        this.setData({ lastKey: key });
        util.drawCursor('cursorCanvas', posX, posY);
        return;
      }

      if (!checkMove(lastKey, keyInfos, key.x, key.y)) {
        console.warn('bad posistion for lastKey', lastKey, key.x, key.y);
        return;
      }

      //  1.4 吃掉棋子
      const curStep = step.getStep(lastKey, keyInfos, posX, posY);
      this.updateStepAndCheck(curStep);

      const idx = keyInfos.findIndex(item => item.hash === lastKey.hash);
      keyInfos[idx].y = posY;
      keyInfos[idx].x = posX;
      const newKeyInfos = keyInfos.filter(item => item.hash !== key.hash);
      this.setData({
        keyInfos: newKeyInfos,
        lastKey: null,
        lastMoveType: lastKey.type,
      });

      this.updateKeyInfos(newKeyInfos);
      return;
    }

    // 场景三：点击在网格上
    if (lastKey) {
      if (!checkMove(lastKey, keyInfos, posX, posY)) {
        console.warn('bad posistion for lastKey', lastKey, posX, posY);
        return;
      }

      const curStep = step.getStep(lastKey, keyInfos, posX, posY);
      this.updateStepAndCheck(curStep);

      const idx = keyInfos.findIndex(item => item.hash === lastKey.hash);
      keyInfos[idx].y = posY;
      keyInfos[idx].x = posX;
      this.setData({
        keyInfos,
        lastKey: null,
        lastMoveType: lastKey.type,
      });

      this.updateKeyInfos(keyInfos);
    }
  },
});
