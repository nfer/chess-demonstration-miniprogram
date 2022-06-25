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
  type: boolean;
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
