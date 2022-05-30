# 象棋打谱

![](https://raw.githubusercontent.com/nfer/chess-demonstration-miniprogram/main/qrcode.jpg)

## 布局篇

整个棋盘区域从低往上共分为三层：

 - 棋盘部分：包括背景图、棋盘网格、田字格斜线、炮位置标识、兵/卒位置标识以及楚河汉界
 - 棋子部分：包括红方和黑方共32个棋子
 - 操作标识部分：包括当前选中的棋子标识和可移动的位置标识

### 棋盘绘制

在画布中，整个棋盘部分属于不可变的一层。其中棋盘部分具有以下几个特征：

- 由10条横线和9条竖线组成一个交叉网
- 上下留有间距，且间距相同
- 左右留有间距，且间距相同（实现水平居中的效果）
- 红方和黑方的将所在的位置，分别有两条斜线，标识“士”的运行路线
- 红方和黑方每一个炮的位置，有一个双纹十字标识
- 红方和黑方每一个兵/卒的位置，有一个双纹十字标识
- 中间有一条水平分隔，叫做“楚河汉界”，其中楚河汉界内没有网格线

其中，外层画布的宽度为百分比宽度（CSS样式为`100vw`)，而计算外层画布的高度的计算公式为：

```js
// 棋盘的宽度
const CHESSBOARD_WIDTH = LINE_SPACE * 8;
// 棋盘的高度
const CHESSBOARD_HEIGHT = LINE_SPACE * 9;
// 画布的宽度（即棋盘宽度+左右两侧的间距）
const CANVAS_WIDTH = CHESSBOARD_WIDTH + MARGIN_HORIZONTAL * 2;
// 画布的高度（即棋盘高度+上下两侧的间距）
const CANVAS_HEIGHT = CHESSBOARD_HEIGHT + MARGIN_VERTICAL * 2;

// 外层画布的宽度计算公式
(CANVAS_HEIGHT / CANVAS_WIDTH * 100)vw
```
