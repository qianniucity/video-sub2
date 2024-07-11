"use client"

import React, { useEffect, useRef, useState } from 'react';
import VideoPlayer from './videoPlayer';
import WaveformViewer from './waveformViewer';
import SubtitleTable from './subtitleTable';
import Subtitle from '@/type/subtitle';
import WaveSurfer from 'wavesurfer.js';
import FileUpload from './media/fileUpload';

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
    const [wavesurferState, setWavesurferState] = useState<WaveSurfer>();// 波形图状态
    const [subtitle, setSubtitle] = useState<Subtitle>(new Subtitle({ start: '', end: '', text: '' })); // 当前字幕 
    const [scrollIndex, setScrollIndex] = useState(-1);// 滚动索引  默认为-1

    return (
        <div >
            <div className="flex flex-wrap  mt-2">
                <div className="w-full md:w-1/2">
                    <VideoPlayer videoRef={videoRef} videoUrl={videoUrl} subtitleUrl={subtitleUrl} />
                </div>
                <div className="w-full md:w-1/2">
                    <FileUpload setSubtitleUrl={setSubtitleUrl} setSubtitles={setSubtitles} subtitles={subtitles} setVideoUrl={setVideoUrl} />
                    <br />
                    <SubtitleTable subtitles={subtitles} setSubtitles={setSubtitles} setSubtitleUrl={setSubtitleUrl} wavesurferState={wavesurferState} subtitle={subtitle} setSubtitle={setSubtitle} scrollIndex={scrollIndex} />
                </div>
            </div>
            <div className="">
                <WaveformViewer videoRef={videoRef} videoUrl={videoUrl} subtitles={subtitles} wavesurferState={wavesurferState} setWavesurferState={setWavesurferState} setScrollIndex={setScrollIndex} />
            </div>
        </div>
    );
};

export default VideoPage;