// 共享变量

import Subtitle from "@/type/subtitle";
import { atom } from "jotai"
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";

const defaultVideoUrl = '/video/video.mp4';
const defaultSubtitleUrl = '/video/ap.vtt';

// 公共变量
export const originalFileNameAtom = atom<string>("defaultName")// 字幕文件名

// 视频字幕地址
export const videoUrlAtom = atom<string>(defaultVideoUrl);// 视频URL
export const subtitleUrlAtom = atom<string>(defaultSubtitleUrl);// 字幕URL

// 字幕内容
export const subtitlesAtom = atom<Subtitle[]>([]);// 字幕数组
export const subtitleAtom = atom<Subtitle>(new Subtitle({ start: '', end: '', text: '' })); // 当前字幕 
export const scrollIndexAtom = atom(-1);// 滚动索引  默认为-1
export const subtitleContentAtom = atom<string>("")// 管理字幕原始内容
export const historyAtom = atom<Subtitle[][]>([]);// 字幕历史记录



// 字幕样式
export const fontSizeAtom = atom(30);
export const lineHeightAtom = atom(16);
export const showTextShadowAtom = atom(false);
export const subtitleColorAtom = atom('#FFFFFF'); // 默认颜色为白色
export const showBackgroundColorAtom = atom(false);


// 字幕编辑器
export const waveSurferAtom = atom<WaveSurfer | null>(null);
export const wsRegionsAtom = atom<RegionsPlugin>({} as RegionsPlugin);// 区域插件


// 控件
export const activeTabAtom = atom<string>('#subtitles-type');// 当前激活的标签