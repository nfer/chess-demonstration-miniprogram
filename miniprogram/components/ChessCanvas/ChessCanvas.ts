// components/ChessCanvas/ChessCanvas.ts
import { KeyInfo, KeyPos } from '../../interface/index';
import { CHESS_TOUCH_RANGE, LINE_SPACE, MARGIN_HORIZONTAL, MARGIN_VERTICAL } from '../../utils/constants';
import * as util from '../../utils/util';
import Log from '../../utils/log';

const CANVAS_ID = 'chessCanvas';
const TAG = 'ChessCanvas';

let context = null as any;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    keyInfos: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    scale: 1,
  },

  observers: {
    keyInfos(newValue: Array<KeyInfo>) {
      Log.d(TAG, 'keyInfos changed', newValue);
      if (!newValue.length) {
        return;
      }
      if (!context) {
        return;
      }
      util.drawChessKeys(context, newValue);
    },
  },

  lifetimes: {
    attached() {
      const info = util.getBaseInfo();
      this.setData({
        scale: info.canvasScale,
      });
    },
    async ready() {
      context = await util.createCanvasContext(this, CANVAS_ID) as any;
      Log.d(TAG, 'ready', context);
      util.drawChessKeys(context, this.data.keyInfos);
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectItem(e: WechatMiniprogram.TouchEvent) {
      const { scale } = this.data;

      const offsetX = Math.floor(e.detail.x / scale) - MARGIN_HORIZONTAL;
      const offsetY = Math.floor(e.detail.y / scale) - MARGIN_VERTICAL;
      const posX = Math.round(offsetX / LINE_SPACE);
      const posY = Math.round(offsetY / LINE_SPACE);

      // 场景一：点击在空白处
      if (Math.abs(offsetX - posX * LINE_SPACE) > CHESS_TOUCH_RANGE || Math.abs(offsetY - posY * LINE_SPACE) > CHESS_TOUCH_RANGE) {
        return;
      }

      const eventDetail: KeyPos = {
        x: posX,
        y: posY,
      };
      const eventOption = { bubbles: true, composed: true, capturePhase: true };
      this.triggerEvent('onChessClick', eventDetail, eventOption);
    },
  },
});
