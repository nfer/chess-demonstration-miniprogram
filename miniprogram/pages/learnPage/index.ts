import * as util from '../../utils/util';

Page({
  data: {
    stepIdx: 1,
    scale: 1,
    keyInfos: [] as Array<util.KeyInfo>,
  },
  onReady() {
    this.init();
  },
  init() {
    const scale = util.getScale();
    const keyInfos = util.parseFenStr('3kN1b1C/8r/9/3Cr4/9/9/9/9/4p4/5K3 w - - 0 1');
    this.setData({
      scale,
      keyInfos,
    });
    util.drawChessBackground('bgCanvas', this.data.scale);
    util.drawChessKeys('itemCanvas', this.data.scale, this.data.keyInfos);
  },
  // 事件处理函数
  goBack() {
    wx.navigateBack({});
  },
  reload() {
    this.init();
  },
});
