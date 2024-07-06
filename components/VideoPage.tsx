"use client"

import React, { useRef } from 'react';
import Player from './Player';
import SubtitleEditor from './SubtitleEditor';
import TimelineDisplay from './TimelineDisplay';
import { Timeline } from '../type/Timeline';
import VideoPlayer from './VideoPlayer';
import WaveformViewer from './WaveformViewer';
import SubtitleTable from './SubtitleTable';

interface VideoPageProps {
    timeline?: Timeline;
    videoUrl: string;
    subtitleUrl?: string;
}

const VideoPage: React.FC<VideoPageProps> = ({ videoUrl, subtitleUrl }) => {

    const timeline = new Timeline();
    timeline.addSubtitle('00:00:01,000', '00:00:05,000', 'Hello, world!');
    console.log(timeline.getSubtitles());

    const videoRef = useRef<HTMLVideoElement>(null);

    return (
        <div className="video-page">
            <div className="top-section" style={{ display: 'flex', flexDirection: 'row' }}>
                <div className="player" style={{ flexBasis: '70%' }}>
                    <VideoPlayer videoRef={videoRef} videoUrl={videoUrl} subtitleUrl={subtitleUrl} />

                </div>
                {/* <div className="subtitle-editor" style={{ flexBasis: '30%' }}>
                    <SubtitleEditor />
                </div> */}
                <div className="subtitle-editor" style={{ flexBasis: '30%' }}>
                    <SubtitleTable />
                </div>
            </div>
            <div className="bottom-section">
                <WaveformViewer videoRef={videoRef} videoUrl={videoUrl} />
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