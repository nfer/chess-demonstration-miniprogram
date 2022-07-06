// components/LoadChessDialog/LoadChessDialog.ts
import Log from '../../utils/log';

const TAG = 'LoadChessDialog';

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

  /**
   * 组件的方法列表
   */
  methods: {
    onCloseClick(event: WechatMiniprogram.BaseEvent) {
      Log.d(TAG, `onCloseClick event:${JSON.stringify(event)}`);
      const eventOption = { bubbles: true, composed: true, capturePhase: true };
      this.triggerEvent('onDialogClosed', {}, eventOption);
    },
  },
});
