"use client"

import React, { useEffect, useRef, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import WaveformViewer from './WaveformViewer';
import SubtitleTable from './SubtitleTable';
import Subtitle from '@/type/subtitle';
import WaveSurfer from 'wavesurfer.js';
import FileUpload from './media/fileUpload';

const defaultVideoUrl = '/video/video.mp4';
const defaultSubtitleUrl = '/video/ap.vtt';

/**
 * VideoPage component displays a video player, a subtitle editor, and a waveform viewer.
 * @component
 */
const VideoPage: React.FC = () => {

    const videoRef = useRef<HTMLVideoElement>(null);// 用于引用video元素
    const [subtitleContent, setSubtitleContent] = useState('');// 使用 useState 管理 'subtitleContent' 状态
    const [subtitleUrl, setSubtitleUrl] = useState(defaultSubtitleUrl);// 使用 useState 管理 'subtitleUrl' 状态
    const [videoUrl, setVideoUrl] = useState(defaultVideoUrl);// 使用 useState 管理 'videoUrl' 状态
    const [subtitles, setSubtitles] = useState<Subtitle[]>([]);// 使用 useState 管理 'subtitles' 状态
    const [wavesurferState, setWavesurferState] = useState<WaveSurfer>();// 使用 useState 管理 'wavesurferState' 状态
    const [subtitle, setSubtitle] = useState<Subtitle>(new Subtitle({ start: '', end: '', text: '' }));// 使用 useState 管理 'subtitle' 状态
    const [scrollIndex, setScrollIndex] = useState(-1)

    return (
        <div className="video-page">
            <div className="top-section" style={{ display: 'flex', flexDirection: 'row' }}>
                <div className="player" style={{ flexBasis: '50%' }}>
                    <VideoPlayer videoRef={videoRef} videoUrl={videoUrl} subtitleUrl={subtitleUrl} />
                </div>
                <div className="subtitle-editor" style={{ flexBasis: '50%' }}>
                    <FileUpload subtitleContent={subtitleContent} setSubtitleContent={setSubtitleContent} setSubtitleUrl={setSubtitleUrl} setSubtitles={setSubtitles} subtitles={subtitles} setVideoUrl={setVideoUrl} />
                    <br />
                    <SubtitleTable subtitles={subtitles} setSubtitles={setSubtitles} setSubtitleUrl={setSubtitleUrl} wavesurferState={wavesurferState} subtitle={subtitle} setSubtitle={setSubtitle} scrollIndex={scrollIndex} />
                </div>
            </div>
            <div className="bottom-section">
                <WaveformViewer videoRef={videoRef} videoUrl={videoUrl} subtitles={subtitles} setWavesurferState={setWavesurferState} setScrollIndex={setScrollIndex} />
            </div>
            <style jsx>{`
                .video-page {
                    display: flex;
                    flex-direction: column;
                }
                .top-section {
                    flex: 1;
                }
                .bottom-section {
                    width: 100%;
                }
            `}</style>
        </div>
    );
};

export default VideoPage;