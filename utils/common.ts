// 引入类型定义，以便更好地与TypeScript集成
import Subtitle from '@/type/subtitle';
import { DT } from './time-conversion';

// 检查时间格式是否正确
export function checkTime(time: string): boolean {
    return /^(\d+):([0-5][0-9]):([0-5][0-9])\.\d{3}$/.test(time);
}

// 检查当前设备是否为移动设备
export function isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 从URL中获取文件扩展名
export function getExt(url: string): string {
    if (url.includes('?')) {
        return getExt(url.split('?')[0]);
    }

    if (url.includes('#')) {
        return getExt(url.split('#')[0]);
    }

    return url
        .trim()
        .toLowerCase()
        .split('.')
        .pop()!;
}

// 异步等待一段时间
export function sleep(ms: number = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 将数字限制在指定的范围内
export function clamp(num: number, a: number, b: number): number {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

// 将秒数转换为时间格式
export function secondToTime(seconds: number = 0): string {
    return DT.d2t(seconds.toFixed(3));
}

// 将时间格式转换为秒数
export function timeToSecond(time: string): number {
    return DT.t2d(time);
}

// 函数防抖
export function debounce(func: (...args: any[]) => void, wait: number, context?: any): (...args: any[]) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return function fn(...args: any[]) {
        const later = function later() {
            timeout = null;
            func.apply(context, args);
        };
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

export function convertToSrtFormat(subtitles: Subtitle[]): string {
    return subtitles
        .map((subtitle, index) => {
            console.log("subtitle", subtitle)
            const start = subtitle.start;
            const end = subtitle.end;

            return `${index + 1}\n${start} --> ${end}\n${subtitle.text}\n`;
        })
        .join('\n');
}