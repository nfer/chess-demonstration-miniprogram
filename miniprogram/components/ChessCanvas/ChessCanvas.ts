// components/ChessCanvas/ChessCanvas.ts
import { KeyInfo } from '../../interface';
import * as util from '../../utils/util';

const CANVAS_ID = 'chessCanvas';

let context = null as any;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    keyInfos: {
      type: Array,
      value: [],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  observers: {
    keyInfos(newValue: Array<KeyInfo>) {
      console.debug('keyInfos changed', newValue);
      if (!newValue.length) {
        return;
      }
      this.initWithRetry(newValue);
    },
  },

  lifetimes: {
    async ready() {
      context = await this.createCanvasContext(CANVAS_ID) as any;
      console.debug('ready', context);
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async createCanvasContext(id: string) {
      return new Promise((resolve, reject) => {
        const query = this.createSelectorQuery();
        query.select(`#${id}`)
          .fields({ node: true, size: true })
          .exec((res) => {
            try {
              resolve(util.getContext(res));
            } catch (error) {
              reject(error);
            }
          });
      });
    },
    initWithRetry(keyInfos: Array<KeyInfo>) {
      console.debug('initWithRetry', Date.now());
      if (context) {
        util.drawChessKeys(context, keyInfos);
        return;
      }

      setTimeout(() => this.initWithRetry(keyInfos), 200);
    }
  },
});
