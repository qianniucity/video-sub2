import React, { useEffect, useState } from 'react';
import { Column, Table, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // 导入样式
import { cn } from "@/lib/utils";
import Subtitle from '@/type/subtitle';
import { checkTime, sleep, timeToSecond } from '@/utils/common';
import { useToast } from "@/components/ui/use-toast"
import { subtitlesToUrl } from '@/utils/subtitletrans';
import Storage from '@/utils/storage';
import {
    ClockIcon,
    UserGroupIcon,
    InboxIcon,
} from '@heroicons/react/24/outline';
import { useWaveSurfer } from './waveSurferContext';

// TODO Warning: findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of Grid which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here:

// 假设的字幕数据
// const subtitles = [
//     { id: 1, start: '00:00:01', end: '00:00:05', text: '这是第一条字幕' },
//     { id: 2, start: '00:00:06', end: '00:00:10', text: '这是第二条字幕' },
//     // 更多字幕...
// ];

/**
 * 字幕表格组件参数
 * @interface SubtitleTableProps  字幕表格组件参数
 * @property {Subtitle[]} subtitles  字幕数组
 * @property {(subtitles: Subtitle[]) => void} setSubtitles  设置字幕数组
 * @property {(url: string) => void} [setSubtitleUrl]  设置字幕地址
 * @property {Subtitle} subtitle  当前字幕
 * @property {(subtitle: Subtitle) => void} setSubtitle  设置当前字幕
 * @property {number} scrollIndex  滚动索引
 */
interface SubtitleTableProps {
    subtitles: Subtitle[];
    setSubtitles: (subtitles: Subtitle[]) => void;
    setSubtitleUrl?: (url: string) => void;
    subtitle: Subtitle;
    setSubtitle: (subtitle: Subtitle) => void;
    scrollIndex: number;
}

/**
 * 字幕表格组件
 */
const SubtitleTable: React.FC<SubtitleTableProps> = ({ subtitles, setSubtitles, setSubtitleUrl, subtitle, setSubtitle, scrollIndex }) => {
    const { toast } = useToast();// 业务信息提示
    const storage = new Storage();// 创建 Storage 实例
    const [history, setHistory] = useState<Subtitle[][]>([]);// 字幕历史记录
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
        updateSubtitles(newSubtitles, true).then(() => {
            toast({
                title: "success",
                description: "delete subtitle",
            })
        });
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
            updateSubtitles(subtitles, true, true).then(() => {
                toast({
                    title: "success",
                    description: "history",
                })
            });
        } else {
            toast({
                title: "warning",
                description: "historyEmpty",
            })
        }
    }


    // 更新所有字幕数据, 可选是否更新字幕地址和是否回退操作
    const updateSubtitles = (subtitleList: Subtitle[], updateUrl?: boolean, isUndo?: boolean) => {
        return new Promise(resolve => {
            if (setSubtitles) {
                setSubtitles(subtitleList);
            }
            if (updateUrl) {
                const subUrl = subtitlesToUrl(subtitleList);
                if (setSubtitleUrl) {
                    setSubtitleUrl(subUrl);
                }

                if (!isUndo) {
                    if (history.length >= 100) {
                        setHistory(prevHistory => prevHistory.slice(1));
                    }
                    setHistory([subtitles.map(sub => sub.clone)]);
                }

                storage.set(
                    'subtitles',
                    subtitleList.map((item: Subtitle) => ({ ...item }))
                );
            }
            resolve(subtitleList);
        });
    }


    // 更新单个字幕
    const updateSubtitle = (index: number, sub: Subtitle) => {
        const subtitlesNew = [...subtitles];

        subtitlesNew[index] = sub;
        updateSubtitles(subtitlesNew, true).then(() => {
            toast({
                title: "Success",
                description: "update",
            })
            // updateCurrentIndex(sub);
        });
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
            setSubtitles(subtitleArray);
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
                <div className="flex flex-1 border-r border-gray-800">
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
                                <div className="flex bg-blue-500 border-b border-gray-800">
                                    <div className="row w-12 text-center">
                                        #
                                    </div>
                                    <div className="row w-28 text-center">
                                        {cn("start")}
                                    </div>
                                    <div className="row w-28 text-center">
                                        {cn("end")}
                                    </div>
                                    <div className="row w-20 text-center">{cn("duration")}</div>
                                    <div className="row flex-1 text-center">
                                        {cn("text")}
                                    </div>
                                    <div className="row w-20 text-center">
                                        {cn("operation")}
                                    </div>
                                </div>
                            );
                        }}
                        rowRenderer={props => {
                            return (
                                <div
                                    key={props.key}
                                    className={`flex items-center ${props.index % 2 ? 'bg-gray-200' : 'bg-gray-100'} 
                                    ${props.index == scrollIndex ? 'bg-rose-300' : ''} 
                            
                                    ${checkSubtitleIllegal(props.rowData) ? '' : 'bg-red-500'}`}
                                    style={props.style}
                                    onClick={() => handleRowClick(props.rowData)} // 添加点击事件处理器
                                >
                                    <div className="w-12 text-center">
                                        {props.index + 1}
                                    </div>
                                    <div className="w-28">
                                        {/* <span className="edit">{props.rowData.start}</span> */}
                                        <input
                                            disabled
                                            maxLength={20}
                                            className=" bg-transparent border border-gray-300 rounded p-1 w-28 text-center"
                                            value={props.rowData.start}
                                        // onChange={e => onChange('start', e.target.value)}
                                        />
                                    </div>
                                    <div className="w-28  text-center">
                                        {/* <span className="">{props.rowData.end}</span> */}
                                        <input
                                            disabled
                                            maxLength={20}
                                            className=" bg-transparent border border-gray-300 rounded p-1 w-28 text-center "
                                            value={props.rowData.end}
                                        // onChange={e => onChange('end', e.target.value)}
                                        />
                                    </div>
                                    <div className="w-20 ">
                                        {/* <span className="edit">{props.rowData.duration}</span> */}
                                        <input
                                            disabled
                                            maxLength={20}
                                            className="bg-transparent border border-gray-300 rounded p-1 w-20 text-center"
                                            value={props.rowData.duration}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <span className={`${props.index == scrollIndex ? 'hidden' : ''}`}>
                                            {/* {props.rowData.text.split(/\r?\n/).map((item: string, index: React.Key | null | undefined) => (
                                                <p key={index} className="m-0">{escapeHTML(item)}</p>
                                            ))} */}
                                            {props.rowData.text}
                                        </span>
                                        <input
                                            disabled={props.index != scrollIndex}
                                            maxLength={100}
                                            className={`bg-transparent border border-gray-300 rounded p-1 w-full ${props.index == scrollIndex ? '' : 'hidden'}`}
                                            value={props.rowData.text}
                                            onChange={e => onChange('text', e.target.value, props.rowData)}
                                        />
                                    </div>
                                    <div className="flex w-20" >
                                        {/* <ClockIcon display={10} className="h-5 w-5 text-gray-500" onClick={() => onEdit(props.rowData)} /> */}
                                        {/* <UserGroupIcon className="h-5 w-5 text-gray-500" onClick={() => onUpdate()} /> */}
                                        <InboxIcon className="h-5 w-5 text-gray-500" onClick={() => onRemove(props.index)} />
                                    </div>
                                </div>
                            );
                        }}

                    >
                        {/* <Column label="序号" dataKey="id" width={50} cellRenderer={({ rowIndex }) => rowIndex + 1} />
                        <Column label="开始时间" dataKey="start" width={120} />
                        <Column label="结束时间" dataKey="end" width={120} />
                        <Column label="内容" dataKey="text" width={width - 290} /> */}
                    </Table>
                </div>
            )}
        </AutoSizer>

    );
};

export default React.memo(SubtitleTable);