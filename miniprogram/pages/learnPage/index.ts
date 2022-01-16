import { START_X, START_Y } from '../../utils/constants';
import * as util from '../../utils/util';
import * as step from '../../utils/step';
import { checkMove, checkSameCamp } from '../../utils/checkMove';
import { KeyInfo } from '../../interface/index';

const keyMapFenStr = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1'

Page({
  data: {
    stepIdx: 1,
    scale: 1,
    oriKeyInfos: [] as Array<KeyInfo>,
    keyInfos: [] as Array<KeyInfo>,
    lastKey: null as KeyInfo | null,
    lastMoveType: -1,
    steps: [] as Array<Array<string>>,
  },
  onReady() {
    this.init();
  },
  async init() {
    const scale = util.getScale();
    const oriKeyInfos = util.parseFenStr(keyMapFenStr);
    this.setData({
      scale,
      oriKeyInfos,
    });
    util.drawChessBackground('bgCanvas');
    this.reload();
  },
  // 事件处理函数
  goBack() {
    wx.navigateBack({});
  },
  reload() {
    const keyInfos = this.data.oriKeyInfos.map(item => ({ ...item }));
    this.setData({
      keyInfos,
      lastKey: null,
      lastMoveType: -1,
    });
    util.drawChessKeys('itemCanvas', this.data.keyInfos);
    util.clearCursor('cursorCanvas');
  },
  selectItem(e: any) {
    const { scale, keyInfos, lastKey, lastMoveType } = this.data;
    const offsetX = Math.floor(e.detail.x / scale) - START_X;
    const offsetY = Math.floor(e.detail.y / scale) - START_Y;
    const posX = Math.round(offsetX / 100);
    const posY = Math.round(offsetY / 100);

    // 场景一：点击在空白处
    if (Math.abs(offsetX - posX * 100) > 30 || Math.abs(offsetY - posY * 100) > 30) {
      return;
    }

    const key = keyInfos.find(item => item.x === posX && item.y === posY);

    // 场景二：点击在棋子上
    if (key) {
      if (!lastKey && lastMoveType === key.type) {
        console.warn('bad move type', lastMoveType, key.type);
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
      const lastStep = this.data.steps[this.data.steps.length - 1];
      if (!lastStep || lastStep.length == 2) {
        this.data.steps.push([curStep]);
      } else {
        lastStep.push(curStep);
      }
      console.log(step.getStep(lastKey, keyInfos, posX, posY));

      const idx = keyInfos.findIndex(item => item.hash === lastKey.hash);
      keyInfos[idx].y = posY;
      keyInfos[idx].x = posX;
      const newKeyInfos = keyInfos.filter(item => item.hash !== key.hash);
      this.setData({ keyInfos: newKeyInfos, lastKey: null, lastMoveType: lastKey.type, steps: this.data.steps });
      util.drawChessKeys('itemCanvas', newKeyInfos);
      util.clearCursor('cursorCanvas');
      return;
    }

    // 场景三：点击在网格上
    if (lastKey) {
      if (!checkMove(lastKey, keyInfos, posX, posY)) {
        console.warn('bad posistion for lastKey', lastKey, posX, posY);
        return;
      }

      const curStep = step.getStep(lastKey, keyInfos, posX, posY);
      const lastStep = this.data.steps[this.data.steps.length - 1];
      if (!lastStep || lastStep.length == 2) {
        this.data.steps.push([curStep]);
      } else {
        lastStep.push(curStep);
      }
      console.log(step.getStep(lastKey, keyInfos, posX, posY));

      const idx = keyInfos.findIndex(item => item.hash === lastKey.hash);
      keyInfos[idx].y = posY;
      keyInfos[idx].x = posX;
      this.setData({ keyInfos, lastKey: null, lastMoveType: lastKey.type, steps: this.data.steps });
      util.drawChessKeys('itemCanvas', keyInfos);
      util.clearCursor('cursorCanvas');
    }
  },
});
