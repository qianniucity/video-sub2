"use client"

import React, { useRef, useState } from 'react';
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



    return (
        <div className="video-page">
            <div className="top-section" style={{ display: 'flex', flexDirection: 'row' }}>
                <div className="player" style={{ flexBasis: '50%' }}>
                    <VideoPlayer videoRef={videoRef} videoUrl={videoUrl} subtitleUrl={subtitleUrl} />
                </div>
                <div className="subtitle-editor" style={{ flexBasis: '50%' }}>
                    <SubtitleUpload subtitleContent={subtitleContent} setSubtitleContent={setSubtitleContent} setSubtitleUrl={setSubtitleUrl} setSubtitles={setSubtitles} />
                    <br />
                    <SubtitleTable subtitles={subtitles} setSubtitles={setSubtitles} setSubtitleUrl={setSubtitleUrl} wavesurferState={wavesurferState} />
                </div>
            </div>
            <div className="bottom-section">
                <WaveformViewer videoRef={videoRef} videoUrl={videoUrl} subtitles={subtitles} setWavesurferState={setWavesurferState} />
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