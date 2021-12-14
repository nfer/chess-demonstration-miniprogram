import { START_X, START_Y } from '../../utils/constants';
import * as util from '../../utils/util';
import { KeyInfo } from '../../interface/index'

Page({
  data: {
    stepIdx: 1,
    scale: 1,
    oriKeyInfos: [] as Array<KeyInfo>,
    keyInfos: [] as Array<KeyInfo>,
    lastKey: null as KeyInfo|null,
  },
  onReady() {
    this.init();
  },
  init() {
    const scale = util.getScale();
    const oriKeyInfos = util.parseFenStr('3kN1b1C/8r/9/3Cr4/9/9/9/9/4p4/5K3 w - - 0 1');
    this.setData({
      scale,
      oriKeyInfos,
    });
    util.drawChessBackground('bgCanvas', this.data.scale);
    this.reload();
  },
  // 事件处理函数
  goBack() {
    wx.navigateBack({});
  },
  reload() {
    const keyInfos = this.data.oriKeyInfos.map(item => ({...item}));
    this.setData({
      keyInfos,
      lastKey: null,
    });
    util.drawChessKeys('itemCanvas', this.data.scale, this.data.keyInfos);
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
        util.drawCursor('cursorCanvas', scale, posX, posY);
        return;
      }

      // 1.2 取消选择棋子
      if (lastKey.x === key.x && lastKey.y === key.y) {
        this.setData({ lastKey: null });
        util.clearCursor('cursorCanvas', scale);
        return
      }

      //  1.3 吃掉棋子
      const idx = keyInfos.findIndex(item => item.hash === lastKey.hash);
      keyInfos[idx].y = posY;
      keyInfos[idx].x = posX;
      const newKeyInfos = keyInfos.filter(item => item.hash !== key.hash);
      console.log(newKeyInfos, keyInfos, key, lastKey);
      this.setData({ keyInfos: newKeyInfos, lastKey: null });
      util.drawChessKeys('itemCanvas', scale, keyInfos);
      util.clearCursor('cursorCanvas', scale);
      return;
    }

    // 场景三：点击在网格上
    if (lastKey) {
      const idx = keyInfos.findIndex(item => item.key === lastKey.key);
      keyInfos[idx].y = posY;
      keyInfos[idx].x = posX;
      this.setData({ keyInfos, lastKey: null });
      util.drawChessKeys('itemCanvas', scale, keyInfos);
      util.clearCursor('cursorCanvas', scale);
    }
  },
});
