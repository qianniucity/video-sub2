import React, { useEffect } from 'react';
import { Column, Table, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // 导入样式
import { cn } from "@/lib/utils";
import Subtitle from '@/type/subtitle';
import { checkTime, sleep, timeToSecond } from '@/utils/common';
import { useToast } from "@/components/ui/use-toast"
import { subtitlesToUrl } from '@/utils/subtitletrans';
import SessionsStorage from '@/utils/sessionstorage';
import { Cross2Icon, EraserIcon } from "@radix-ui/react-icons"
import { useWaveSurfer } from '@/components/subtitle/waveSurferContext';
import { Input } from '@/components/ui/input';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { historyAtom, scrollIndexAtom, subtitleAtom, subtitlesAtom, subtitleUrlAtom } from '@/atoms/subtitle-atoms';


// TODO Warning: findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of Grid which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here:

// 假设的字幕数据
// const subtitles = [
//     { id: 1, start: '00:00:01', end: '00:00:05', text: '这是第一条字幕' },
//     { id: 2, start: '00:00:06', end: '00:00:10', text: '这是第二条字幕' },
//     // 更多字幕...
// ];


type Dictionary = Record<string, string>;

interface SubtitleTableProps {
    dict: Dictionary;
}

/**
 * 字幕表格组件
 */
const SubtitleTable: React.FC<SubtitleTableProps> = ({ dict }) => {
    const [history, setHistory] = useAtom(historyAtom);// 字幕历史记录
    const [subtitles, setSubtitles] = useAtom(subtitlesAtom);// 字幕数组
    const setSubtitle = useSetAtom(subtitleAtom); // 当前字幕
    const setSubtitleUrl = useSetAtom(subtitleUrlAtom);// 字幕URL
    const scrollIndex = useAtomValue(scrollIndexAtom);// 滚动索引  默认为-1


    const { toast } = useToast();// 业务信息提示
    const storage = new SessionsStorage();// 创建 Storage 实例

    const { waveSurfer } = useWaveSurfer();


    /**
     * 修改字幕内容
     * @param name  
     * @param value 
     */
    const onChange = (name: string, value: string, sub: Subtitle) => {
        const updatedSubtitle = new Subtitle({ ...sub, [name as keyof Subtitle]: value });
        setSubtitle(updatedSubtitle);
        console.log("updatedSubtitle", updatedSubtitle);
        updateSubtitle(scrollIndex, updatedSubtitle);
    }

    /**
     * 删除字幕
     * @param sub  字幕对象
     */
    const onRemove = (index: number) => {
        removeSubtitle(index);
        setSubtitle(new Subtitle({ start: '', end: '', text: '' }));
    }

    /**
     * 删除单个字幕
     * @param sub 
     * @returns 
     */
    const removeSubtitle = (index: number) => {
        // 数组是引用类型，所以需要复制一份才会更新 subtitles 状态
        const newSubtitles = [...subtitles];
        newSubtitles.splice(index, 1);
        updateSubtitles(newSubtitles, true);
        toast({
            title: "success",
            description: "delete subtitle",
        })
    }

    // 验证字幕在数组范围内
    const checkSub = (sub: Subtitle) => {
        return subtitles.includes(sub);
    }


    /**
     * 点击行
     * @param rowData 
     * @returns 
     */
    const handleRowClick = (rowData: Subtitle) => {
        console.log("rowData", rowData)
        if (!checkSub(rowData)) return;
        videoSeek(rowData);
    }



    // 历史回滚
    const undoSubtitle = () => {
        history.pop();
        const subtitles = history[history.length - 1];
        if (subtitles) {
            updateSubtitles(subtitles, true, true);
            toast({
                title: "success",
                description: "history",
            })
        } else {
            toast({
                title: "warning",
                description: "historyEmpty",
            })
        }
    }


    // 更新所有字幕数据, 可选是否更新字幕地址和是否回退操作
    const updateSubtitles = (subtitleList: Subtitle[], updateUrl?: boolean, isUndo?: boolean) => {
        setSubtitles(subtitleList);
        if (updateUrl) {
            const subUrl = subtitlesToUrl(subtitleList);
            setSubtitleUrl && setSubtitleUrl(subUrl);

            if (!isUndo) {
                setHistory(prevHistory => [...prevHistory, subtitleList]);
            }
            storage.set('subtitles', subtitleList);
        }
    }


    // 更新单个字幕
    const updateSubtitle = (index: number, sub: Subtitle) => {
        const subtitlesNew = [...subtitles];

        subtitlesNew[index] = sub;
        updateSubtitles(subtitlesNew, true);
        toast({
            title: "Success",
            description: "update",
        });
        // updateCurrentIndex(sub);
    }

    // 视频跳转到某个字幕的开始时间, 可选是否播放
    const videoSeek = (sub: Subtitle, isPlay: boolean = false) => {
        const currentTime = sub.startTime + 0.001;
        if (!waveSurfer) return;
        if (!waveSurfer.isPlaying() && currentTime > 0 && currentTime !== waveSurfer.getCurrentTime() && waveSurfer.getDuration()) {
            if (currentTime <= waveSurfer.getDuration()) {
                // 由于字幕url是异步的，需要时间去同步
                sleep(300).then(() => {
                    waveSurfer.setTime(currentTime);
                    if (isPlay) {
                        waveSurfer.play();
                    }
                });
            } else {
                toast({
                    title: "Warning",
                    description: "durationLimit",
                })
            }
        }
    }


    // 验证字幕是否不规范
    const checkSubtitleIllegal = (sub: Subtitle): boolean => {
        const index: number = subtitles.indexOf(sub);
        const previous: Subtitle | undefined = subtitles[index];
        if (!((previous && sub.startTime <= previous.endTime) || sub.check)) {
            console.log("index", index);
            console.log("sub", sub);
            console.log("previous", previous);
            console.log("sub.startTime", sub.startTime);
            console.log("previous.endTime", previous.endTime);
            console.log("sub.check", sub.check);
            console.log("sub.startTime < previous.endTime", (previous && sub.startTime <= previous.endTime) || sub.check, index);
        }
        return (previous && sub.startTime <= previous.endTime) || sub.check;
    }


    /**
     * 初始化字幕, 从缓存中获取, 如果没有则初始化为空数组
     */
    const initStubs = () => {
        const subs = storage.get('subtitles');
        if (subs) {
            // 将 subs 转换成 Subtitle 类型的数组对象
            const subtitleArray = subs.map((item: Subtitle) => new Subtitle(item));
            updateSubtitles(subtitleArray);
        }
    }
    useEffect(() => {
        initStubs();
    }, []); // 将 subtitles 添加到依赖数组中


    useEffect(() => {
        console.log('Subtitles changed');
    }, [subtitles]);


    return (
        <AutoSizer disableHeight>
            {({ width }) => (
                <div className="flex w-full text-sm text-gray-500 dark:text-gray-400">
                    <Table
                        width={width}
                        height={1020}
                        headerHeight={20}
                        rowHeight={30}
                        rowCount={subtitles.length}
                        rowGetter={({ index }) => subtitles[index]}
                        scrollToIndex={scrollIndex}

                        headerRowRenderer={() => {
                            return (
                                <div className="flex text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <div className="row w-12 text-center px-6 py-3">
                                        #
                                    </div>
                                    <div className="row w-28 text-center px-6 py-3">
                                        {dict.subtitle_start}
                                    </div>
                                    <div className="row w-28 text-center px-6 py-3">
                                        {dict.subtitle_end}
                                    </div>
                                    <div className="row w-20 text-center px-6 py-3">
                                        {dict.subtitle_duration}
                                    </div>
                                    <div className="row flex-1 text-center px-6 py-3">
                                        {dict.subtitle_text}
                                    </div>
                                    <div className="row w-40 text-center px-6 py-3">
                                        {dict.subtitle_operation}
                                    </div>
                                </div>
                            );
                        }}
                        rowRenderer={props => {
                            return (
                                <div
                                    key={props.key}
                                    className={`flex items-center  border-b  ${props.index % 2 ? 'bg-gray-200  dark:bg-gray-800 dark:border-gray-700' : 'bg-gray-100 dark:bg-gray-700 dark:border-gray-600'} 
                                    ${props.index == scrollIndex ? 'bg-rose-300 dark:bg-zinc-100' : ''} 
                            
                                    ${checkSubtitleIllegal(props.rowData) ? '' : 'bg-red-500'}`}
                                    style={props.style}
                                    onClick={() => handleRowClick(props.rowData)} // 添加点击事件处理器
                                >
                                    <div className="w-12 text-center py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {props.index + 1}
                                    </div>
                                    <div className="w-28">
                                        {/* <span className="edit">{props.rowData.start}</span> */}
                                        <Input
                                            disabled
                                            maxLength={20}
                                            className="py-4"
                                            value={props.rowData.start}
                                        // onChange={e => onChange('start', e.target.value)}
                                        />
                                    </div>
                                    <div className="w-28">
                                        {/* <span className="">{props.rowData.end}</span> */}
                                        <Input
                                            disabled
                                            maxLength={20}
                                            className="py-4"
                                            value={props.rowData.end}
                                        // onChange={e => onChange('end', e.target.value)}
                                        />
                                    </div>
                                    <div className="w-20 ">
                                        {/* <span className="edit">{props.rowData.duration}</span> */}
                                        <Input
                                            disabled
                                            maxLength={20}
                                            className="py-4"
                                            value={props.rowData.duration}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <span className={`py-4 ${props.index == scrollIndex ? 'hidden' : ''}`}>
                                            {/* {props.rowData.text.split(/\r?\n/).map((item: string, index: React.Key | null | undefined) => (
                                                <p key={index} className="m-0">{escapeHTML(item)}</p>
                                            ))} */}
                                            {props.rowData.text}
                                        </span>
                                        <Input
                                            disabled={props.index != scrollIndex}
                                            maxLength={100}
                                            className={`py-4 ${props.index == scrollIndex ? '' : 'hidden'}`}
                                            value={props.rowData.text}
                                            onChange={e => onChange('text', e.target.value, props.rowData)}
                                        />
                                    </div>
                                    <div className="flex w-20 " >
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <EraserIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-0 dark:scale-100" onClick={() => onRemove(props.index)} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{cn("del line")}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            );
                        }}
                    >
                    </Table>
                </div>
            )}
        </AutoSizer>
    );
};

export default React.memo(SubtitleTable);