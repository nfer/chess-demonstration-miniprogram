export const enum KeyType {
  NONE = -1,
  RED,
  BLACK
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