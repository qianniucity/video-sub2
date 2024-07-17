import React from 'react';
import { Label } from '@/components/ui/label';

type Dictionary = Record<string, string>;

interface SubtitleStyleProps {
    dict: Dictionary;
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

const SubtitleStyle: React.FC<SubtitleStyleProps> = ({
    dict,
    fontSize, setFontSize,
    lineHeight, setLineHeight,
    showTextShadow, setShowTextShadow,
    subtitleColor, setSubtitleColor,
    showBackgroundColor, setShowBackgroundColor
}) => {
    return (
        <ul role="list" className="space-y-4 text-gray-500 dark:text-gray-400">
            <li className="flex space-x-2  items-center">
                <Label htmlFor="font-size-slider" className="inline-flex items-center cursor-pointer">
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {dict.subtitle_font_size}:
                    </span>
                    <input
                        id="font-size-slider"
                        type="range"
                        min="20"
                        max="50"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                    />
                </Label>
            </li>
            <li className="flex space-x-2  items-center">
                <Label htmlFor="line-height-slider" className="inline-flex items-center cursor-pointer">
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {dict.subtitle_line_height}:
                    </span>
                    <input
                        id="line-height-slider"
                        type="range"
                        min="10"
                        max="300"
                        value={lineHeight}
                        onChange={(e) => setLineHeight(Number(e.target.value))}
                    />
                </Label>
            </li>
            <li className="flex space-x-2  items-center">
                <Label htmlFor="subtitle-color-picker" className="inline-flex items-center cursor-pointer">
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {dict.subtitle_color}:
                    </span>
                    <input
                        id="subtitle-color-picker"
                        type="color"
                        value={subtitleColor}
                        onChange={(e) => setSubtitleColor(e.target.value)} // 步骤 2: 用户选择颜色时更新 subtitleColor 状态
                    />
                </Label>
            </li>
            <li className="flex space-x-2  items-center">
                <Label className="inline-flex items-center cursor-pointer">
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {dict.subtitle_font_shadow}:
                    </span>
                    <input
                        type="checkbox"
                        value={showTextShadow.toString()}
                        onChange={(e) => setShowTextShadow(e.target.checked)}
                        className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>

                </Label>
            </li>
            <li className="flex space-x-2  items-center">
                <Label className="inline-flex items-center cursor-pointer">
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {dict.subtitle_background_color}:
                    </span>
                    <input
                        type="checkbox"
                        value={showBackgroundColor.toString()}
                        onClick={() => setShowBackgroundColor(!showBackgroundColor)}
                        className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </Label>
            </li>
        </ul>
    );
}

export default SubtitleStyle;