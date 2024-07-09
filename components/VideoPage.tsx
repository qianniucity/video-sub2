"use client"

import React, { useEffect, useRef, useState } from 'react';
import SubtitleUpload from './SubtitleUpload';
import VideoPlayer from './VideoPlayer';
import WaveformViewer from './WaveformViewer';
import SubtitleTable from './SubtitleTable';
import Subtitle from '@/type/subtitle';
import WaveSurfer from 'wavesurfer.js';

interface VideoPageProps {
    videoUrl?: string;
    subtitleUrl?: string;
}

const defaultVideoUrl = '/video/video.mp4';
const defaultSubtitleUrl = '/video/ap.vtt';

const VideoPage: React.FC = () => {

    const videoRef = useRef<HTMLVideoElement>(null);
    const [subtitleContent, setSubtitleContent] = useState('');
    const [subtitleUrl, setSubtitleUrl] = useState(defaultSubtitleUrl);
    const [timeline, setTimeline] = useState('');
    const [videoUrl, setVideoUrl] = useState(defaultVideoUrl);
    const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
    const [wavesurferState, setWavesurferState] = useState<WaveSurfer>();
    const [subtitle, setSubtitle] = useState<Subtitle>(new Subtitle({ start: '', end: '', text: '' }));
    const [currentTimeLineContent, setCurrentTimeLineContent] = useState<Subtitle>(new Subtitle({ start: '', end: '', text: '' }));
    const [scrollIndex, setScrollIndex] = useState(-1)

    useEffect(() => {
        // console.log("init VideoPage");


    }, []);


    return (
        <div className="video-page">
            <div className="top-section" style={{ display: 'flex', flexDirection: 'row' }}>
                <div className="player" style={{ flexBasis: '50%' }}>
                    <VideoPlayer videoRef={videoRef} videoUrl={videoUrl} subtitleUrl={subtitleUrl} />
                </div>
                <div className="subtitle-editor" style={{ flexBasis: '50%' }}>
                    <SubtitleUpload subtitleContent={subtitleContent} setSubtitleContent={setSubtitleContent} setSubtitleUrl={setSubtitleUrl} setSubtitles={setSubtitles} subtitles={subtitles}/>
                    <br />
                    <SubtitleTable subtitles={subtitles} setSubtitles={setSubtitles} setSubtitleUrl={setSubtitleUrl} wavesurferState={wavesurferState} subtitle={subtitle} setSubtitle={setSubtitle} currentTimeLineContent={currentTimeLineContent} scrollIndex={scrollIndex} />
                </div>
            </div>
            <div className="bottom-section">
                <WaveformViewer videoRef={videoRef} videoUrl={videoUrl} subtitles={subtitles} wavesurferState={wavesurferState} setWavesurferState={setWavesurferState} subtitle={subtitle} setCurrentTimeLineContent={setCurrentTimeLineContent} setScrollIndex={setScrollIndex} />
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