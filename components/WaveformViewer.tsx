import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
import Subtitle from '@/type/subtitle';
import SubtitleTimeLine from '@/type/subtitleTimeLine';
import { randomColor, secondToTime, timeToSecond } from '@/utils/common';

interface WaveformViewerProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    videoUrl: string;
    subtitles: Subtitle[];
    wavesurferState?: WaveSurfer;
    setWavesurferState: (wavesurfer: WaveSurfer) => void;
    setScrollIndex: (scrollIndex: number) => void;
}

/**
 * 波形图组件，用于展示视频波形图，添加字幕区域，缩放功能，以及相关状态管理
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

const WaveformViewer: React.FC<WaveformViewerProps> = ({ videoRef, videoUrl, subtitles, wavesurferState, setWavesurferState, setScrollIndex }) => {
    const waveSurferRef = useRef<WaveSurfer>(); // 波形图引用
    const waveContainerRef = useRef<HTMLDivElement>(null);// 波形图容器引用
    const sliderRef = useRef<HTMLInputElement>(null);// 缩放滑块引用
    const [wsRegions, setWsRegions] = useState<RegionsPlugin>();


    /**
     * 初始化波形图，添加插件，设置参数，返回波形图实例
     * @returns  {WaveSurfer} ws - 波形图实例
     */
    const initializeWaveSurfer = () => {
        console.log("init ws");

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

        setWavesurferState(ws);
        return ws;
    };

    /**
     * 创建缩放功能，根据滑块的值更新缩放级别
     * @param ws - 波形图实例
     */
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

    /**
     * 初始化区域插件
     * @param ws 
     * @returns 
     */
    const initRegins = (ws: WaveSurfer) => {
        console.log("init Regions");
        if (!ws) return;
        const wsRegions = ws.registerPlugin(RegionsPlugin.create());
        setWsRegions(wsRegions)
    }


    /**
     * 字幕填充到波形图
     * 创建区域，根据字幕时间线创建区域，并添加到波形图
     * @param ws - 波形图实例
     */
    const createRegions = (subtitlesTimeLine: SubtitleTimeLine[]) => {

        if (!wavesurferState) return;

        if (!wsRegions) return;
        // 清除现有的所有区域,并取消所有区域监听
        wsRegions.clearRegions();
        wsRegions.unAll();

        // 添加字幕区域
        subtitlesTimeLine.forEach((subtitle, index) => {
            wsRegions.addRegion({
                id: index.toString(),
                start: subtitle.start,
                end: subtitle.end,
                content: subtitle.text,
                color: randomColor(),
                resize: true,
                // contentEditable: true, // 可编辑
            });
        });


        // 允许在波形上添加区域
        // wsRegions.enableDragSelection({
        //   color: 'rgba(255, 0, 0, 0.1)',
        // });


        // 添加区域事件监听
        wsRegions.on('region-updated', (region) => {
            console.log('Updated region', region);
            console.log('region-start', region.start);
            console.log('region-end', region.end);
            console.log('region-id', region.content);
            const subnew = new Subtitle({ start: secondToTime(region.start), end: secondToTime(region.end), text: region.content?.textContent ?? '' });
            console.log('region-updated-subnew', subnew);
            updateSubtitle(Number(region.id), subnew);
        });

        wsRegions.on('region-in', (region) => {
            // console.log("region-in-id", region.id)
            console.log("region-in", region.content)
            setScrollIndex(Number(region.id))
        })
        wsRegions.on('region-out', (region) => {
            console.log('region-out-id', region.id)
        })
        wsRegions.on('region-clicked', (region, e) => {
            e.stopPropagation() // prevent triggering a click on the waveform
            // region.play()
            console.log("region-clicked-id", region.id)
            region.setOptions({ start: region.start, color: randomColor() })
            setScrollIndex(Number(region.id))
            // region.play()
            wavesurferState.setTime(region.start)
        })
    };


    // 更新单个字幕
    // TODO 更新字幕数组，很多地方都监听，需要谨慎考虑
    const updateSubtitle = (index: number, sub: Subtitle) => {
        const subtitlesNew = [...subtitles];

        subtitlesNew[index] = sub;
        // setSubtitles(subtitlesNew);
    }

    // 监听波形图状态变化，更新字幕区域
    useEffect(() => {
        if (wavesurferState) {
            wavesurferState.on('ready', () => {
                createRegions(subtitles.map((subtitle) => {
                    const start = timeToSecond(subtitle.start);
                    const end = timeToSecond(subtitle.end);
                    return new SubtitleTimeLine({ start: start, end: end, text: subtitle.text });
                }));
            });
        }
    }, [wavesurferState]);


    // 监听字幕变化，更新字幕时间线
    useEffect(() => {
        const subtitlesTimeLine = subtitles.map((subtitle) => {
            const start = timeToSecond(subtitle.start);
            const end = timeToSecond(subtitle.end);
            return new SubtitleTimeLine({ start: start, end: end, text: subtitle.text });
        });
        createRegions(subtitlesTimeLine);
    }, [subtitles]);



    // 初始化波形图,添加插件，设置参数,返回波形图实例
    useEffect(() => {
        // 清除现有的波形图
        waveSurferRef.current?.destroy();

        const ws = initializeWaveSurfer();
        if (ws) initRegins(ws);
        if (ws) createZoom(ws);
    }, []);


    return (
        <>
            <div ref={waveContainerRef} style={{ width: '100%', margin: '20px auto' }} />
            <div className="flex">
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