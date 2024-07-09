import React, { useEffect, useState } from 'react';
import { Column, Table, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // 导入样式
import { cn } from "@/lib/utils";
import Subtitle from '@/type/subtitle';
import { checkTime, sleep, timeToSecond } from '@/utils/common';
import { useToast } from "@/components/ui/use-toast"
import { escapeHTML, subtitlesToUrl, unescapeHTML, vttToUrl } from '@/utils/subtitletrans';
import Storage from '@/utils/storage';
import WaveSurfer from 'wavesurfer.js';
import {
    ClockIcon,
    UserGroupIcon,
    InboxIcon,
} from '@heroicons/react/24/outline';

// TODO Warning: findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of Grid which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here:

// 假设的字幕数据
// const subtitles = [
//     { id: 1, start: '00:00:01', end: '00:00:05', text: '这是第一条字幕' },
//     { id: 2, start: '00:00:06', end: '00:00:10', text: '这是第二条字幕' },
//     // 更多字幕...
// ];

/**
 * Props for the SubtitleTable component.
 * 
 * @prop subtitles - The array of subtitle objects.
 * @prop setSubtitles - Function to set the subtitles.
 * @prop setSubtitleUrl - Function to set the subtitle URL.
 * @prop wavesurferState - The WaveSurfer state.
 * @prop subtitle - The subtitle object.
 * @prop setSubtitle - Function to set the subtitle.
 * @prop scrollIndex - The scroll index.
 * 
 */
interface SubtitleTableProps {
    subtitles: Subtitle[];
    setSubtitles?: (subtitles: Subtitle[]) => void;
    setSubtitleUrl?: (url: string) => void;
    wavesurferState?: WaveSurfer;
    subtitle: Subtitle;
    setSubtitle: (subtitle: Subtitle) => void;
    scrollIndex: number;
}

/**
 * Component for displaying and editing subtitles in a table format.
 * 
 * @component
 * @param {SubtitleTableProps} props - The subtitle table props.
 * @returns {JSX.Element} The subtitle table component.
 */
const SubtitleTable: React.FC<SubtitleTableProps> = ({ subtitles, setSubtitles, setSubtitleUrl, wavesurferState, subtitle, setSubtitle, scrollIndex }) => {


    const [index, setIndex] = useState(-1);// 使用 useState 管理 'index' 状态
    const { toast } = useToast();// 使用 useToast 自定义 hook
    const storage = new Storage();// 创建 Storage 实例
    const [history, setHistory] = useState<Subtitle[][]>([]);// 使用 useState 管理 'history' 状态


    /**
     * 编辑字幕
     * @param sub   字幕对象
     * 
     */
    const onEdit = (sub: Subtitle) => {
        const index = subtitles.indexOf(sub);
        setSubtitle(sub);
        setIndex(index);
        editSubtitle(sub);
    }

    /**
     * 更新字幕
     * 
     */
    const onUpdate = () => {
        if (check()) {
            updateSubtitle(index, new Subtitle({ start: subtitle.start, end: subtitle.end, text: subtitle.text }));
            setSubtitle(new Subtitle({ start: '', end: '', text: '' }));
            setIndex(-1);
        }
    }

    /**
     * 修改字幕内容
     * @param name  
     * @param value 
     */
    const onChange = (name: string, value: string) => {
        const updatedSubtitle = new Subtitle({ ...subtitle, [name as keyof Subtitle]: value });
        setSubtitle(updatedSubtitle);
    }

    /**
     * 删除字幕
     * @param sub  字幕对象
     */
    const onRemove = (sub: Subtitle) => {
        removeSubtitle(sub);
        setSubtitle(new Subtitle({ start: '', end: '', text: '' }));
        setIndex(-1);
    }

    /**
     * 删除单个字幕
     * @param sub 
     * @returns 
     */
    const removeSubtitle = (sub: Subtitle) => {
        if (!checkSub(sub)) return;
        const index = subtitles.indexOf(sub);
        subtitles.splice(index, 1);
        updateSubtitles(subtitles, true).then(() => {
            toast({
                title: "success",
                description: "delete subtitle",
            })
        });
    }


    /**
     * 检查字幕时间是否合法
     * @returns 
     */
    const check = () => {
        const startTime = timeToSecond(subtitle.start);
        const endTime = timeToSecond(subtitle.end);
        const previous = subtitles[index - 1];
        const next = subtitles[index + 1];

        if (index !== -1) {
            if (!checkTime(subtitle.start)) {
                toast({
                    title: "Error",
                    description: "startTime",
                })
                return false;
            }

            if (!checkTime(subtitle.end)) {
                toast({
                    title: "Error",
                    description: "endTime",
                })
                return false;
            }

            if (startTime >= endTime) {
                toast({
                    title: "Error",
                    description: "greater",
                })
                return false;
            }

            if ((previous && endTime < previous.startTime) || (next && startTime > next.endTime)) {
                toast({
                    title: "Error",
                    description: "moveAcross",
                })
                return false;
            }

            if (previous && startTime < previous.endTime) {
                toast({
                    title: "Warning",
                    description: "overlaps",
                })
            }
        }
        return true;
    }


    // 验证字幕在数组范围内
    const checkSub = (sub: Subtitle) => {
        return subtitles.includes(sub);
    }

    // 激活单个字幕的编辑
    const editSubtitle = (sub: Subtitle) => {
        if (!checkSub(sub)) return;
        const subtitlesNew = subtitles.map((item: Subtitle) => {
            // item.highlight = false;
            item.editing = false;
            return item;
        });
        sub.editing = true;
        // updateSubtitles(subtitlesNew).then(() => {
        //     // 改成当我点击当前行的时候，调用 videoSeek(sub);

        // });
    }

    /**
     * 点击行
     * @param rowData 
     * @returns 
     */
    const handleRowClick = (rowData: Subtitle) => {
        console.log("rowData", rowData)
        if (!checkSub(rowData)) return;
        const subtitlesNew = subtitles.map((item: Subtitle) => {
            item.highlight = false;
            // item.editing = false;
            return item;
        });
        rowData.highlight = true;
        // updateSubtitles(subtitlesNew).then(() => {
        //     // 改成当我点击当前行的时候，调用 videoSeek(sub);

        // });
        // console.log("Row clicked:", rowData);
        // 在这里添加你想要执行的逻辑
        videoSeek(rowData);
    }

    // 删除缓存
    const removeCache = () => {
        storage.del('subtitles');
        window.location.reload();
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
        const subtitlesNew = subtitles.map(item => {
            item.highlight = false;
            item.editing = false;
            return item;
        });

        subtitlesNew[index] = sub;
        updateSubtitles(subtitlesNew, true).then(() => {
            toast({
                title: "Success",
                description: "update",
            })
            updateCurrentIndex(sub);
        });
    }

    // 滚动到某个字幕
    const updateCurrentIndex = (sub: Subtitle) => {
        if (!checkSub(sub)) return;
        const index = subtitles.indexOf(sub);
        setIndex(index);
    }

    // 视频跳转到某个字幕的开始时间, 可选是否播放
    const videoSeek = (sub: Subtitle, isPlay: boolean = false) => {
        const currentTime = sub.startTime + 0.001;
        if (!wavesurferState) return;
        if (!wavesurferState.isPlaying() && currentTime > 0 && currentTime !== wavesurferState.getCurrentTime() && wavesurferState.getDuration()) {
            if (currentTime <= wavesurferState.getDuration()) {
                // 由于字幕url是异步的，需要时间去同步
                sleep(300).then(() => {
                    wavesurferState.setTime(currentTime);
                    if (isPlay) {
                        wavesurferState.play();
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
        // console.log("sub-checkSubtitleIllegal", sub);
        const index: number = subtitles.indexOf(sub);
        const previous: Subtitle | undefined = subtitles[index - 1];
        return (previous && sub.startTime < previous.endTime) || !sub.check;
    }


    useEffect(() => {
        console.log("scrollIndex-Table", scrollIndex);
        // 在数组 subtitles 中，当前 scrollIndex 下标，设置 highlight 为 true
        const subtitlesNew = subtitles.map((item: Subtitle) => {
            item.highlight = false;
            return item;
        });
        if (scrollIndex !== -1) {
            subtitlesNew[scrollIndex].highlight = true;
        }
        // updateSubtitles(subtitlesNew).then(() => {
        //     // console.log("scrollIndex", scrollIndex);
        // });

    }, [scrollIndex]);


    return (
        <AutoSizer disableHeight>
            {({ width }) => (
                <div className="flex flex-1 border-r border-gray-800">
                    <Table
                        width={width}
                        height={390}
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
                            ${props.rowData.editing ? 'bg-rose-300' : ''} 
                            ${props.rowData.highlight ? 'bg-blue-400' : ''} 
                            ${checkSubtitleIllegal(props.rowData) ? 'bg-red-200' : ''}`}
                                    style={props.style}
                                    onClick={() => handleRowClick(props.rowData)} // 添加点击事件处理器
                                >
                                    <div className="w-12 text-center">
                                        {props.index + 1}
                                    </div>
                                    <div className="w-28">
                                        {/* <span className="edit">{props.rowData.start}</span> */}
                                        <input
                                            maxLength={20}
                                            className=" bg-transparent border border-gray-300 rounded p-1 w-28 text-center"
                                            defaultValue={props.rowData.start}
                                            onChange={e => onChange('start', e.target.value)}
                                        />
                                    </div>
                                    <div className="w-28  text-center">
                                        {/* <span className="">{props.rowData.end}</span> */}
                                        <input
                                            maxLength={20}
                                            className=" bg-transparent border border-gray-300 rounded p-1 w-28 text-center "
                                            defaultValue={props.rowData.end}
                                            onChange={e => onChange('end', e.target.value)}
                                        />
                                    </div>
                                    <div className="w-20 ">
                                        {/* <span className="edit">{props.rowData.duration}</span> */}
                                        <input
                                            disabled
                                            maxLength={20}
                                            className="bg-transparent border border-gray-300 rounded p-1 w-20 text-center"
                                            defaultValue={props.rowData.duration}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <span className={`${subtitle.editing ? 'hidden' : ''}`}>
                                            {/* {props.rowData.text.split(/\r?\n/).map((item: string, index: React.Key | null | undefined) => (
                                                <p key={index} className="m-0">{escapeHTML(item)}</p>
                                            ))} */}
                                            {props.rowData.text}
                                        </span>
                                        <input
                                            disabled={!props.rowData.editing}
                                            maxLength={100}
                                            className={`bg-transparent border border-gray-300 rounded p-1 w-full ${subtitle.editing ? '' : 'hidden'}`}
                                            defaultValue={unescapeHTML(props.rowData.text || '')}
                                            onChange={e => onChange('text', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex w-20" >
                                        <ClockIcon display={10} className="h-5 w-5 text-gray-500" onClick={() => onEdit(props.rowData)} />
                                        <UserGroupIcon className="h-5 w-5 text-gray-500" onClick={() => onUpdate()} />
                                        <InboxIcon className="h-5 w-5 text-gray-500" onClick={() => onRemove(props.rowData)} />
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