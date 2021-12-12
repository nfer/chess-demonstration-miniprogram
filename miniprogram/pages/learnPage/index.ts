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
    const keyInfos = util.parseFenStr('3kN1b1C/8r/9/3Cr4/9/9/9/9/4p4/5K3 w - - 0 1');
    const oriKeyInfos = keyInfos.map(item => ({...item}));
    this.setData({
      scale,
      oriKeyInfos,
      keyInfos,
    });
    util.drawChessBackground('bgCanvas', this.data.scale);
    util.drawChessKeys('itemCanvas', this.data.scale, this.data.oriKeyInfos);
  },
  // 事件处理函数
  goBack() {
    wx.navigateBack({});
  },
  reload() {
    util.drawChessKeys('itemCanvas', this.data.scale, this.data.oriKeyInfos);
  },
  selectItem(e: any) {
    const { scale, keyInfos, lastKey } = this.data;
    const offsetX = Math.floor(e.detail.x / scale) - START_X;
    const offsetY = Math.floor(e.detail.y / scale) - START_Y;
    const posX = Math.round(offsetX / 100);
    const posY = Math.round(offsetY / 100);

    const key = keyInfos.find(item => item.x === posX && item.y === posY);
    if (key) {
      console.log('click on key', key);
      util.drawCursor('cursorCanvas', scale, posX, posY);
      this.setData({ lastKey: key });
    } else if (lastKey) {
      const idx = keyInfos.findIndex(item => item.key === lastKey.key);
      keyInfos[idx].y = posY;
      keyInfos[idx].x = posX;
      this.setData({ keyInfos, lastKey: null });
      util.drawChessKeys('itemCanvas', scale, keyInfos);
      util.clearCursor('cursorCanvas', scale);
    }
  },
});
