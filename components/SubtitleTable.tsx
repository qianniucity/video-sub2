import React, { useState } from 'react';
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
    BanknotesIcon,
    ClockIcon,
    UserGroupIcon,
    InboxIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';

// TODO Warning: findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of Grid which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here:

// 假设的字幕数据
// const subtitles = [
//     { id: 1, start: '00:00:01', end: '00:00:05', text: '这是第一条字幕' },
//     { id: 2, start: '00:00:06', end: '00:00:10', text: '这是第二条字幕' },
//     // 更多字幕...
// ];

interface SubtitleTableProps {
    subtitles: Subtitle[];
    setSubtitles?: (subtitles: Subtitle[]) => void;
    setSubtitleUrl?: (url: string) => void;
    wavesurferState?: WaveSurfer;
}

const SubtitleTable: React.FC<SubtitleTableProps> = ({ subtitles, setSubtitles, setSubtitleUrl, wavesurferState }) => {

    const [subtitle, setSubtitle] = useState<Subtitle>(new Subtitle({ start: '', end: '', text: '' }));
    const [index, setIndex] = useState(-1);
    const { toast } = useToast()
    const storage = new Storage();
    const [history, setHistory] = useState<any[]>([]);

    function onEdit(sub: Subtitle) {
        const index = subtitles.indexOf(sub);
        setSubtitle(sub);
        setIndex(index);
        editSubtitle(sub);
    }

    function onUpdate(sub: Subtitle) {
        if (check()) {
            updateSubtitle(index, new Subtitle({ start: sub.start, end: sub.end, text: sub.text }));
            setSubtitle(new Subtitle({ start: '', end: '', text: '' }));
            setIndex(-1);
        }
    }

    function onChange(name: string, value: string) {
        const updatedSubtitle = new Subtitle({ ...subtitle, [name as keyof Subtitle]: value });
        setSubtitle(updatedSubtitle);
    }

    function onRemove(sub: Subtitle) {
        removeSubtitle(sub);
        setSubtitle(new Subtitle({ start: '', end: '', text: '' }));
        setIndex(-1);
    }

    // 删除单个字幕
    function removeSubtitle(sub: Subtitle) {
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


    function check() {
        // const { index, subtitle } = state;
        // const { subtitles } = props;
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
    function checkSub(sub: Subtitle) {
        return subtitles.includes(sub);
    }

    // 激活单个字幕的编辑
    function editSubtitle(sub: Subtitle) {
        if (!checkSub(sub)) return;
        const subtitlesNew = subtitles.map((item: Subtitle) => {
            item.highlight = false;
            item.editing = false;
            return item;
        });
        sub.editing = true;
        updateSubtitles(subtitlesNew).then(() => {
            videoSeek(sub);
        });
    }


    // 更新所有字幕数据, 可选是否更新字幕地址和是否回退操作
    function updateSubtitles(subtitleList: Subtitle[], updateUrl?: boolean, isUndo?: boolean) {
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
                    setHistory(prevHistory => [...prevHistory, subtitleList.map((sub: Subtitle) => ({ ...sub }))]);
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
    function updateSubtitle(index: number, sub: Subtitle) {
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
    function updateCurrentIndex(sub: Subtitle) {
        if (!checkSub(sub)) return;
        const index = subtitles.indexOf(sub);
        setIndex(index);
    }

    // 视频跳转到某个字幕的开始时间, 可选是否播放
    function videoSeek(sub: Subtitle, isPlay: boolean = false) {
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
        const index: number = subtitles.indexOf(sub);
        const previous: Subtitle | undefined = subtitles[index - 1];
        return (previous && sub.startTime < previous.endTime) || !sub.check;
    }


    return (
        <AutoSizer disableHeight>
            {({ width }) => (


                <div className="flex flex-1 border-r border-gray-800">
                    <Table
                        width={width}
                        height={300}
                        gridClassName={"gridScrollWrap"}
                        headerHeight={20}
                        rowHeight={30}
                        rowCount={subtitles.length}
                        rowGetter={({ index }) => subtitles[index]}

                        headerRowRenderer={() => {
                            return (
                                <div className="flex bg-blue-500 border-b border-gray-800">
                                    <div className="row w-12 text-center"> {/* 50px approximately equals to 12 in Tailwind's scale */}
                                        #
                                    </div>
                                    <div className="row w-28 text-center"> {/* 100px approximately equals to 24 in Tailwind's scale */}
                                        {cn("start")}
                                    </div>
                                    <div className="row w-28 text-center"> {/* 100px approximately equals to 24 in Tailwind's scale */}
                                        {cn("end")}
                                    </div>
                                    <div className="row w-28 text-center">{cn("duration")}</div>
                                    <div className="row w-flex-1 text-center">
                                        {cn("text")}
                                    </div>
                                    <div className="row w-20 text-center"> {/* 90px approximately equals to 22 in Tailwind's scale */}
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
                            ${props.rowData.editing ? 'bg-blue-100' : ''} 
                            ${props.rowData.highlight ? 'bg-blue-200' : ''} 
                            ${checkSubtitleIllegal(props.rowData) ? 'bg-red-200' : ''}`}
                                    style={props.style}
                                >
                                    <div className="w-12">
                                        {props.index + 1}
                                    </div>
                                    <div className="w-28 ">
                                        <span className="edit">{props.rowData.start}</span>
                                        {/* <input
                                            maxLength={20}
                                            className="input bg-transparent border border-gray-300 rounded p-1 edit"
                                            value={subtitle.start}
                                            onChange={e => onChange('start', e.target.value)}
                                        /> */}
                                    </div>
                                    <div className="w-28 ">
                                        <span className="edit">{props.rowData.end}</span>
                                        {/* <input
                                            maxLength={20}
                                            className="input bg-transparent border border-gray-300 rounded p-1 edit"
                                            value={subtitle.end}
                                            onChange={e => onChange('end', e.target.value)}
                                        /> */}
                                    </div>
                                    <div className="w-28">
                                        <span className="edit">{props.rowData.duration}</span>
                                        {/* <input disabled maxLength={20} className="input bg-transparent border border-gray-300 rounded p-1 edit" value={subtitle.duration} /> */}
                                    </div>
                                    <div className="flex-1  w-500">
                                        <span className="edit ">
                                            {props.rowData.text.split(/\r?\n/).map((item: string, index: React.Key | null | undefined) => (
                                                <p key={index} className="m-0">{escapeHTML(item)}</p>
                                            ))}
                                        </span>
                                        {/* <textarea
                                            maxLength={100}
                                            className="textarea bg-transparent border border-gray-300 rounded p-1 edit"
                                            value={unescapeHTML(subtitle.text || '')}
                                            onChange={e => onChange('text', e.target.value)}
                                        /> */}
                                    </div>
                                    <div className="flex w-20">
                                        <ClockIcon className="h-5 w-5 text-gray-500" onClick={() => onEdit(props.rowData)} />
                                        <UserGroupIcon className="h-5 w-5 text-gray-500" onClick={() => onUpdate(props.rowData)} />
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

export default SubtitleTable;         