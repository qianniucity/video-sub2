import { timeToSecond, secondToTime, clamp } from '@/utils/common';

type SubtitleProps = {
    start: string;
    end: string;
    text: string;
};

export default class Subtitle {
    start: string;
    end: string;
    text: string;
    editing?: boolean; // 是否正在编辑
    highlight?: boolean; // 是否高亮

    constructor({ start, end, text }: SubtitleProps) {
        this.start = start;
        this.end = end;
        this.text = text;
        this.editing = false;
        this.highlight = false;
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
        console.log("this.start", this.start)
        console.log("this.end", this.end)

        // if (!this.start || !this.end) {
        //     return '00:00:00.000';
        // }
        console.log("this.text", this.text)
        console.log("this.endTime", this.endTime);
        console.log("this.startTime", this.startTime);
        console.log('duration', (this.endTime - this.startTime).toFixed(3));
        return (this.endTime - this.startTime).toFixed(3);
    }
}