// components/CursorCanvas.ts
import { KeyPos } from '../../interface/index';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    MARGIN_HORIZONTAL,
    MARGIN_VERTICAL,
    LINE_SPACE,
} from '../../utils/constants';

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
                this.drawCursor(CANVAS_ID, pos.x, pos.y);
            }

            const { lastPos } = this.data;
            if (lastPos.x !== -1 && lastPos.y !== -1) {
                this.clearCursor(CANVAS_ID, lastPos.x, lastPos.y);
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
                        if (!res || !res.length || !res[0]?.node) {
                            reject(new Error('select null'));
                            return;
                        }

                        const canvas = res[0].node;
                        const context = canvas.getContext('2d');

                        const info = wx.getSystemInfoSync();
                        canvas.width = res[0].width * info.pixelRatio;
                        canvas.height = res[0].height * info.pixelRatio;
                        const scale = info.screenWidth / CANVAS_WIDTH * info.pixelRatio;
                        context.scale(scale, scale);

                        resolve(context);
                    });
            });
        },
        async drawCursor(id: string, x: number, y: number) {
            console.log('drawCursor', id, x, y);

            context.strokeStyle = '#f00';
            context.lineWidth = 2;

            function drewPoint(offsetX: number, offsetY: number) {
                const pointX = MARGIN_HORIZONTAL + LINE_SPACE * x;
                const pointY = MARGIN_VERTICAL + LINE_SPACE * y;
                const POINT_WIDTH = 42;
                const POINT_LENGTH = 20;
                context.moveTo(pointX + offsetX * POINT_WIDTH, pointY + offsetY * POINT_WIDTH);
                context.lineTo(pointX + offsetX * POINT_WIDTH, pointY + offsetY * POINT_WIDTH - offsetY * POINT_LENGTH);
                context.moveTo(pointX + offsetX * POINT_WIDTH, pointY + offsetY * POINT_WIDTH);
                context.lineTo(pointX + offsetX * POINT_WIDTH - offsetX * POINT_LENGTH, pointY + offsetY * POINT_WIDTH);
            }
            context.beginPath();
            drewPoint(1, 1);
            drewPoint(-1, -1);
            drewPoint(1, -1);
            drewPoint(-1, 1);
            context.closePath();
            context.stroke();
        },
        async clearCursor(id: string, x: number, y: number) {
            console.log('clearCursor', id, x, y);
            const pointX = MARGIN_HORIZONTAL + LINE_SPACE * x;
            const pointY = MARGIN_VERTICAL + LINE_SPACE * y;
            context.clearRect(pointX - LINE_SPACE / 2, pointY - LINE_SPACE / 2, LINE_SPACE, LINE_SPACE);
        },
    }
})
