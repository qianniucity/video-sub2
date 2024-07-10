import { timeToSecond, secondToTime, clamp } from '@/utils/common';

type SubtitleProps = {
    start: string;
    end: string;
    text: string;
    editing?: boolean;
    highlight?: boolean;
};

/**
 * Table 列表字幕类，包含开始时间、结束时间、文本内容、是否正在编辑、是否高亮等属性
 */
export default class Subtitle {
    start: string;
    end: string;
    text: string;
    editing?: boolean; // 是否正在编辑
    highlight?: boolean; // 是否高亮

    constructor({ start, end, text, editing = false, highlight = false }: SubtitleProps) {
        this.start = start;
        this.end = end;
        this.text = text;
        this.editing = editing;
        this.highlight = highlight;
    }

    get check(): boolean {
        return this.startTime >= 0 && this.endTime >= 0 && this.startTime < this.endTime && this.text.trim().length > 0;
    }

    get clone(): Subtitle {
        return new Subtitle({ start: this.start, end: this.end, text: this.text });
    }

    get startTime(): number {
        return timeToSecond(this.start);
    }

    set startTime(time: number) {
        this.start = secondToTime(clamp(time, 0, Infinity));
    }

    get endTime(): number {
        return timeToSecond(this.end);
    }

    set endTime(time: number) {
        this.end = secondToTime(clamp(time, 0, Infinity));
    }

    get duration(): string {
        return (this.endTime - this.startTime).toFixed(3);
    }
}