import React from 'react';
import { getExt } from '../utils/common';
import { srtToVtt, urlToArr, vttToUrl } from '../utils/subtitletrans';
import assToVtt from '../utils/assToVtt';

interface SubtitleUploadProps {
    subtitleContent: string;
    subtitleUrl?: string;
    setSubtitleContent: (content: string) => void;
    setSubtitleUrl: (url: string) => void;
    setSubtitles?: (subtitles: any) => void;
}

const SubtitleUpload: React.FC<SubtitleUploadProps> = ({ subtitleContent, setSubtitleContent, setSubtitleUrl, setSubtitles }) => {

    // 上传字幕文件
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
            if (!text) return;

            setSubtitleContent(text as string);
            const subUrl = createSubtitleUrl(text as string);
            const subArray = urlToArr(subUrl)
            subArray.then((result) => {
                if (setSubtitles) setSubtitles(result);
                console.log('subArray', result); // 这里的result就是Promise解析后的值
            }).catch((error) => {
                console.error('subArray Error', error); // 如果Promise被拒绝，这里会捕获到错误
            });
        };
        reader.onerror = error => {
            console.error("function uploadSubtitle", error)
        }
        reader.readAsText(file);
    };



    function createSubtitleUrl(subtitleContent: string) {
        // 创建vtt字幕的Blob对象 方便track分析 参数为vtt格式的字符串 返回该对象的url
        const subUrl = vttToUrl(subtitleContent);
        setSubtitleUrl(subUrl);
        return subUrl;
    }

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
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
            <input
                accept='.vtt,.srt,.ass'
                type="file"
                onChange={uploadSubtitle}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">VTT, SRT, ASS</p>

            {/* <textarea
                value={subtitleContent}
                onChange={(e) => setSubtitleContent(e.target.value)}
                rows={10}
                cols={50}
            /> */}
            <button onClick={handleSave} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">保存字幕</button>

        </div>
    );
};

export default SubtitleUpload;