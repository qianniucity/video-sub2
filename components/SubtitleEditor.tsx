import React, { useState } from 'react';
import { getExt } from '../utils/common';
import { srtToVtt, vttToUrl } from '../utils/subtitletrans';
import assToVtt from '../utils/assToVtt';

const SubtitleEditor: React.FC = () => {
    const [subtitleContent, setSubtitleContent] = useState('');

    const uploadSubtitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        const type = getExt(file.name);
        reader.onload = (e) => {
            const result = reader.result as string;
            if (type === 'srt') {
                srtToVtt(result);
            } else if (type === 'ass') {
                assToVtt(result);
            } else {
                result.replace(/{[\s\S]*?}/g, '');
            }
            const text = e.target?.result;
            setSubtitleContent(text as string);
        };
        reader.onerror = error => {

        }
        reader.readAsText(file);
    };

    const subtitleUrl = vttToUrl(subtitleContent);

    const handleSave = () => {
        const element = document.createElement("a");
        const file = new Blob([subtitleContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "editedSubtitle.srt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    return (
        <div>
            <input type="file" accept=".vtt,.srt,.ass" onChange={uploadSubtitle} />
            <textarea
                value={subtitleContent}
                onChange={(e) => setSubtitleContent(e.target.value)}
                rows={10}
                cols={50}
            />
            <button onClick={handleSave}>保存字幕</button>
        </div>
    );
};

export default SubtitleEditor;