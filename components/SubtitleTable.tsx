import React from 'react';
import { Column, Table, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // 导入样式
import subtitles from "../public/video/subtitle.json";
// TODO Warning: findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of Grid which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here:

// 假设的字幕数据
// const subtitles = [
//     { id: 1, start: '00:00:01', end: '00:00:05', content: '这是第一条字幕' },
//     { id: 2, start: '00:00:06', end: '00:00:10', content: '这是第二条字幕' },
//     // 更多字幕...
// ];

const SubtitleTable = () => {
    return (
        <AutoSizer disableHeight>
            {({ width }) => (
                <Table
                    width={width}
                    height={300}
                    headerHeight={20}
                    rowHeight={30}
                    rowCount={subtitles.length}
                    rowGetter={({ index }) => subtitles[index]}
                >
                    <Column label="序号" dataKey="id" width={50} cellRenderer={({ rowIndex }) => rowIndex + 1} />
                    <Column label="开始时间" dataKey="start" width={100} />
                    <Column label="结束时间" dataKey="end" width={100} />
                    <Column label="内容" dataKey="content" width={width - 250} />
                </Table>
            )}
        </AutoSizer>
    );
};

export default SubtitleTable;         