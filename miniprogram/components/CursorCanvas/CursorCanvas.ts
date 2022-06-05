// components/CursorCanvas.ts
import { KeyPos } from '../../interface/index';
import * as util from '../../utils/util';

const CANVAS_ID = 'cursorCanvas';
const NONE_POS: KeyPos = { x: -1, y: -1 };

let context = null as any;

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        pos: {
            type: Object,
            value: { x: -1, y: -1 } as KeyPos,
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        lastPos: NONE_POS,
    },

    observers: {
        pos(newValue: Object) {
            console.log('observers', newValue);
            const pos = newValue as KeyPos;
            if (pos.x !== -1 && pos.y !== -1) {
                util.drawCursor(context, pos.x, pos.y);
            }

            const { lastPos } = this.data;
            if (lastPos.x !== -1 && lastPos.y !== -1) {
                util.clearCursor(context, lastPos.x, lastPos.y);
            }

            this.setData({
                lastPos: { ...pos },
            })
        }
    },

    lifetimes: {
        async ready() {
            context = await this.createCursorContext(CANVAS_ID) as any;
            console.log('ready', context);
        },
    },

    /**
     * 组件的方法列表
     */
    methods: {
        async createCursorContext(id: string) {
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
    }
})
