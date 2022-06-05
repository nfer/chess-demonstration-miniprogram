/* eslint-disable import/prefer-default-export */

import { KeyInfo } from "../interface/index";

const IDX_NAME = [
    ['九', '八', '七', '六', '五', '四', '三', '二', '一'],
    ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
];

const RANGE_NAME = [
    ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
];

export const getStep = (keyInfo: KeyInfo, keyInfos: Array<KeyInfo>, x: number, y: number) => {
    // console.log(keyInfo.x, keyInfo.y, x, y);
    let type = '';
    let from = '';
    let to = '';
    const idxNames = IDX_NAME[keyInfo.type];
    const rangeNames = RANGE_NAME[keyInfo.type];

    if (y === keyInfo.y) {
        type = '平';
        from = `${keyInfo.name}${idxNames[keyInfo.x]}`;
        to = idxNames[x];
    } else if (['r', 'R', 'c', 'C', 'p', 'P', 'k', 'K'].includes(keyInfo.key)) {
        from = `${keyInfo.name}${idxNames[keyInfo.x]}`;
        if (keyInfo.type) {
            type = y < keyInfo.y ? '退' : '进';
        } else {
            type = y < keyInfo.y ? '进' : '退';
        }
        const range = Math.abs(y - keyInfo.y);
        to = rangeNames[range];
    } else {
        from = `${keyInfo.name}${idxNames[keyInfo.x]}`;
        if (keyInfo.type) {
            type = y < keyInfo.y ? '退' : '进';
        } else {
            type = y < keyInfo.y ? '进' : '退';
        }
        to = idxNames[x];
    }

    const sameKeys = keyInfos
        .filter(item => item.key === keyInfo.key && item.x === keyInfo.x)
        .sort((a, b) => a.type ? b.y - a.y : a.y - b.y);
    // console.log(sameKeys.length, sameKeys);
    if (sameKeys.length > 1) {
        if (sameKeys[0].hash === keyInfo.hash) {
            from = `前${keyInfo.name}`;
        } else if (sameKeys[sameKeys.length - 1].hash === keyInfo.hash) {
            from = `后${keyInfo.name}`;
        } else {
            from = `中${keyInfo.name}`;
        }
    }
    return `${from}${type}${to}`;
};
