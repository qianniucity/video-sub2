import React from 'react';
import { getExt, convertToSrtFormat, getName, processMediaFileAndGetUrl } from '@/utils/common';
import { processSubtitleFileType, srtToVtt, urlToArr, vttToUrl } from '@/utils/subtitletrans';
import Subtitle from '@/type/subtitle';
import { useToast } from '../ui/use-toast';

interface FileUploadProps {
    subtitleContent: string;
    setSubtitleContent: (content: string) => void;
    setSubtitleUrl: (url: string) => void;
    setSubtitles: (subtitles: Subtitle[]) => void;
    subtitles: Subtitle[];
    setVideoUrl: (url: string) => void;
}

/**
 * 文件上传组件
 * @param subtitleContent       字幕原始内容
 * @param setSubtitleContent    设置字幕内容
 * @param setSubtitleUrl        设置字幕URL
 * @param setSubtitles          设置字幕数组
 * @param subtitles             字幕数组
 * @param setVideoUrl           设置视频URL
 * @returns 
 */
const FileUpload: React.FC<FileUploadProps> = ({ subtitleContent, setSubtitleContent, setSubtitleUrl, setSubtitles, subtitles, setVideoUrl }) => {
    const [originalFileName, setOriginalFileName] = React.useState<string>('defaultName');// 字幕文件名
    const { toast } = useToast();// 业务信息提示

    /**
     * 上传字幕文件,读取字幕文件并获取字幕URL
     * @param event 
     * @returns 
     */
    const uploadSubtitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        // 设置字幕文件名
        setOriginalFileName(file.name);
        const type = getExt(file.name);

        processMediaFileAndGetUrl(file).then((result) => {
            let text = processSubtitleFileType(result, type)
            setSubtitleContent(text);
            const subUrl = createSubtitleUrl(text);
            const subArray = urlToArr(subUrl)
            subArray.then((subList) => {
                if (setSubtitles && subList.length > 0) setSubtitles(subList);
                toast({
                    title: "Success",
                    description: "uploadSubtitle Success",
                })
            }).catch((error) => {
                toast({
                    title: "Error",
                    description: "subArray Error",
                })
                console.error('subArray Error', error); // 如果Promise被拒绝，这里会捕获到错误
            });
        }).catch((error) => {
            toast({
                title: "Error",
                description: "uploadSubtitle Error",
            })
            console.error('uploadSubtitle Error', error); // 如果Promise被拒绝，这里会捕获到错误
        });
    };

    /**
     * 创建字幕 url 地址 
     * @param subtitleContent 
     * @returns 
     */
    const createSubtitleUrl = (subtitleContent: string) => {
        // 创建vtt字幕的Blob对象 方便track分析 参数为vtt格式的字符串 返回该对象的url
        const subUrl = vttToUrl(subtitleContent);
        setSubtitleUrl(subUrl);
        return subUrl;
    }
    /**
     * 上传视频文件，读取视频文件并获取视频URL
     * 上传视频文件，清空字幕相关的所有状态
     * @param event 
     * @returns 
     */
    const uploadVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        processMediaFileAndGetUrl(file, 'url').then((result) => {
            // 将视频URL设置为返回的结果
            setVideoUrl(result);

            // 清空字幕相关的所有状态
            setOriginalFileName('defaultName'); // 重置原始文件名为默认值
            setSubtitleContent(''); // 清空字幕内容
            setSubtitles([]); // 清空字幕数组
            setSubtitleUrl(''); // 可选：如果您有一个状态来存储字幕的URL，也可以在这里重置
        }
        ).catch((error) => {
            toast({
                title: "Error",
                description: "uploadVideo Error",
            })
            console.error('uploadVideo Error', error); // 如果Promise被拒绝，这里会捕获到错误
        });
    };

    /**
     * 保存字幕文件,将字幕文件转换为srt格式并下载
     * 
     */
    const handleSave = () => {
        const element = document.createElement("a");
        const file = new Blob([subtitles ? convertToSrtFormat(subtitles) : subtitleContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = getName(originalFileName) + ".srt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload 视频</label>
            <input
                accept='.mp4,.webm,.mov,.avi,.wmv,.flv,.mkv'
                type="file"
                onChange={uploadVideo}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">MP4,WAV,WEBM,MOV,AVI,WMV,FLV,MKV</p>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload 字幕</label>
            <input
                accept='.vtt,.srt,.ass'
                type="file"
                onChange={uploadSubtitle}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">VTT, SRT, ASS</p>
            <button onClick={handleSave} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">保存字幕</button>

        </div>
    );
};

export default FileUpload;