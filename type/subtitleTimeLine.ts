type SubtitleProps = {
    start: number;
    end: number;
    text: string;
};

/**
 * 时间线字幕类，包含开始时间、结束时间、文本内容属性
 */
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