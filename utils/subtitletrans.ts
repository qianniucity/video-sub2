import assToVtt from './assToVtt';
import Sub from './sub';
import { getExt, secondToTime } from './common';

export async function urlToArr(url: string): Promise<Sub[]> {
    if (typeof window === 'undefined') {
        throw new Error('urlToArr can only be used in the browser');
    }
    return new Promise((resolve, reject) => {
        const $video = document.createElement('video');
        const $track = document.createElement('track');
        $track.default = true;
        $track.kind = 'metadata';
        $video.appendChild($track);
        $track.onerror = error => {
            reject(error);
        };
        $track.onload = () => {
            resolve(
                Array.from($track.track.cues as TextTrackCueList).map(item => {
                    const start = secondToTime(item.startTime);
                    const end = secondToTime(item.endTime);
                    const text = (item as TextTrackCue & { text: string }).text;
                    return new Sub({ start, end, text });
                }),
            );
        };
        $track.src = url;
    });
}
//创建vtt字幕的Blob对象 方便track分析 参数为vtt格式的字符串 返回该对象的url
export function vttToUrl(vttText: string): string {
    return URL.createObjectURL(
        new Blob([vttText], {
            type: 'text/vtt',
        }),
    );
}

export function vttToUrlWorker(): string {
    return URL.createObjectURL(
        new Blob([
            `onmessage = event => {
                postMessage(URL.createObjectURL(
                    new Blob([
                        \`WEBVTT

                        \${event.data.map((item: { start: string; end: string; text: string }, index: number) => \`
                        \${index + 1}
                        \${item.start} --> \${item.end}
                        \${item.text}\`).join('\\n\\n')}
                        \`
                    ], {
                        type: 'text/vtt',
                    }),
                ))
            }`,
        ]),
    );
}

export function arrToVtt(arr: { start: string; end: string; text: string }[]): string {
    return (
        'WEBVTT\n\n' +
        arr
            .map((item, index) => {
                return `${index + 1}\n${item.start} --> ${item.end}\n${item.text}`;
            })
            .join('\n\n')
    );
}

export function srtToVtt(srtText: string): string {
    return 'WEBVTT \r\n\r\n'.concat(
        srtText
            .replace(/^\d+\s*\r?\n/gm, '') // 修改的代码行，用于移除数字序号所在的行
            .replace(/\{\\([ibu])\}/g, '</$1>')
            .replace(/\{\\([ibu])1\}/g, '<$1>')
            .replace(/\{([ibu])\}/g, '<$1>')
            .replace(/\{\/([ibu])\}/g, '</$1>')
            .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
            .replace(/{[\s\S]*?}/g, '')
            .concat('\r\n\r\n'),
    );
}

export async function readSubtitleFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const type = getExt(file.name);
        reader.onload = () => {
            const result = reader.result as string;
            if (type === 'srt') {
                resolve(srtToVtt(result));
            } else if (type === 'ass') {
                resolve(assToVtt(result));
            } else {
                resolve(result.replace(/{[\s\S]*?}/g, ''));
            }
        };
        reader.onerror = error => {
            reject(error);
        };
        reader.readAsText(file);
    });
}

export async function readSubtitleFromUrl(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const type = getExt(url);
        if (type === 'srt') {
            return srtToVtt(text);
        }
        if (type === 'ass') {
            return assToVtt(text);
        }
        return text.replace(/{[\s\S]*?}/g, '');
    } catch (error) {
        throw error;
    }
}

export function downloadFile(url: string, name: string): void {
    if (typeof window === 'undefined') {
        throw new Error('downloadFile can only be used in the browser');
    }
    const elink = document.createElement('a');
    elink.style.display = 'none';
    elink.href = url;
    elink.download = name;
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
}

export function escapeHTML(str: string): string {
    return str.replace(
        /[&<>'"]/g,
        tag =>
        ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;',
        }[tag] || tag),
    );
}

export function unescapeHTML(str: string): string {
    return str.replace(
        /&amp;|&lt;|&gt;|&#39;|&quot;/g,
        tag =>
        ({
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&#39;': "'",
            '&quot;': '"',
        }[tag] || tag),
    );
}

export function getSearchParams(name: string): string {
    if (typeof window === 'undefined') {
        return '';
    }
    const locationUrl = new URL(window.location.href);
    return decodeURIComponent(locationUrl.searchParams.get(name) || '');
}