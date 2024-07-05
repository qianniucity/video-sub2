import { timeToSecond, secondToTime, clamp } from './common';

type SubProps = {
    start: string;
    end: string;
    text: string;
};

export default class Sub {
    start: string;
    end: string;
    text: string;
    editing?: boolean;
    highlight?: boolean;

    constructor({ start, end, text }: SubProps) {
        this.start = start;
        this.end = end;
        this.text = text;
        this.editing = false;
        this.highlight = false;
    }

    get check(): boolean {
        return this.startTime >= 0 && this.endTime >= 0 && this.startTime < this.endTime && this.text.trim().length > 0;
    }

    get clone(): Sub {
        return new Sub({ start: this.start, end: this.end, text: this.text });
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