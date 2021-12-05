Page({
  data: {
  },
  // 事件处理函数
  goToLevelPage() {
    wx.navigateTo({
      url: '../levelPage/index',
    });
  },
  goToLearnlPage() {
    wx.navigateTo({
      url: '../learnPage/index',
    });
  },
});
