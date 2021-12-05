import * as constants from '../../utils/constants';
import * as util from '../../utils/util';

Page({
  data: {
    stepIdx: 1,
    scale: 1,
  },
  onReady() {
    this.init();
    util.drawChessBackground('bgCanvas', this.data.scale);
    // this.loadData();
  },
  init() {
    const info = wx.getSystemInfoSync();
    const scale = info.screenWidth / constants.CANVAS_WIDTH;
    this.setData({
      scale,
    });
  },
  // 事件处理函数
  goBack() {
    wx.navigateBack({});
  },
});
