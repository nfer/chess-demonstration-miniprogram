// components/BgCanvas.ts
import * as util from '../../utils/util';
import Log from '../../utils/log';

const CANVAS_ID = 'bgCanvas';

const TAG = 'BgCanvas';

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
      Log.d(TAG, 'ready', context);
      util.drawChessBackground(context);
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
  },
});
