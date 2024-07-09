import { timeToSecond, secondToTime, clamp } from '@/utils/common';

type SubtitleProps = {
    start: number;
    end: number;
    text: string;
};

export default class SubtitleTimeLine {
    start: number;
    end: number;
    text: string;

    constructor({ start, end, text }: SubtitleProps) {
        this.start = start;
        this.end = end;
        this.text = text;
    }

}