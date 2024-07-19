import React, { createContext, useContext, useEffect, ReactNode, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
import { useAtom, useAtomValue } from 'jotai';
import { waveSurferAtom, wsRegionsAtom, videoUrlAtom } from '@/atoms/subtitle-atoms';

/**
 * 创建 Context，现在包括 WaveSurfer 实例和容器 ref
 */
const WaveSurferContext = createContext<{ [x: string]: any; waveSurfer: WaveSurfer | null; waveContainerRef: React.RefObject<HTMLDivElement>; sliderRef: React.RefObject<HTMLInputElement>; wsRegions: RegionsPlugin } | null>(null);

interface WaveSurferProviderProps {
    children: ReactNode;
    videoRef: React.RefObject<HTMLVideoElement>;
}

/**
 * Provider 组件 - 初始化 WaveSurfer 实例，添加插件，设置参数，返回波形图实例 
 * @param param0  {ReactNode} children - 子组件
 * @param param1  {React.RefObject} videoRef - 视频元素引用
 * @returns 
 */
export const WaveSurferProvider = ({ children, videoRef }: WaveSurferProviderProps) => {
    const [waveSurfer, setWaveSurfer] = useAtom(waveSurferAtom);
    const [wsRegions, setWsRegions] = useAtom(wsRegionsAtom);// 区域插件
    const videoUrl = useAtomValue(videoUrlAtom)

    const waveContainerRef = useRef<HTMLDivElement>(null); // 波形图容器引用
    const waveSurferRef = useRef<WaveSurfer>(); // 波形图引用
    const sliderRef = useRef<HTMLInputElement>(null);// 缩放滑块引用

    useEffect(() => {
        const ws = initializeWaveSurfer();

        if (ws) initRegins(ws);
        if (ws) createZoom(ws);

        // 组件卸载时销毁 WaveSurfer 实例
        return () => {
            if (ws) {
                ws.destroy();
            }
        };

    }, []); // 依赖项中添加 waveContainerRef.current


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
            timeInterval: 0.5,
            primaryLabelInterval: 10,
            secondaryLabelInterval: 1,
            style: {
                fontSize: '10px',
                color: '#2D5B88',
            },
        });

        const bottomTimeline = TimelinePlugin.create({
            height: 15,
            timeInterval: 0.1,
            primaryLabelInterval: 1,
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

        setWaveSurfer(ws);
        return ws;
    };

    /**
    * 创建缩放功能，根据滑块的值更新缩放级别
    * @param ws - 波形图实例
    */
    const createZoom = (ws: WaveSurfer) => {
        // Update the zoom level on slider change
        ws.once('decode', () => {
            // ws.zoom(sliderValues);
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

    return (
        <WaveSurferContext.Provider value={{ waveSurfer, waveContainerRef, sliderRef, wsRegions }}>
            {children}
        </WaveSurferContext.Provider>
    );
};

// 自定义 Hook，现在返回 waveSurfer 实例和容器 ref
export const useWaveSurfer = () => {
    const context = useContext(WaveSurferContext);
    if (!context) {
        throw new Error('useWaveSurfer must be used within a WaveSurferProvider');
    }
    return context;
};