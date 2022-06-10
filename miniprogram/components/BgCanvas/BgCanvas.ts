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
      context = await util.createCanvasContext(this, CANVAS_ID) as any;
      console.debug('ready', context);
      util.drawChessBackground(context);
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
  },
});
