"use client"

import React, { useRef, useState } from 'react';
import VideoPlayer from './videoPlayer';
import SubtitleTable from './subtitleTable';
import Subtitle from '@/type/subtitle';
import Console from './console';
import Menu from './menu';
import { WaveSurferProvider } from './waveSurferContext';
import WaveformViewer from './waveformViewer';

const defaultVideoUrl = '/video/video.mp4';
const defaultSubtitleUrl = '/video/ap.vtt';

/**
 * 视频页面组件，包含视频播放器、字幕编辑器、波形图，以及相关状态管理，
 * 如字幕内容、字幕URL、视频URL、字幕数组、波形图状态、当前字幕、滚动索引等
 * @component
 */
const VideoPage: React.FC = () => {

    const videoRef = useRef<HTMLVideoElement>(null);// 用于引用视频元素
    const [subtitleUrl, setSubtitleUrl] = useState<string>(defaultSubtitleUrl);// 字幕URL
    const [videoUrl, setVideoUrl] = useState<string>(defaultVideoUrl);// 视频URL
    const [subtitles, setSubtitles] = useState<Subtitle[]>([]);// 字幕数组
    const [subtitle, setSubtitle] = useState<Subtitle>(new Subtitle({ start: '', end: '', text: '' })); // 当前字幕 
    const [scrollIndex, setScrollIndex] = useState(-1);// 滚动索引  默认为-1


    const [fontSize, setFontSize] = useState(30);
    const [lineHeight, setLineHeight] = useState(16);
    const [showTextShadow, setShowTextShadow] = useState(false);
    const [subtitleColor, setSubtitleColor] = useState('#FFFFFF'); // 默认颜色为白色
    const [showBackgroundColor, setShowBackgroundColor] = useState(false);

    return (
        <div >
            <Menu setSubtitleUrl={setSubtitleUrl} setSubtitles={setSubtitles} subtitles={subtitles} setVideoUrl={setVideoUrl} />
            <div className="border-t border-gray-200" ></div>
            <WaveSurferProvider videoRef={videoRef} videoUrl={videoUrl}>
                <div className="flex flex-wrap mt-2">
                    <div className="w-full md:w-1/2">
                        <VideoPlayer
                            videoRef={videoRef}
                            videoUrl={videoUrl}
                            subtitleUrl={subtitleUrl}
                            fontSize={fontSize}
                            lineHeight={lineHeight}
                            showTextShadow={showTextShadow}
                            subtitleColor={subtitleColor}
                            showBackgroundColor={showBackgroundColor}
                        />
                        <Console
                            fontSize={fontSize}
                            setFontSize={setFontSize}
                            lineHeight={lineHeight}
                            setLineHeight={setLineHeight}
                            showTextShadow={showTextShadow}
                            setShowTextShadow={setShowTextShadow}
                            subtitleColor={subtitleColor}
                            setSubtitleColor={setSubtitleColor}
                            showBackgroundColor={showBackgroundColor}
                            setShowBackgroundColor={setShowBackgroundColor}
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                        <SubtitleTable subtitles={subtitles} setSubtitles={setSubtitles} setSubtitleUrl={setSubtitleUrl} subtitle={subtitle} setSubtitle={setSubtitle} scrollIndex={scrollIndex} />
                    </div>
                </div>
                <div className="">
                    <WaveformViewer subtitles={subtitles} setScrollIndex={setScrollIndex} />
                </div>
            </WaveSurferProvider>
        </div>
    );
};

export default VideoPage;