import React from "react";
import { ChevronDown } from "lucide-react";

export default function TextFormattingUI({
                                             reviewText,
                                             onReviewTextChange,
                                             font,
                                             onFontChange,
                                             fontSize,
                                             onFontSizeChange,
                                             textColor,
                                             onTextColorChange,
                                         }) {
    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full dark:text-gray-200 dark:bg-bodybg">
                <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-200">Additional Text</h2>

                <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-[0.875rem] mb-1 font-semibold">Additional Text</div>
                        <div className="text-[0.875rem] mb-1 font-semibold">Font</div>
                        <div className="text-[0.875rem] mb-1 font-semibold">Font Size</div>
                        <div className="text-[0.875rem] mb-1 font-semibold">Text Color</div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 items-center">

                        <input
                            type="text"
                            value={reviewText || ""}
                            onChange={(e) => onReviewTextChange(e.target.value)}
                            placeholder="additional text..."
                            className="px-3 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                        {/* Font Select */}
                        <div className="relative">
                            <select
                                value={font || "Arial"}
                                onChange={(e) => onFontChange(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none pr-8"
                            >
                                <option value="Times">Times</option>
                                <option value="Arial">Arial</option>
                                <option value="Helvetica">Helvetica</option>
                                <option value="Georgia">Georgia</option>
                            </select>
                            {/*<ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />*/}
                        </div>

                        {/* Font Size Select */}
                        <div className="relative">
                            <select
                                value={fontSize || "16"}
                                onChange={(e) => onFontSizeChange(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none pr-8"
                            >
                                <option value="12">12</option>
                                <option value="14">14</option>
                                <option value="16">16</option>
                                <option value="18">18</option>
                                <option value="24">24</option>
                                <option value="36">36</option>
                                <option value="48">48</option>
                            </select>
                            {/*<ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />*/}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={textColor}
                                onChange={(e) => onTextColorChange(e.target.value)}
                                className="form-control w-full !rounded-sm border-gray  form-control-color !border-0 block"

                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}