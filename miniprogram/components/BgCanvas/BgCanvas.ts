// components/BgCanvas.ts
import * as util from '../../utils/util';

const CANVAS_ID = 'bgCanvas';

let context = null as any;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  lifetimes: {
    async ready() {
      context = await this.createCanvasContext(CANVAS_ID) as any;
      console.debug('ready', context);
      util.drawChessBackground(context);
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
  },
});
