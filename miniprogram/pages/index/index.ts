import { BookInfo, ChapterInfo } from '../../interface';
import { books } from '../../data/books';

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
  selectChapter(event: WechatMiniprogram.BaseEvent) {
    const bookName = this.data.currPath;
    const chapterName = event.currentTarget.dataset.name;
    const book = books.find(item => item.name === bookName) as BookInfo;
    const chapter = book.chapters.find(item => item.name === chapterName) as ChapterInfo;
    this.goToLearnlPage(chapter);
  },
  backToBookLis() {
    this.setData({
      currPath: '',
      chapter: [],
    });
  },
  goToLearnlPage(chapter: ChapterInfo) {
    wx.navigateTo({
      url: '../learnPage/index?id=' + chapter.id,
    });
  },
});
