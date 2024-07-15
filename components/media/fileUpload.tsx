import React, { useState } from 'react';
import { getExt, convertToSrtFormat, getName, processMediaFileAndGetUrl } from '@/utils/common';
import { processSubtitleFileType, srtToVtt, urlToArr, vttToUrl } from '@/utils/subtitletrans';
import Subtitle from '@/type/subtitle';
import { useToast } from '@/components/ui/use-toast';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Storage from '@/utils/storage';

interface FileUploadProps {
    setSubtitleUrl: (url: string) => void;
    setSubtitles: (subtitles: Subtitle[]) => void;
    subtitles: Subtitle[];
    setVideoUrl: (url: string) => void;
}

/**
 * 文件上传组件
 * @param subtitleContent       
 * @param setSubtitleContent    设置字幕内容
 * @param setSubtitleUrl        设置字幕URL
 * @param setSubtitles          设置字幕数组
 * @param subtitles             字幕数组
 * @param setVideoUrl           设置视频URL
 * @returns 
 */
const FileUpload: React.FC<FileUploadProps> = ({ setSubtitleUrl, setSubtitles, subtitles, setVideoUrl }) => {
    const [subtitleContent, setSubtitleContent] = useState('');// 使用 useState 管理字幕原始内容 状态
    const [originalFileName, setOriginalFileName] = React.useState<string>('defaultName');// 字幕文件名
    const { toast } = useToast();// 业务信息提示
    const storage = new Storage();// 创建 Storage 实例

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
                saveSubtitles(subList);
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
            subtitleClear();
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
    const subtitleSave = () => {
        const element = document.createElement("a");
        const file = new Blob([subtitles ? convertToSrtFormat(subtitles) : subtitleContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = getName(originalFileName) + ".srt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };
    // 清空字幕
    const subtitleClear = () => {
        setOriginalFileName('defaultName'); // 重置原始文件名为默认值
        setSubtitleContent(''); // 清空字幕内容
        setSubtitles([]); // 清空字幕数组
        setSubtitleUrl(''); // 可选：如果您有一个状态来存储字幕的URL，也可以在这里重置
        removeSubtitlesCache();
    };

    // 存储字幕
    const saveSubtitles = (subtitles: Subtitle[]) => {
        storage.set(
            'subtitles',
            subtitles
        );
    }

    // 存储videoUrl
    const saveVideoUrl = (videoUrl: string) => {
        storage.set(
            'videoUrl',
            videoUrl
        );
    }

    // 删除缓存
    const removeSubtitlesCache = () => {
        storage.del('subtitles');
        // window.location.reload();
    }

    return (
        <div className='flex flex-wrap justify-start items-end'>
            <div className="grid w-full max-w-sm items-end gap-1.5 mr-3">
                {/* <Label htmlFor="video_input">Upload 视频</Label> */}
                <Input
                    id="video_input"
                    accept='.mp4,.webm,.mov,.avi,.wmv,.flv,.mkv'
                    type="file"
                    onChange={uploadVideo}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="file_input_help" />
            </div>
            <div className="grid w-full max-w-sm items-end gap-1.5 mr-3">
                {/* <Label htmlFor="subtitle_input">Upload 字幕</Label> */}
                <Input
                    id="subtitle_input"
                    accept='.vtt,.srt,.ass'
                    type="file"
                    onChange={uploadSubtitle}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="file_input_help" />
            </div>


            <div className="grid  max-w-sm items-end gap-1.5">
                <button
                    onClick={subtitleSave}
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">保存字幕</button>
            </div>
            
        </div>
    );
};

export default FileUpload;