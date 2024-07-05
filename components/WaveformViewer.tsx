import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';

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
            waveColor: 'violet',
            progressColor: 'purple',
            cursorColor: '#672fbc',
            hideScrollbar: true,
            media: videoRef.current,
            url: videoUrl,
            plugins: [topTimeline, bottomTimeline],

        });

        return ws;
    };

    const createRegions = (ws: WaveSurfer) => {
        const wsRegions = ws.registerPlugin(RegionsPlugin.create());

        ws.on('decode', () => {
            wsRegions.addRegion({
                id: "1",
                start: 0,
                end: 5.0123123123,
                content: 'Resize me12123123123132132',
                resize: true,
                channelIdx: 1,
                contentEditable: true,
            });
            wsRegions.addRegion({
                id: "2",
                start: 9,
                end: 12,
                content: 'Cramped region12312313212323',
                resize: true,
                channelIdx: 1,
                contentEditable: true,
            });
            wsRegions.addRegion({
                id: "3",
                start: 20,
                end: 27,
                content: 'Drag me',
                resize: true,
                channelIdx: 1,
                contentEditable: true,
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

        return () => waveSurferRef.current?.destroy();
    }, [initializeWaveSurfer, videoUrl]);

    return (
        < div ref={waveContainerRef} style={{ width: '100%', margin: '20px auto' }} />
    );
}

export default WaveformViewer;