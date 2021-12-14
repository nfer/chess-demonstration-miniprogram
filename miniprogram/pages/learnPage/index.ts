import { START_X, START_Y } from '../../utils/constants';
import * as util from '../../utils/util';
import { KeyInfo } from '../../interface/index';

Page({
  data: {
    stepIdx: 1,
    scale: 1,
    oriKeyInfos: [] as Array<KeyInfo>,
    keyInfos: [] as Array<KeyInfo>,
    lastKey: null as KeyInfo | null,
    bgCtx: {} as any,
    cursorCtx: {} as any,
    itemCtx: {} as any,
  },
  onReady() {
    this.init();
  },
  async init() {
    const scale = util.getScale();
    const oriKeyInfos = util.parseFenStr('3kN1b1C/8r/9/3Cr4/9/9/9/9/4p4/5K3 w - - 0 1');
    this.data.bgCtx = await util.createCursorContext('bgCanvas', scale);
    this.data.cursorCtx = await util.createCursorContext('cursorCanvas', scale);
    this.data.itemCtx = await util.createCursorContext('itemCanvas', scale);
    this.setData({
      scale,
      oriKeyInfos,
    });
    util.drawChessBackground(this.data.bgCtx);
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
    });
    util.drawChessKeys(this.data.itemCtx, this.data.keyInfos);
    util.clearCursor(this.data.cursorCtx);
  },
  selectItem(e: any) {
    const { scale, keyInfos, lastKey } = this.data;
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
      // 1.1 选择棋子
      if (!lastKey) {
        this.setData({ lastKey: key });
        util.drawCursor(this.data.cursorCtx, posX, posY);
        return;
      }

      // 1.2 取消选择棋子
      if (lastKey.x === key.x && lastKey.y === key.y) {
        this.setData({ lastKey: null });
        util.clearCursor(this.data.cursorCtx);
        return;
      }

      if (!util.checkMoveValid(lastKey, key.x, key.y)) {
        console.log('bad posistion for lastKey', lastKey, key.x, key.y);
        return;
      }

      //  1.3 吃掉棋子
      const idx = keyInfos.findIndex(item => item.hash === lastKey.hash);
      keyInfos[idx].y = posY;
      keyInfos[idx].x = posX;
      const newKeyInfos = keyInfos.filter(item => item.hash !== key.hash);
      console.log(newKeyInfos, keyInfos, key, lastKey);
      this.setData({ keyInfos: newKeyInfos, lastKey: null });
      util.drawChessKeys(this.data.itemCtx, keyInfos);
      util.clearCursor(this.data.cursorCtx);
      return;
    }

    // 场景三：点击在网格上
    if (lastKey) {
      if (!util.checkMoveValid(lastKey, posX, posY)) {
        console.log('bad posistion for lastKey', lastKey, posX, posY);
        return;
      }

      const idx = keyInfos.findIndex(item => item.key === lastKey.key);
      keyInfos[idx].y = posY;
      keyInfos[idx].x = posX;
      this.setData({ keyInfos, lastKey: null });
      util.drawChessKeys(this.data.itemCtx, keyInfos);
      util.clearCursor(this.data.cursorCtx);
    }
  },
});
