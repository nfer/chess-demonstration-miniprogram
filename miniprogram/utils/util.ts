/* eslint-disable import/prefer-default-export */
import {
  START_X,
  START_Y,
  LINE_SPACE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
}  from './constants';
import { KeyInfo } from '../interface/index';

export const drawChessBackground = (context: any) => {
  // 底色
  context.fillStyle = '#f1cb9d';
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const lineWidth = 2;
  const halfLineWidth = lineWidth / 2;

  // 棋盘9*10
  context.strokeStyle = '#000';
  context.lineWidth = lineWidth;
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
  context.fillStyle = '#fff';
  context.fillRect(
    START_X + halfLineWidth,
    START_Y + 4 * LINE_SPACE + halfLineWidth,
    CANVAS_WIDTH - LINE_SPACE - lineWidth,
    LINE_SPACE - lineWidth,
  );
  context.fillStyle = '#000';
  context.font = '55px Georgia';
  context.fillText('楚', 190, 520);
  context.fillText('河', 290, 520);
  context.fillText('汉', 550, 520);
  context.fillText('界', 650, 520);
};

export const drawChessKeys = (context: any, keyInfos: Array<KeyInfo>) => {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.font = '40px Georgia';

  keyInfos.forEach(item => {
    const posX = item.x * LINE_SPACE + START_X;
    const posY = item.y * LINE_SPACE + START_Y;
    if (item.type) {
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
    } else {
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

export const drawCursor = (context: any, x: number, y: number) => {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  context.strokeStyle = '#f00';
  context.lineWidth = 2;

  function drewPoint(offsetX: number, offsetY: number) {
    const pointX = START_X + LINE_SPACE * x;
    const pointY = START_Y + LINE_SPACE * y;
    const POINT_WIDTH = 42;
    const POINT_LENGTH = 20;
    context.moveTo(pointX + offsetX * POINT_WIDTH, pointY + offsetY * POINT_WIDTH );
    context.lineTo(pointX + offsetX * POINT_WIDTH, pointY + offsetY * POINT_WIDTH - offsetY * POINT_LENGTH);
    context.moveTo(pointX + offsetX * POINT_WIDTH, pointY + offsetY * POINT_WIDTH );
    context.lineTo(pointX + offsetX * POINT_WIDTH - offsetX * POINT_LENGTH, pointY + offsetY * POINT_WIDTH);
  }
  drewPoint(1, 1);
  drewPoint(-1, -1);
  drewPoint(1, -1);
  drewPoint(-1, 1);
  context.stroke();
};

export const clearCursor = (context: any) => {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
};

export const createCursorContext = async (id: string, scale: number) => {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery();
    query.select(`#${id}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res.length || !res[0].node) {
          reject(new Error('select null'))
          return;
        }

        const canvas = res[0].node;
        const context = canvas.getContext('2d');

        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        context.scale(scale * dpr, scale * dpr);

        resolve(context);
      });
  })
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
        const type = c > 'a' ? 1 : 0;
        output.push({ hash: `${c}_${output.length}`, key: c, name, type, x, y });
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

export const getScale = () => {
  const info = wx.getSystemInfoSync();
  const scale = info.screenWidth / CANVAS_WIDTH;
  return scale;
};

function checkKMove(keyInfo: KeyInfo, x: number, y: number, isRed: boolean) {
  if (x < 3 || x > 5) return false;

  if (isRed) {
    if (y < 7 || y > 9) return false;
  } else {
    if (y < 0 || y > 3) return false;
  }

  const step = Math.abs(keyInfo.x - x) + Math.abs(keyInfo.y - y);
  return step === 1;
}

export const checkMoveValid = (keyInfo: KeyInfo, x: number, y: number) => {
  switch (keyInfo.key) {
    case 'k':
      return checkKMove(keyInfo, x, y, false);
    case 'K':
      return checkKMove(keyInfo, x, y, true);
  }
  return false;
};