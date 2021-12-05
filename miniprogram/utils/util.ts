/* eslint-disable import/prefer-default-export */
import {
  START_X,
  START_Y,
  LINE_SPACE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
}  from './constants';

export const drawChessBackground = (id: string, scale: number) => {
  // 使用 wx.createContext 获取绘图上下文 context
  const context = wx.createCanvasContext(id);

  // scale
  context.scale(scale, scale);

  // 底色
  context.setFillStyle('#f1cb9d');
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const lineWidth = 2;
  const halfLineWidth = lineWidth / 2;

  // 棋盘9*10
  context.setStrokeStyle('#000');
  context.setLineWidth(lineWidth);
  for (let index = 0; index < 9; index += 1) {
    context.moveTo(START_X + LINE_SPACE * index, START_Y);
    context.lineTo(START_X + LINE_SPACE * index, START_Y + CANVAS_HEIGHT - LINE_SPACE);
  }
  for (let index = 0; index < 10; index += 1) {
    context.moveTo(START_X, START_Y + LINE_SPACE * index);
    context.lineTo(START_X + CANVAS_WIDTH - LINE_SPACE, START_Y + LINE_SPACE * index);
  }
  context.stroke();

  // 士斜线
  context.moveTo(START_X + LINE_SPACE * 3, START_Y + LINE_SPACE * 0);
  context.lineTo(START_X + LINE_SPACE * 5, START_Y + LINE_SPACE * 2);
  context.moveTo(START_X + LINE_SPACE * 5, START_Y + LINE_SPACE * 0);
  context.lineTo(START_X + LINE_SPACE * 3, START_Y + LINE_SPACE * 2);

  context.moveTo(START_X + LINE_SPACE * 3, START_Y + LINE_SPACE * 7);
  context.lineTo(START_X + LINE_SPACE * 5, START_Y + LINE_SPACE * 9);
  context.moveTo(START_X + LINE_SPACE * 5, START_Y + LINE_SPACE * 7);
  context.lineTo(START_X + LINE_SPACE * 3, START_Y + LINE_SPACE * 9);
  context.stroke();

  const seqWidth = lineWidth * 4;
  const seqHeight = lineWidth * 10;
  // 兵的位置
  for (let i = 0; i < 5; i += 1) {
    const offsetX = START_X + i * 2 * LINE_SPACE;
    const offsetY = START_Y + 3 * LINE_SPACE;
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
    const offsetX = START_X + i * 2 * LINE_SPACE;
    const offsetY = START_Y + 6 * LINE_SPACE;
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
    const offsetX = START_X + i * 6 * LINE_SPACE + LINE_SPACE;
    const offsetY = START_Y + 2 * LINE_SPACE;
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
    const offsetX = START_X + i * 6 * LINE_SPACE + LINE_SPACE;
    const offsetY = START_Y + 7 * LINE_SPACE;
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
  context.setFillStyle('#fff');
  context.fillRect(
    START_X + halfLineWidth,
    START_Y + 4 * LINE_SPACE + halfLineWidth,
    CANVAS_WIDTH - LINE_SPACE - lineWidth,
    LINE_SPACE - lineWidth,
  );
  context.setFillStyle('#000');
  context.font = '55px Georgia';
  context.fillText('楚', 190, 520);
  context.fillText('河', 290, 520);
  context.fillText('汉', 550, 520);
  context.fillText('界', 650, 520);

  context.draw();
};

export const drawChessKeys = (id: string, scale: number, keyInfos: Array<KeyInfo>) => {
  // 使用 wx.createContext 获取绘图上下文 context
  const context = wx.createCanvasContext(id);

  // scale
  context.scale(scale, scale);

  context.font = '40px Georgia';

  keyInfos.forEach(item => {
    const posX = item.x * LINE_SPACE + START_X;
    const posY = item.y * LINE_SPACE + START_Y;
    if (item.type) {
      context.setStrokeStyle('#000');
      context.setFillStyle('#f1ffe0');
      context.beginPath();
      context.arc(posX, posY, 40, 0, 2 * Math.PI);
      context.fill();
      context.stroke();
      context.beginPath();
      context.arc(posX, posY, 33, 0, 2 * Math.PI);
      context.stroke();
      context.setFillStyle('#000');
    } else {
      context.setStrokeStyle('#F00');
      context.setFillStyle('#f2eff5');
      context.beginPath();
      context.arc(posX, posY, 40, 0, 2 * Math.PI);
      context.fill();
      context.stroke();
      context.beginPath();
      context.arc(posX, posY, 33, 0, 2 * Math.PI);
      context.stroke();
      context.setFillStyle('#F00');
    }
    context.fillText(item.name, posX - 20, posY + 15);
  })
  context.draw();
};

export interface KeyInfo {
  key: string;
  name: string;
  type: number;
  x: number;
  y: number;
}

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
        const type = c > 'a' ? 1 : 0;
        output.push({ key: c, name, type, x, y });
        x += 1;
      }
    }
  });

  return output;
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
    } ${
      [hour, minute, second].map(formatNumber).join(':')}`
  );
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