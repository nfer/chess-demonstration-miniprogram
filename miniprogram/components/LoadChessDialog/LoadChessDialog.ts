// components/LoadChessDialog/LoadChessDialog.ts
import { BookInfo, ChapterInfo } from '../../interface/index';
import Log from '../../utils/log';
import { books } from '../../data/books';

const TAG = 'LoadChessDialog';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    chapterId: {
      type: Number,
      default: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    chapter: [] as Array<ChapterInfo>,
  },

  /**
   * 生命周期函数
   */
  lifetimes: {
    attached() {
      const bookName = '自出洞来无敌手';
      const book = books.find(item => item.name === bookName) as BookInfo;
      this.setData({
        chapter: book.chapters,
      });
      Log.d(TAG, `chapterId:${JSON.stringify(this.data.chapterId)}`);
      this.setData({
        scrollIntoView: `id_${this.data.chapterId}`,
      });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCloseClick(event: WechatMiniprogram.BaseEvent) {
      Log.d(TAG, `onCloseClick event:${JSON.stringify(event)}`);
      const eventOption = { bubbles: true, composed: true, capturePhase: true };
      this.triggerEvent('onDialogClosed', {}, eventOption);
    },
    selectChapter(event: WechatMiniprogram.BaseEvent) {
      Log.d(TAG, `selectChapter event:${JSON.stringify(event)}`);
      const chapterId = Number(event.currentTarget.dataset.id);
      const chapterName = event.currentTarget.dataset.name;
      const eventOption = { bubbles: true, composed: true, capturePhase: true };
      this.triggerEvent('onSelectChapter', { chapterId, chapterName }, eventOption);
    },
  },
});
