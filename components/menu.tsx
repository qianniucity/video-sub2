import React, { useState } from 'react';
import { getExt, convertToSrtFormat, getName, processMediaFileAndGetUrl } from '@/utils/common';
import { processSubtitleFileType, urlToArr, vttToUrl } from '@/utils/subtitletrans';
import Subtitle from '@/type/subtitle';
import { useToast } from '@/components/ui/use-toast';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Storage from '@/utils/storage';
import Image from 'next/image';
import { ModeToggle } from './darkmodel/modeToggle';
import { LocaleChange } from './ui/locale-change';
import { UploadIcon, DownloadIcon } from "@radix-ui/react-icons"


type Dictionary = Record<string, string>;

interface FileUploadProps {
    dict: Dictionary;
    setSubtitleUrl: (url: string) => void;
    setSubtitles: (subtitles: Subtitle[]) => void;
    subtitles: Subtitle[];
    setVideoUrl: (url: string) => void;
}

const Menu: React.FC<FileUploadProps> = ({ dict, setSubtitleUrl, setSubtitles, subtitles, setVideoUrl }) => {
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

            toast({
                title: "Success",
                description: "uploadVideo Success",
            })
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
        <nav className=" bg-white border-gray-200 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between  mx-auto p-2">
                <div className='items-center justify-between  w-full md:flex md:w-auto space-x-5'>
                    <a href="https://qianniuspace.com" className="flex space-x-2 ">
                        <Image src="favicon.svg" alt="Flowbite Logo" width={32} height={32} />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">videoSub2</span>
                    </a>
                    <ul className="flex  flex-col items-center mt-4 font-medium md:flex-row md:mt-0 md:space-x-8 ">
                        <li>
                            <Label
                                className=''
                                htmlFor="video-file">
                                <div className="flex text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 select-none">
                                    <UploadIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="hidden md:inline">{dict.upload_video}</span>
                                </div>
                                <input
                                    id="video-file"
                                    onChange={uploadVideo}
                                    type='file'
                                    className='hidden' />
                            </Label>
                        </li>
                        <li>
                            <Label
                                htmlFor="subtitles-file">
                                <div className="flex text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 select-none">
                                    <UploadIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="hidden md:inline">{dict.upload_subtitle}</span>
                                </div>
                                <input
                                    id="subtitles-file"
                                    onChange={uploadSubtitle}
                                    type='file'
                                    className='hidden' />
                            </Label>

                        </li>
                        {/* <li>
                            <Label
                                htmlFor="subtitles-undo">
                                <p className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 md:px-5 md:py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 select-none">字幕回退</p>
                                <input
                                    id="subtitles-undo"
                                    type='file'
                                    className='hidden' />
                            </Label>

                        </li>
                        <li>
                            <Label
                                htmlFor="subtitles-do">
                                <p className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 md:px-5 md:py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 select-none">字幕前进</p>
                                <input id="subtitles-do" type='file' className='hidden' />
                            </Label>
                        </li> */}
                        <li>
                            <Label
                                htmlFor="subtitles-save">
                                <div className="flex text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 select-none">
                                    < DownloadIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="hidden md:inline">{dict.down_subtitle}</span>
                                </div>
                                <input
                                    id="subtitles-save"
                                    onClick={subtitleSave}
                                    type='file'
                                    className='hidden' />
                            </Label>
                        </li>
                        <li>
                            <Label
                                htmlFor="subtitles-save">
                                <div className="flex text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 select-none">
                                    < DownloadIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="hidden md:inline">{dict.down_video}</span>
                                </div>
                                <input
                                    id="subtitles-save"
                                    type='file'
                                    className='hidden' />
                            </Label>
                        </li>
                    </ul>
                </div>
                <div className="flex items-center md:order-2 space-x-1 md:space-x-2 ">
                    <LocaleChange url={"/"} />
                    <ModeToggle />
                    <button data-collapse-toggle="mega-menu" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mega-menu" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Menu;