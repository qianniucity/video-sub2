"use client"

import React, { useRef } from 'react';
import SubtitleTable from '@/components/subtitle/subtitleTable';
import Console from '@/components/control/console';
import Menu from '@/components/menu';
import { WaveSurferProvider } from '@/components/subtitle/waveSurferContext';
import WaveformViewer from '@/components/subtitle/waveformViewer';
import VideoPlayer from '@/components/player';


interface Dictionary {
    // 根据你的 JSON 结构定义类型
    [key: string]: any;
}

interface SubtitlePageProps {
    dict: Dictionary;
}

/**
 * 视频页面组件，包含视频播放器、字幕编辑器、波形图，以及相关状态管理，
 * 如字幕内容、字幕URL、视频URL、字幕数组、波形图状态、当前字幕、滚动索引等
 * @component
 */
const SubtitlePage: React.FC<SubtitlePageProps> = ({ dict }) => {

    const videoRef = useRef<HTMLVideoElement>(null);// 用于引用视频元素

    return (
        <div >
            <Menu dict={dict.common} />
            <div className="border-t border-gray-200" ></div>
            <WaveSurferProvider videoRef={videoRef}>
                <div className="flex flex-wrap mt-2">
                    <div className="w-full md:w-1/2">
                        <VideoPlayer
                            videoRef={videoRef}
                        />
                        <Console
                            dict={dict.control}
                        />
                    </div>
                    <div className="w-full md:w-1/2 h-full">
                        <SubtitleTable dict={dict.subtitle_table} />
                    </div>
                </div>
                <div className="">
                    <WaveformViewer />
                </div>
            </WaveSurferProvider>
        </div>
    );
};

export default SubtitlePage;