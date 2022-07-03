export const enum KeyType {
  NONE = -1,
  RED,
  BLACK,
}

export interface KeyInfo {
  hash: string;
  key: string;
  name: string;
  type: KeyType;
  x: number;
  y: number;
}

export interface KeyPos {
  x: number;
  y: number;
}

export interface StepInfo {
  name: string;
  error: boolean;
}

export interface ChapterInfo {
  id: number;
  type: string;
  name: string;
}

export interface BookInfo {
  type: string;
  name: string;
  chapters: Array<ChapterInfo>;
}

export const EMPTY_KEYPOS: KeyPos = { x: -1, y: -1 };
export const EMPTY_KEYINFO: KeyInfo = { hash: '', key: '', name: '', type: KeyType.NONE, x: -1, y: -1 };


export enum STATUS {
  OK = 0,
  WARN,
  ERROR,
}
export enum CHANGE_TYPE {
  KEYINFO,
  ACTIVEKEY,
}
export enum DEMONSTRATION_RESULT {
  NORMAL = 0,
  ERROR,
  SUCCESS,
}

export interface ChessResult {
  changed: Array<CHANGE_TYPE>;
  status: STATUS;
  msg: string;
  step?: StepInfo;
  result?: DEMONSTRATION_RESULT;
  cursorPos?: KeyPos;
  keyInfos?: Array<KeyInfo>;
}

export function getChessResult(status: STATUS, msg = ''): ChessResult {
  return {
    changed: [],
    status,
    msg,
    step: { name: '', error: false },
    result: DEMONSTRATION_RESULT.NORMAL,
  };
}
