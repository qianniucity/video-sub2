"use client"

import React, { useRef } from 'react';



interface PlayerProps {
    videoUrl: string;
    subtitleUrl?: string;
    updateCurrentTime?: (time: number) => void;
    getArt?: () => void;
}

const Player: React.FC<PlayerProps> = ({ videoUrl, subtitleUrl, updateCurrentTime, getArt }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const playVideo = () => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    const pauseVideo = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    return (
        <div>
            <video ref={videoRef} width="640" height="480" controls >
                <source src={videoUrl} type="video/mp4" />
                <track
                    src="/video/ap.vtt"
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                />
                <track
                    src="/video/ap.vtt"
                    kind="subtitles"
                    srcLang="zh"
                    label="Chinese"
                />
            </video>
        </div >
    );
};

export default Player;