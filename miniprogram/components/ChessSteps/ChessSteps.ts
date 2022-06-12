// components/ChessSteps.ts
import * as util from '../../utils/util';

const MIN_ASPECT_SHOW_STEPS = 1.9;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    steps: {
      type: Array,
      value: [],
    },
    isError: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isVertical: false,
  },

  lifetimes: {
    attached() {
      const info = util.getBaseInfo();
      this.setData({
        isVertical: info.screenAspect > MIN_ASPECT_SHOW_STEPS,
      });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
  },
});
