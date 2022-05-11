Page({
  data: {
    currBook: '',
    books: [
      { name: '自出洞来无敌手' },
      { name: '梅花谱' },
      { name: '反梅花谱' },
      { name: '适情雅趣' },
      { name: '自出洞来无敌手' },
      { name: '梅花谱' },
      { name: '反梅花谱' },
      { name: '适情雅趣' },
      { name: '自出洞来无敌手' },
      { name: '梅花谱' },
      { name: '反梅花谱' },
      { name: '适情雅趣' },
      { name: '自出洞来无敌手' },
      { name: '梅花谱' },
      { name: '反梅花谱' },
      { name: '适情雅趣' },
      { name: '自出洞来无敌手' },
      { name: '梅花谱' },
      { name: '反梅花谱' },
      { name: '适情雅趣' },
      { name: '自出洞来无敌手' },
      { name: '梅花谱' },
      { name: '反梅花谱' },
      { name: '适情雅趣' },
    ]
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
