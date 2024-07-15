import React, { useRef, useState } from 'react';

interface SettingProps {
    fontSize: number;
    setFontSize: (fontSize: number) => void;
    lineHeight: number;
    setLineHeight: (lineHeight: number) => void;
    showTextShadow: boolean;
    setShowTextShadow: (showTextShadow: boolean) => void;
    subtitleColor: string;
    setSubtitleColor: (subtitleColor: string) => void;
    showBackgroundColor: boolean;
    setShowBackgroundColor: (showBackgroundColor: boolean) => void;

}


const Console: React.FC<SettingProps> = ({
    fontSize, setFontSize,
    lineHeight, setLineHeight,
    showTextShadow, setShowTextShadow,
    subtitleColor, setSubtitleColor,
    showBackgroundColor, setShowBackgroundColor
}) => {
    const [activeTab, setActiveTab] = useState('#subtitles-type');
    const sliderRef = useRef<HTMLInputElement>(null);// 缩放滑块引用


    const handleTabClick = (tabSelector: string) => {
        setActiveTab(tabSelector);
    };

    return (
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 rounded-t-lg bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800" id="defaultTab" data-tabs-toggle="#defaultTabContent" role="tablist">
                <li className="me-2">
                    <button onClick={() => handleTabClick('#subtitles-type')} id="subtitles-type-tab" data-tabs-target="#subtitles-type" type="button" role="tab" aria-controls="subtitles-type" aria-selected={activeTab === '#subtitles-type'} className={`${activeTab === '#subtitles-type' ? 'text-blue-600 rounded-ss-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-blue-500' : 'hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300'} inline-block p-4`}>字幕样式</button>
                </li>
                <li className="me-2">
                    <button onClick={() => handleTabClick('#subtitles-edit')} id="subtitles-edit-tab" data-tabs-target="#subtitles-edit" type="button" role="tab" aria-controls="subtitles-edit" aria-selected={activeTab === '#subtitles-edit'} className={`${activeTab === '#subtitles-edit' ? 'text-blue-600 rounded-ss-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-blue-500' : 'hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300'} inline-block p-4`}>字幕编辑</button>
                </li>
                <li className="me-2">
                    <button onClick={() => handleTabClick('#subtitles-other')} id="subtitles-other-tab" data-tabs-target="#subtitles-other" type="button" role="tab" aria-controls="subtitles-other" aria-selected={activeTab === '#subtitles-other'} className={`${activeTab === '#subtitles-other' ? 'text-blue-600 rounded-ss-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-blue-500' : 'hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300'} inline-block p-4`}>其他</button>
                </li>
            </ul>
            <div id="defaultTabContent">
                <div className={`${activeTab === '#subtitles-type' ? 'block' : 'hidden'} p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800`} id="subtitles-type" role="tabpanel" aria-labelledby="subtitles-type-tab">
                    <ul role="list" className="space-y-4 text-gray-500 dark:text-gray-400">
                        <li className="flex space-x-2 rtl:space-x-reverse items-center">
                            <label htmlFor="font-size-slider">调整字幕字体大小:</label>
                            <input
                                id="font-size-slider"
                                type="range"
                                min="20"
                                max="50"
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                            />
                        </li>
                        <li className="flex space-x-2 rtl:space-x-reverse items-center">
                            <label htmlFor="line-height-slider">line-height:</label>
                            <input
                                id="line-height-slider"
                                type="range"
                                min="10"
                                max="300"
                                value={lineHeight}
                                onChange={(e) => setLineHeight(Number(e.target.value))}
                            />
                        </li>
                        <li className="flex space-x-2 rtl:space-x-reverse items-center">
                            <label htmlFor="subtitle-color-picker">选择字幕颜色:</label>
                            <input
                                id="subtitle-color-picker"
                                type="color"
                                value={subtitleColor}
                                onChange={(e) => setSubtitleColor(e.target.value)} // 步骤 2: 用户选择颜色时更新 subtitleColor 状态
                            />
                        </li>
                        <li className="flex space-x-2 rtl:space-x-reverse items-center">
                            <button
                                onClick={() => setShowTextShadow(!showTextShadow)}
                                style={{
                                    padding: '10px 10px',
                                    border: 'none',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    borderRadius: '9999px', // 设置一个很大的 border-radius 使按钮变成胶囊形状
                                    cursor: 'pointer',
                                }}
                            >
                                {showTextShadow ? '隐藏 Text Shadow' : '显示 Text Shadow'}
                            </button>
                        </li>
                        <li className="flex space-x-2 rtl:space-x-reverse items-center">
                            <button
                                onClick={() => setShowBackgroundColor(!showBackgroundColor)}
                                style={{
                                    padding: '10px 20px',
                                    border: 'none',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    borderRadius: '9999px',
                                    cursor: 'pointer',
                                    margin: '10px 0', // 添加一些外边距
                                }}
                            >
                                {showBackgroundColor ? '隐藏背景颜色' : '显示背景颜色'}
                            </button>
                        </li>
                    </ul>
                </div>
                <div className={`${activeTab === '#subtitles-edit' ? 'block' : 'hidden'} p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800`} id="subtitles-edit" role="tabpanel" aria-labelledby="subtitles-edit-tab">
                    <ul role="list" className="space-y-4 text-gray-500 dark:text-gray-400">
                        <li className="flex space-x-2 rtl:space-x-reverse items-center">
                            <svg className="flex-shrink-0 w-3.5 h-3.5 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            <span className="leading-tight">Templates for everyone</span>
                        </li>
                        <li className="flex space-x-2 rtl:space-x-reverse items-center">
                            <svg className="flex-shrink-0 w-3.5 h-3.5 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            <span className="leading-tight">Development workflow</span>
                        </li>
                        <li className="flex space-x-2 rtl:space-x-reverse items-center">
                            <svg className="flex-shrink-0 w-3.5 h-3.5 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            <span className="leading-tight">Limitless business automation</span>
                        </li>
                    </ul>
                </div>
                <div className={`${activeTab === '#subtitles-other' ? 'block' : 'hidden'} p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800`} id="subtitles-other" role="tabpanel" aria-labelledby="subtitles-other-tab">
                    <ul role="list" className="space-y-4 text-gray-500 dark:text-gray-400">
                        <li className="flex space-x-2 rtl:space-x-reverse items-center">
                            <label>
                                音波缩放: <input ref={sliderRef} type="range" min="10" max="300" defaultValue="200" />
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>


    );
}

export default Console;