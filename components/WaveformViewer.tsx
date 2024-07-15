import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Subtitle from '@/type/subtitle';
import SubtitleTimeLine from '@/type/subtitleTimeLine';
import { randomColor, secondToTime, timeToSecond } from '@/utils/common';
import { useWaveSurfer } from './waveSurferContext';

interface WaveformViewerProps {
    subtitles: Subtitle[];
    setScrollIndex: (scrollIndex: number) => void;
}

/**
 * 波形图组件
 * @param param0  {Array} subtitles - 字幕数组
 * @param param1  {Function} setScrollIndex - 设置滚动索引
 * @returns 
 */
const WaveformViewer: React.FC<WaveformViewerProps> = ({ subtitles, setScrollIndex }) => {
    const { waveSurfer, waveContainerRef, wsRegions } = useWaveSurfer();


    /**
     * 字幕填充到波形图
     * 创建区域，根据字幕时间线创建区域，并添加到波形图
     * @param ws - 波形图实例
     */
    const createRegions = (subtitlesTimeLine: SubtitleTimeLine[]) => {

        if (!waveSurfer) return;

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
                channelIdx: 1
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
            waveSurfer.setTime(region.start)
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
        if (waveSurfer) {
            waveSurfer.on('ready', () => {
                createRegions(subtitles.map((subtitle) => {
                    const start = timeToSecond(subtitle.start);
                    const end = timeToSecond(subtitle.end);
                    return new SubtitleTimeLine({ start: start, end: end, text: subtitle.text });
                }));
            });
        }
    }, [wsRegions]);


    // 监听字幕变化，更新字幕时间线
    useEffect(() => {
        const subtitlesTimeLine = subtitles.map((subtitle) => {
            const start = timeToSecond(subtitle.start);
            const end = timeToSecond(subtitle.end);
            return new SubtitleTimeLine({ start: start, end: end, text: subtitle.text });
        });
        createRegions(subtitlesTimeLine);
    }, [subtitles]);


    return (
        <div ref={waveContainerRef} style={{ width: '100%', margin: '20px auto' }} />
    );
}

export default React.memo(WaveformViewer);