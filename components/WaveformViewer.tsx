import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
import Subtitle from '@/type/subtitle';
import SubtitleTimeLine from '@/type/subtitleTimeLine';
import { randomColor, timeToSecond } from '@/utils/common';

interface WaveformViewerProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    videoUrl: string;
    subtitles: Subtitle[];
    setWavesurferState?: (wavesurfer: WaveSurfer) => void;
    setScrollIndex: (scrollIndex: number) => void;
}

/**
 * WaveformViewer component displays a waveform visualization of a video's audio.
 * It allows zooming, adding regions, and handling subtitles.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.RefObject} props.videoRef - The reference to the video element.
 * @param {string} props.videoUrl - The URL of the video.
 * @param {Array} props.subtitles - The array of subtitle objects.
 * @param {Function} props.setWavesurferState - The function to set the WaveSurfer state.
 * @param {Function} props.setScrollIndex - The function to set the scroll index.
 * @returns {JSX.Element} The WaveformViewer component.
 */

const WaveformViewer: React.FC<WaveformViewerProps> = ({ videoRef, videoUrl, subtitles, setWavesurferState, setScrollIndex }) => {
    const waveSurferRef = useRef<WaveSurfer>(); // 用于引用WaveSurfer实例
    const waveContainerRef = useRef<HTMLDivElement>(null);// 用于引用waveContainer元素
    const sliderRef = useRef<HTMLInputElement>(null);// 用于引用slider元素
    const [loop, setLoop] = useState(false); // 使用 useState 管理 'loop' 状态
    const [processedSubtitlesTimeLine, setProcessedSubtitlesTimeLine] = useState<SubtitleTimeLine[]>([]);// 使用 useState 管理 'processedSubtitlesTimeLine' 状态



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

        const hoverLine = Hover.create({
            lineColor: '#ff0000',
            lineWidth: 2,
            labelBackground: '#555',
            labelColor: '#fff',
            labelSize: '11px',
        });

        // Register the plugin
        const minimap = Minimap.create({
            height: 20,
            waveColor: '#ddd',
            progressColor: '#999',
            // the Minimap takes all the same options as the WaveSurfer itself
        });

        const ws = waveSurferRef.current = WaveSurfer.create({
            container: waveContainerRef.current,
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            cursorColor: '#672fbc',
            height: 50,
            // hideScrollbar: true,
            barWidth: 2,
            autoScroll: true,
            autoCenter: true,
            normalize: true,
            dragToSeek: true,
            media: videoRef.current,
            url: videoUrl,
            plugins: [topTimeline, bottomTimeline, hoverLine, minimap],
            minPxPerSec: 200,
        });
        return ws;
    };

    const createZoom = (ws: WaveSurfer) => {
        // Update the zoom level on slider change
        ws.once('decode', () => {
            const handleInput = (e: Event) => {
                const target = e.target as HTMLInputElement;
                const minPxPerSec = target.valueAsNumber;
                ws.zoom(minPxPerSec);
            };

            const slider = sliderRef.current;
            if (slider) {
                slider.addEventListener('input', handleInput);
            }

            // Return a cleanup function to remove the event listener
            return () => {
                if (slider) {
                    slider.removeEventListener('input', handleInput);
                }
            };
        });
    };

    const createRegions = (ws: WaveSurfer) => {
        const wsRegions = ws.registerPlugin(RegionsPlugin.create());

        // 添加字幕区域
        ws.on('decode', () => {
            processedSubtitlesTimeLine.forEach((subtitle, index) => {
                wsRegions.addRegion({
                    id: index.toString(),
                    start: subtitle.start,
                    end: subtitle.end,
                    content: subtitle.text,
                    color: randomColor(),
                    resize: true,
                    // contentEditable: true,
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

        wsRegions.on('region-in', (region) => {
            // console.log("region-in-id", region.id)
            setScrollIndex(Number(region.id))
        })
        wsRegions.on('region-out', (region) => {
            // console.log('region-out', region)
        })
        wsRegions.on('region-clicked', (region, e) => {
            e.stopPropagation() // prevent triggering a click on the waveform
            // region.play()
            // console.log("region-clicked-id", region.id)
            region.setOptions({ start: region.start, color: randomColor() })
            setScrollIndex(Number(region.id))
            // region.play()
            ws.setTime(region.start)

        })
    };


    useEffect(() => {
        const subtitlesTimeLine = subtitles.map((subtitle) => {
            const start = timeToSecond(subtitle.start);
            const end = timeToSecond(subtitle.end);
            return new SubtitleTimeLine({ start: start, end: end, text: subtitle.text });
        });
        setProcessedSubtitlesTimeLine(subtitlesTimeLine);
    }, [subtitles]);


    useEffect(() => {
        console.log("init ws");
        waveSurferRef.current?.destroy();

        const ws = initializeWaveSurfer();
        if (ws && setWavesurferState) {
            setWavesurferState(ws);
        }
        if (ws) createRegions(ws);
        if (ws) createZoom(ws);

    }, [processedSubtitlesTimeLine]);


    return (
        <>
            <div ref={waveContainerRef} style={{ width: '100%', margin: '20px auto' }} />
            <div className="flex">
                {/* <div className="flex items-center h-5">
                    <input
                        id="helper-checkbox"
                        aria-describedby="helper-checkbox-text"
                        type="checkbox"
                        defaultValue=""
                        onChange={handleLoop}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="ms-2 text-sm">
                    <label htmlFor="helper-checkbox" className="font-medium text-gray-900 dark:text-gray-300">当前字幕循环</label>
                    <p id="helper-checkbox-text" className="text-xs font-normal text-gray-500 dark:text-gray-300">勾选后，当前字幕会持续循环播放</p>
                </div> */}
                <div className="ms-2 text-sm">
                    <label>
                        音波缩放: <input ref={sliderRef} type="range" min="10" max="300" defaultValue="200" />
                    </label>
                </div>
            </div>
        </>
    );
}

export default React.memo(WaveformViewer);