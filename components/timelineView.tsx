"use client"

import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'

interface PlayerProps {
  videoUrl: string;
}

// A React component that will render wavesurfer
const TimelineView: React.FC<PlayerProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null); // 创建一个ref来引用视频元素
  const waveSurferRef = useRef<WaveSurfer>(); // 用于引用WaveSurfer实例
  const waveContainerRef = useRef<HTMLDivElement>(null); // 用于引用波形容器
  const [loop, setLoop] = useState(true)
  const [zoom, setZoom] = useState(10); // 1. 添加一个新的状态

  useEffect(() => {
    if (videoRef.current && waveContainerRef.current) {
      // Create a timeline plugin instance with custom options
      const topTimeline = TimelinePlugin.create({
        height: 25,
        insertPosition: 'beforebegin',
        timeInterval: 1,
        primaryLabelInterval: 5,
        secondaryLabelInterval: 1,
        style: {
          fontSize: '10px',
          color: '#2D5B88',
        },
      })

      // Create a second timeline
      const bottomTimeline = TimelinePlugin.create({
        height: 15,
        timeInterval: 0.1,
        primaryLabelInterval: 1,
        style: {
          fontSize: '10px',
          color: '#6A3274',
        },
      })


      const ws = waveSurferRef.current = WaveSurfer.create({
        container: waveContainerRef.current, // 使用专门的容器
        waveColor: '#086280',
        progressColor: '#806f77',
        cursorColor: '#672fbc',
        hideScrollbar: true,
        media: videoRef.current,
        url: videoUrl,
        plugins: [topTimeline, bottomTimeline],
      });

      const wsRegions = ws.registerPlugin(RegionsPlugin.create())

      // Create some regions at specific time ranges
      ws.on('decode', () => {
        // Regions
        wsRegions.addRegion({
          id: "1",
          start: 0,
          end: 5.0123123123,
          content: 'Resize me',
          resize: true,
          channelIdx: 1,
          contentEditable: true,
        })
        wsRegions.addRegion({
          id: "2",
          start: 9,
          end: 12,
          content: 'Cramped region12312313212323',
          resize: true,
          channelIdx: 1,
          contentEditable: true,
        })
        wsRegions.addRegion({
          id: "3",
          start: 20,
          end: 27,
          content: 'Drag me',
          resize: true,
          channelIdx: 1,
          contentEditable: true,
        })
      })

      wsRegions.enableDragSelection({
        color: 'rgba(255, 0, 0, 0.1)',
      })

      wsRegions.on('region-updated', (region) => {
        console.log('Updated region', region)
      })

      return () => waveSurferRef.current?.destroy();
    }
  }, [videoUrl]);

  // TODO 添加音波伸缩
  return (
    <>
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
      <div ref={waveContainerRef} style={{ width: '100%', margin: '20px auto' }} />


    </>
  );
}

export default TimelineView