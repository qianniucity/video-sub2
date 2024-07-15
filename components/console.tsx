import React, { useState } from 'react';
import { useWaveSurfer } from './waveSurferContext';

interface ConsoleProps {
}


const Console: React.FC<ConsoleProps> = ({ }) => {
    const [activeTab, setActiveTab] = useState('#subtitles-type');

    const handleTabClick = (tabSelector: string) => {
        setActiveTab(tabSelector);
    };

    const { sliderRef } = useWaveSurfer();

    return (
        <div className="w-full bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700 h-10">
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
                    <h2>字幕样式</h2>
                </div>
                <div className={`${activeTab === '#subtitles-edit' ? 'block' : 'hidden'} p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800`} id="subtitles-edit" role="tabpanel" aria-labelledby="subtitles-edit-tab">
                    <h2>字幕编辑</h2>
                </div>
                <div className={`${activeTab === '#subtitles-other' ? 'block' : 'hidden'} p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800`} id="subtitles-other" role="tabpanel" aria-labelledby="subtitles-other-tab">
                    <dl className="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-6 dark:text-white sm:p-8">
                        <div className="ms-2 text-sm">
                            <label>
                                音波缩放:
                                <input ref={sliderRef} type="range" min="10" max="300" defaultValue="200" />
                            </label>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}

export default Console;