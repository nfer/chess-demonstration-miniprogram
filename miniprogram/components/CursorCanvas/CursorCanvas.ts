// components/CursorCanvas.ts
import { KeyPos } from '../../interface/index';
import * as util from '../../utils/util';

const CANVAS_ID = 'cursorCanvas';

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        pos: {
            type: Object,
            value: {x: -1, y: -1} as KeyPos,
            observer: (newValue: Object, oldValue: Object) => {
                console.log(newValue, oldValue);
                const pos = newValue as KeyPos;
                if (pos.x === -1 || pos.y === -1) {
                    util.clearCursor(CANVAS_ID);
                } else {
                    util.drawCursor(CANVAS_ID, pos.x, pos.y);
                }
            }
        },
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

    }
})
