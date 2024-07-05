import React, { useRef } from 'react';

interface VideoPlayerProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoRef, videoUrl }) => {
    return (
        <video
            ref={videoRef}
            src={videoUrl}
            controls
            playsInline
            style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'block' }}
        >
            <track
                src="/video/ap.vtt"
                kind="subtitles"
                srcLang="en"
                label="English" />
        </video>
    );
}

export default VideoPlayer;