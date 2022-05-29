/** 线间距
 *
 * 主要用户线与线之间的间距
 */
export const LINE_SPACE = 100;

/** 垂直间距
 *
 * 主要用于棋盘上下的边距
 */
export const MARGIN_VERTICAL = 70;

/** 水平间距
 *
 * 主要用于棋盘左右的边距
 */
export const MARGIN_HORIZONTAL = 100;

/** 棋盘宽度
 *
 * 棋盘区域的宽度
 */
export const CHESSBOARD_WIDTH = LINE_SPACE * 8;

/** 棋盘高度
 *
 * 棋盘区域的高度
 */
export const CHESSBOARD_HEIGHT = LINE_SPACE * 9;

/** 画布宽度
 *
 * 画布区域的宽度
 */
export const CANVAS_WIDTH = CHESSBOARD_WIDTH + MARGIN_HORIZONTAL * 2;

/** 画布高度
 *
 * 画布区域的高度
 */
export const CANVAS_HEIGHT = CHESSBOARD_HEIGHT + MARGIN_VERTICAL * 2;
