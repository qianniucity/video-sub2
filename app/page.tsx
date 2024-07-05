"use client"

import React, { Suspense, useEffect, useState } from 'react';
import TimelineView from '@/components/timelineView';


export default function Home() {
  return (
    <main>
      <TimelineView videoUrl="/video/video.mp4" />
    </main>

  );
}
