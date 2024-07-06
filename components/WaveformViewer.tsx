import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import subtitles from "../public/video/subtitle.json";
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.esm.js'

interface WaveformViewerProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    videoUrl: string;
}

const WaveformViewer: React.FC<WaveformViewerProps> = ({ videoRef, videoUrl }) => {
    const waveSurferRef = useRef<WaveSurfer>(); // 用于引用WaveSurfer实例
    const waveContainerRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const initializeWaveSurfer = () => {
        if (!videoRef.current || !waveContainerRef.current) return;

        const topTimeline = TimelinePlugin.create({
            height: 25,
            insertPosition: 'beforebegin',
            timeInterval: 1,
            primaryLabelInterval: 10,
            secondaryLabelInterval: 1,
            style: {
                fontSize: '10px',
                color: '#2D5B88',
            },
        });

        const bottomTimeline = TimelinePlugin.create({
            height: 15,
            timeInterval: 0.5,
            primaryLabelInterval: 5,
            style: {
                fontSize: '10px',
                color: '#6A3274',
            },
        });

        const ws = waveSurferRef.current = WaveSurfer.create({
            container: waveContainerRef.current,
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            cursorColor: '#672fbc',
            // hideScrollbar: true,
            autoScroll: true,
            autoCenter: true,
            normalize: true,
            media: videoRef.current,
            url: videoUrl,
            plugins: [topTimeline, bottomTimeline],
            minPxPerSec: 50,
        });
        return ws;
    };
    const createZoom = (ws: WaveSurfer) => {
        // Initialize the Zoom plugin
        ws.registerPlugin(
            ZoomPlugin.create({
                // the amount of zoom per wheel step, e.g. 0.5 means a 50% magnification per scroll
                scale: 0.5,
                // Optionally, specify the maximum pixels-per-second factor while zooming
                maxZoom: 200,
            }),
        )
    };

    const createRegions = (ws: WaveSurfer) => {
        const wsRegions = ws.registerPlugin(RegionsPlugin.create());

        // 添加字幕区域
        ws.on('decode', () => {
            subtitles.forEach((subtitle) => {
                wsRegions.addRegion({
                    start: subtitle.start,
                    end: subtitle.end,
                    content: subtitle.content,
                    resize: true,
                    // channelIdx: 1,
                    contentEditable: true,
                });
            });
        });

        // 允许在波形上添加区域
        // wsRegions.enableDragSelection({
        //   color: 'rgba(255, 0, 0, 0.1)',
        // });

        wsRegions.on('region-updated', (region) => {
            console.log('Updated region', region);
        });
    };


    useEffect(() => {
        const ws = initializeWaveSurfer();
        if (ws) createRegions(ws);
        if (ws) createZoom(ws);

        return () => waveSurferRef.current?.destroy();
    }, [initializeWaveSurfer, videoUrl]);

    return (
        < div ref={waveContainerRef} style={{ width: '100%', margin: '20px auto' }} />
    );
}

export default WaveformViewer;