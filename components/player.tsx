import React, { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import {
    fontSizeAtom,
    lineHeightAtom,
    showTextShadowAtom,
    showBackgroundColorAtom,
    subtitleColorAtom,
    subtitleUrlAtom,
    videoUrlAtom
} from '@/atoms/subtitle-atoms';


interface VideoPlayerProps {
    videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoRef }) => {
    const videoUrl = useAtomValue(videoUrlAtom);
    const subtitleUrl = useAtomValue(subtitleUrlAtom);
    const fontSize = useAtomValue(fontSizeAtom);
    const lineHeight = useAtomValue(lineHeightAtom);
    const showTextShadow = useAtomValue(showTextShadowAtom);
    const subtitleColor = useAtomValue(subtitleColorAtom);
    const showBackgroundColor = useAtomValue(showBackgroundColorAtom);

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            ::cue {
            visibility: visible;
                white-space: pre-line;
                color: ${subtitleColor}; 
                background-color: ${showBackgroundColor ? 'black' : 'transparent'};
                font-family: Arial, sans-serif;
                font-size: ${fontSize}px; 
                text-shadow: ${showTextShadow ? 'peachpuff 0 1px 1px' : 'none'}; 
                line-height: ${lineHeight}px;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, [fontSize, lineHeight, showTextShadow, subtitleColor, showBackgroundColor]); // 添加 fontSize 作为依赖项

    return (
        <>
            {videoUrl && (
                <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    playsInline
                    style={{
                        width: '100%',
                        margin: '0 auto',
                        display: 'block',
                    }}
                >
                    <track
                        src={subtitleUrl}
                        kind="captions"
                        srcLang="en"
                        label="English"
                        default
                    />
                </video>
            )}
        </>
    );
}

export default VideoPlayer;