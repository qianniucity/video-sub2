// TimelineDisplay.tsx
import React from 'react';
import { Timeline } from '../type/Timeline';

interface TimelineDisplayProps {
    timeline: Timeline;
}

const TimelineDisplay: React.FC<TimelineDisplayProps> = ({ timeline }) => {
    const subtitles = timeline.getSubtitles();

    return (
        <div className="timeline-display">
            {subtitles.map((subtitle) => (
                <div key={subtitle.id} className="subtitle-entry">
                    <div className="time">
                        {subtitle.startTime} {'>'} {subtitle.endTime}
                    </div>
                    <div className="text">{subtitle.text}</div>
                </div>
            ))}
        </div>
    );
};

export default TimelineDisplay;