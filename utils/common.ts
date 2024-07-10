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
// 从文件名称中获取文件扩展名前的名称
export function getName(url: string): string {
    if (url.includes('?')) {
        return getName(url.split('?')[0]);
    }

    if (url.includes('#')) {
        return getName(url.split('#')[0]);
    }

    return url
        .trim()
        .toLowerCase()
        .split('.')
        .shift()!;
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

// 生成一个介于 min 和 max 之间的随机数
export function random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

// 生成一个随机的 RGBA 颜色字符串
export function randomColor(): string {
    return `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`;
}

/**
 * 处理视频文件并获取其URL
 * @param file 文件对象
 * @param type 返回文件类型 url | text, 默认为 text
 * @returns Promise<string> 返回一个Promise，解析为视频文件的URL
 */
export function processMediaFileAndGetUrl(file: File, type: string = 'text'): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No file provided");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            // 当文件读取成功，将结果转换为string并解析Promise
            resolve(reader.result as string);
        };
        reader.onerror = error => {
            // 如果读取过程中发生错误，拒绝Promise
            reject(error);
        };
        if (type === 'url') {
            // 以DataURL的形式读取文件内容
            reader.readAsDataURL(file);
        } else {
            // 以文本形式读取文件内容
            reader.readAsText(file);
        }
    });
};
