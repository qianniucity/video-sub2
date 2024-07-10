import React from 'react';

interface VideoPlayerProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    videoUrl: string;
    subtitleUrl?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoRef, videoUrl, subtitleUrl }) => {
    return (
        <video
            ref={videoRef}
            src={videoUrl}
            controls
            playsInline
            style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'block' }}
        >
            <track
                src={subtitleUrl}
                kind="captions"
                srcLang="en"
                label="English"
                default
            />
        </video>
    );
}

export default VideoPlayer;