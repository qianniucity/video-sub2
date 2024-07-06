"use client"

import React, { Suspense, useEffect, useState } from 'react';
import VideoPage from '@/components/VideoPage';


export default function Home() {
  const defaultVideoUrl = '/video/video.mp4';
  const defaultSubtitleUrl = '/video/ap.vtt';

  return (
    <main>
      <VideoPage videoUrl="/video/video.mp4" subtitleUrl='/video/ap.vtt' />
    </main>
  );
}
