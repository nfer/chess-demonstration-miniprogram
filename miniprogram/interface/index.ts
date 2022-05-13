export interface KeyInfo {
  hash: string;
  key: string;
  name: string;
  type: number;
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