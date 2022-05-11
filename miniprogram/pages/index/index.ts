import { BookInfo, ChapterInfo } from '../../interface';
import { books } from './data';

Page({
  data: {
    currPath: '',
    books: books,
    chapter: [] as Array<ChapterInfo>,
  },
  // 事件处理函数
  selectBook(event: WechatMiniprogram.BaseEvent) {
    const bookName = event.currentTarget.dataset.name;
    const book = books.find(item => item.name === bookName) as BookInfo;
    this.setData({
      currPath: book.name,
      chapter: book.chapters,
    });
  },
  backToBookLis() {
    this.setData({
      currPath: '',
      chapter: [],
    });
  },
  goToLearnlPage() {
    wx.navigateTo({
      url: '../learnPage/index',
    });
  },
});
