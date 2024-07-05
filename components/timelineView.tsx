"use client"

import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
interface PlayerProps {
  videoUrl: string;
}

// A React component that will render wavesurfer
const TimelineView: React.FC<PlayerProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null); // 创建一个ref来引用视频元素
  const waveSurferRef = useRef<WaveSurfer>(); // 用于引用WaveSurfer实例
  const waveContainerRef = useRef<HTMLDivElement>(null); // 用于引用波形容器




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


      waveSurferRef.current = WaveSurfer.create({
        container: waveContainerRef.current, // 使用专门的容器
        waveColor: 'violet',
        progressColor: 'purple',
        media: videoRef.current,
        url: videoUrl,
        plugins: [topTimeline, bottomTimeline],
      });

      return () => waveSurferRef.current?.destroy();
    }
  }, [videoUrl]);
  return (
    <>
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        playsInline
        style={{ width: '100%', maxWidth: '600px', margin: '0 auto', display: 'block' }}
      />
      <div ref={waveContainerRef} style={{ width: '100%', margin: '20px auto' }} />
    </>
  );
}

export default TimelineView