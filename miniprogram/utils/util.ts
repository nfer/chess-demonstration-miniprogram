/* eslint-disable import/prefer-default-export */
import {
  LINE_SPACE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  MARGIN_VERTICAL,
  MARGIN_HORIZONTAL,
  CHESSBOARD_HEIGHT,
  CHESSBOARD_WIDTH,
} from './constants';
import { KeyInfo, KeyType } from '../interface/index';

export const createCanvasContext = async (component: any, id: string) => {
  return new Promise((resolve, reject) => {
    const query = component.createSelectorQuery();
    query.select(`#${id}`)
      .fields({ node: true, size: true })
      .exec((res: any) => {
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
};

export const drawChessBackground = async (context: any) => {
  // 底色
  context.fillStyle = '#f1cb9d';
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const lineWidth = 2;
  const halfLineWidth = lineWidth / 2;

  // 棋盘9*10
  context.strokeStyle = '#000';
  context.lineWidth = lineWidth;
  for (let index = 0; index < 9; index += 1) {
    const x = LINE_SPACE * index + MARGIN_HORIZONTAL;
    const y = MARGIN_VERTICAL;
    context.moveTo(x, y);
    context.lineTo(x, y + CHESSBOARD_HEIGHT);
  }
  for (let index = 0; index < 10; index += 1) {
    const x = MARGIN_HORIZONTAL;
    const y = LINE_SPACE * index + MARGIN_VERTICAL;
    context.moveTo(x, y);
    context.lineTo(x + CHESSBOARD_WIDTH, y);
  }
  context.stroke();

  // 士斜线
  context.moveTo(MARGIN_HORIZONTAL + LINE_SPACE * 3, MARGIN_VERTICAL + LINE_SPACE * 0);
  context.lineTo(MARGIN_HORIZONTAL + LINE_SPACE * 5, MARGIN_VERTICAL + LINE_SPACE * 2);
  context.moveTo(MARGIN_HORIZONTAL + LINE_SPACE * 5, MARGIN_VERTICAL + LINE_SPACE * 0);
  context.lineTo(MARGIN_HORIZONTAL + LINE_SPACE * 3, MARGIN_VERTICAL + LINE_SPACE * 2);

  context.moveTo(MARGIN_HORIZONTAL + LINE_SPACE * 3, MARGIN_VERTICAL + LINE_SPACE * 7);
  context.lineTo(MARGIN_HORIZONTAL + LINE_SPACE * 5, MARGIN_VERTICAL + LINE_SPACE * 9);
  context.moveTo(MARGIN_HORIZONTAL + LINE_SPACE * 5, MARGIN_VERTICAL + LINE_SPACE * 7);
  context.lineTo(MARGIN_HORIZONTAL + LINE_SPACE * 3, MARGIN_VERTICAL + LINE_SPACE * 9);
  context.stroke();

  const seqWidth = lineWidth * 4;
  const seqHeight = lineWidth * 10;
  // 兵的位置
  for (let i = 0; i < 5; i += 1) {
    const offsetX = MARGIN_HORIZONTAL + i * 2 * LINE_SPACE;
    const offsetY = MARGIN_VERTICAL + 3 * LINE_SPACE;
    if (i !== 4) {
      context.moveTo(offsetX + seqWidth, offsetY + seqWidth);
      context.lineTo(offsetX + seqWidth, offsetY + seqWidth + seqHeight);
      context.moveTo(offsetX + seqWidth, offsetY + seqWidth);
      context.lineTo(offsetX + seqWidth + seqHeight, offsetY + seqWidth);

      context.moveTo(offsetX + seqWidth, offsetY - seqWidth);
      context.lineTo(offsetX + seqWidth, offsetY - seqWidth - seqHeight);
      context.moveTo(offsetX + seqWidth, offsetY - seqWidth);
      context.lineTo(offsetX + seqWidth + seqHeight, offsetY - seqWidth);
    }

    if (i !== 0) {
      context.moveTo(offsetX - seqWidth, offsetY - seqWidth);
      context.lineTo(offsetX - seqWidth, offsetY - seqWidth - seqHeight);
      context.moveTo(offsetX - seqWidth, offsetY - seqWidth);
      context.lineTo(offsetX - seqWidth - seqHeight, offsetY - seqWidth);

      context.moveTo(offsetX - seqWidth, offsetY + seqWidth);
      context.lineTo(offsetX - seqWidth, offsetY + seqWidth + seqHeight);
      context.moveTo(offsetX - seqWidth, offsetY + seqWidth);
      context.lineTo(offsetX - seqWidth - seqHeight, offsetY + seqWidth);
    }
  }
  for (let i = 0; i < 5; i += 1) {
    const offsetX = MARGIN_HORIZONTAL + i * 2 * LINE_SPACE;
    const offsetY = MARGIN_VERTICAL + 6 * LINE_SPACE;
    if (i !== 4) {
      context.moveTo(offsetX + seqWidth, offsetY + seqWidth);
      context.lineTo(offsetX + seqWidth, offsetY + seqWidth + seqHeight);
      context.moveTo(offsetX + seqWidth, offsetY + seqWidth);
      context.lineTo(offsetX + seqWidth + seqHeight, offsetY + seqWidth);

      context.moveTo(offsetX + seqWidth, offsetY - seqWidth);
      context.lineTo(offsetX + seqWidth, offsetY - seqWidth - seqHeight);
      context.moveTo(offsetX + seqWidth, offsetY - seqWidth);
      context.lineTo(offsetX + seqWidth + seqHeight, offsetY - seqWidth);
    }

    if (i !== 0) {
      context.moveTo(offsetX - seqWidth, offsetY - seqWidth);
      context.lineTo(offsetX - seqWidth, offsetY - seqWidth - seqHeight);
      context.moveTo(offsetX - seqWidth, offsetY - seqWidth);
      context.lineTo(offsetX - seqWidth - seqHeight, offsetY - seqWidth);

      context.moveTo(offsetX - seqWidth, offsetY + seqWidth);
      context.lineTo(offsetX - seqWidth, offsetY + seqWidth + seqHeight);
      context.moveTo(offsetX - seqWidth, offsetY + seqWidth);
      context.lineTo(offsetX - seqWidth - seqHeight, offsetY + seqWidth);
    }
  }
  // 炮的位置
  for (let i = 0; i < 2; i += 1) {
    const offsetX = MARGIN_HORIZONTAL + i * 6 * LINE_SPACE + LINE_SPACE;
    const offsetY = MARGIN_VERTICAL + 2 * LINE_SPACE;
    context.moveTo(offsetX + seqWidth, offsetY + seqWidth);
    context.lineTo(offsetX + seqWidth, offsetY + seqWidth + seqHeight);
    context.moveTo(offsetX + seqWidth, offsetY + seqWidth);
    context.lineTo(offsetX + seqWidth + seqHeight, offsetY + seqWidth);

    context.moveTo(offsetX + seqWidth, offsetY - seqWidth);
    context.lineTo(offsetX + seqWidth, offsetY - seqWidth - seqHeight);
    context.moveTo(offsetX + seqWidth, offsetY - seqWidth);
    context.lineTo(offsetX + seqWidth + seqHeight, offsetY - seqWidth);

    context.moveTo(offsetX - seqWidth, offsetY - seqWidth);
    context.lineTo(offsetX - seqWidth, offsetY - seqWidth - seqHeight);
    context.moveTo(offsetX - seqWidth, offsetY - seqWidth);
    context.lineTo(offsetX - seqWidth - seqHeight, offsetY - seqWidth);

    context.moveTo(offsetX - seqWidth, offsetY + seqWidth);
    context.lineTo(offsetX - seqWidth, offsetY + seqWidth + seqHeight);
    context.moveTo(offsetX - seqWidth, offsetY + seqWidth);
    context.lineTo(offsetX - seqWidth - seqHeight, offsetY + seqWidth);
  }
  for (let i = 0; i < 2; i += 1) {
    const offsetX = MARGIN_HORIZONTAL + i * 6 * LINE_SPACE + LINE_SPACE;
    const offsetY = MARGIN_VERTICAL + 7 * LINE_SPACE;
    context.moveTo(offsetX + seqWidth, offsetY + seqWidth);
    context.lineTo(offsetX + seqWidth, offsetY + seqWidth + seqHeight);
    context.moveTo(offsetX + seqWidth, offsetY + seqWidth);
    context.lineTo(offsetX + seqWidth + seqHeight, offsetY + seqWidth);

    context.moveTo(offsetX + seqWidth, offsetY - seqWidth);
    context.lineTo(offsetX + seqWidth, offsetY - seqWidth - seqHeight);
    context.moveTo(offsetX + seqWidth, offsetY - seqWidth);
    context.lineTo(offsetX + seqWidth + seqHeight, offsetY - seqWidth);

    context.moveTo(offsetX - seqWidth, offsetY - seqWidth);
    context.lineTo(offsetX - seqWidth, offsetY - seqWidth - seqHeight);
    context.moveTo(offsetX - seqWidth, offsetY - seqWidth);
    context.lineTo(offsetX - seqWidth - seqHeight, offsetY - seqWidth);

    context.moveTo(offsetX - seqWidth, offsetY + seqWidth);
    context.lineTo(offsetX - seqWidth, offsetY + seqWidth + seqHeight);
    context.moveTo(offsetX - seqWidth, offsetY + seqWidth);
    context.lineTo(offsetX - seqWidth - seqHeight, offsetY + seqWidth);
  }
  context.stroke();

  // 楚河汉界
  context.fillStyle = '#fff';
  context.fillRect(
    MARGIN_HORIZONTAL + halfLineWidth,
    MARGIN_VERTICAL + 4 * LINE_SPACE + halfLineWidth,
    CHESSBOARD_WIDTH - lineWidth,
    LINE_SPACE - lineWidth,
  );
  context.fillStyle = '#000';
  context.textBaseline = 'bottom';
  context.font = `${LINE_SPACE * 0.55}px Helvetica`;
  const metrics = context.measureText('河');
  const fontWidth = metrics.width;
  let fontHeight = metrics.fontBoundingBoxAscent;
  // XXX: 对于无法获取`metrics.fontBoundingBoxAscent`属性值的时候，使用`metrics.width * 1.15`做降级处理
  if (!fontHeight) {
    fontHeight = fontWidth;
  }

  const textY = 4.5 * LINE_SPACE + MARGIN_VERTICAL + (fontHeight / 2);
  context.fillText('楚', 1 * LINE_SPACE + MARGIN_HORIZONTAL, textY);
  context.fillText('河', 2 * LINE_SPACE + MARGIN_HORIZONTAL, textY);
  context.fillText('汉', 6 * LINE_SPACE + MARGIN_HORIZONTAL - fontWidth, textY);
  context.fillText('界', 7 * LINE_SPACE + MARGIN_HORIZONTAL - fontWidth, textY);
};

export const drawChessKeys = async (context: any, keyInfos: Array<KeyInfo>) => {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.font = `${LINE_SPACE * 0.40}px Helvetica`;

  keyInfos.forEach(item => {
    const posX = item.x * LINE_SPACE + MARGIN_HORIZONTAL;
    const posY = item.y * LINE_SPACE + MARGIN_VERTICAL;

    if (item.type === KeyType.BLACK) { // 黑棋
      context.strokeStyle = '#000';
      context.fillStyle = '#f1ffe0';
      context.beginPath();
      context.arc(posX, posY, 40, 0, 2 * Math.PI);
      context.fill();
      context.stroke();
      context.beginPath();
      context.arc(posX, posY, 33, 0, 2 * Math.PI);
      context.stroke();
      context.fillStyle = '#000';
    } else { // 红棋
      context.strokeStyle = '#F00';
      context.fillStyle = '#f2eff5';
      context.beginPath();
      context.arc(posX, posY, 40, 0, 2 * Math.PI);
      context.fill();
      context.stroke();
      context.beginPath();
      context.arc(posX, posY, 33, 0, 2 * Math.PI);
      context.stroke();
      context.fillStyle = '#F00';
    }
    context.fillText(item.name, posX - 20, posY + 15);
  });
};

export const drawCursor = async (context: any, x: number, y: number) => {
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
};

export const clearCursor = async (context: any, x: number, y: number) => {
  const pointX = MARGIN_HORIZONTAL + LINE_SPACE * x;
  const pointY = MARGIN_VERTICAL + LINE_SPACE * y;
  context.clearRect(pointX - LINE_SPACE / 2, pointY - LINE_SPACE / 2, LINE_SPACE, LINE_SPACE);
};

export const getTextByChar = (ch: string) => {
  switch (ch) {
    case 'k': return '将';
    case 'K': return '帅';
    case 'a': return '士';
    case 'A': return '仕';
    case 'b': return '象';
    case 'B': return '相';
    case 'n': return '马';
    case 'N': return '马';
    case 'r': return '车';
    case 'R': return '车';
    case 'c': return '炮';
    case 'C': return '炮';
    case 'p': return '卒';
    case 'P': return '兵';
    default: return '空';
  }
};

// '3kN1b1C/8r/9/3Cr4/9/9/9/9/4p4/5K3 w - - 0 1'
export const parseFenStr = (str: string) => {
  const arr = str.split(' ');
  const lines = arr[0].split('/');

  const output = [] as Array<KeyInfo>;

  lines.forEach((line, y) => {
    let x = 0;
    for (let i = 0; i < line.length; i += 1) {
      const c = line[i];
      if (c > '0' && c <= '9') {
        x += Number(c);
      } else {
        const name = getTextByChar(c);
        const type = c >= 'a' ? KeyType.BLACK : KeyType.RED;
        output.push({ hash: `${c}_${output.length}`, key: c, name, type, x, y });
        x += 1;
      }
    }
  });

  return output;
};

// '3kN1b1C/8r/9/3Cr4/9/9/9/9/4p4/5K3'
export const getFenStr = (keyInfos: Array<KeyInfo>) => {
  const lines = [] as Array<Array<KeyInfo>>;
  // 转换为10行数组
  keyInfos.forEach(keyInfo => {
    const { y } = keyInfo;
    let item = lines[y];
    if (!item) {
      lines[y] = [] as Array<KeyInfo>;
      item = lines[y];
    }
    item.push({ ...keyInfo });
  });
  // 排序
  lines.forEach(line => line.sort((a, b) => a.x - b.x));

  const strs = [] as Array<string>;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) {
      strs.push('9');
      continue;
    }

    let lastX = -1;
    let content = '';
    for (let j = 0; j < line.length; j++) {
      const keyInfo = line[j];
      const offset = keyInfo.x - lastX - 1;
      lastX = keyInfo.x;
      if (offset) {
        content = `${content}${offset}`;
      }
      content = `${content}${keyInfo.key}`;
    }
    if (lastX !== 8) {
      content = `${content}${8 - lastX}`;
    }

    strs.push(content);
  }

  return strs.join('/');
};

const formatNumber = (n: number) => {
  const s = n.toString();
  return s[1] ? s : `0${s}`;
};

export const formatTime = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    `${[year, month, day].map(formatNumber).join('/')
    } ${[hour, minute, second].map(formatNumber).join(':')}`
  );
};

export const getBaseInfo = () => {
  const info = wx.getSystemInfoSync();
  const screenAspect = info.screenHeight / info.screenWidth;
  const canvasAspect = CANVAS_HEIGHT / CANVAS_WIDTH;
  const canvasScale = info.screenWidth / CANVAS_WIDTH;
  return {
    screenAspect,
    canvasAspect,
    canvasScale,
  };
};
