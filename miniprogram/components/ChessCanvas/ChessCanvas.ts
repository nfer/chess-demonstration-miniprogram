// components/ChessCanvas/ChessCanvas.ts
import { KeyInfo } from '../../interface';
import { MARGIN_HORIZONTAL, MARGIN_VERTICAL } from '../../utils/constants';
import * as util from '../../utils/util';

const CANVAS_ID = 'chessCanvas';

let context = null as any;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    scale: {
      type: Number,
      value: 1,
    },
    keyInfos: {
      type: Array,
      value: [],
    },
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
    },

    selectItem(e: any) {
      const { scale, keyInfos } = this.data;

      const offsetX = Math.floor(e.detail.x / scale) - MARGIN_HORIZONTAL;
      const offsetY = Math.floor(e.detail.y / scale) - MARGIN_VERTICAL;
      const posX = Math.round(offsetX / 100);
      const posY = Math.round(offsetY / 100);

      // 场景一：点击在空白处
      if (Math.abs(offsetX - posX * 100) > 30 || Math.abs(offsetY - posY * 100) > 30) {
        return;
      }

      const focuskey = keyInfos.find(item => item.x === posX && item.y === posY);

      // 场景二：点击在棋子上
      if (focuskey) {
        console.debug('点击在棋子上', focuskey);
        return;
      }

      // 场景三：点击在网格上
      console.debug('点击在网格上', posX, posY);
    },
  },
});
