import React from "react";
import { X } from "lucide-react";

const FrameSelector = ({ frames, selectedFrame, onSelect }) => {
    const renderPreview = (id) => {
        const size = 40;
        switch (id) {
            case "none":
                return (
                    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
                        <rect
                            x="6"
                            y="6"
                            width="36"
                            height="36"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="2"
                            strokeDasharray="3 4"
                            rx="2"
                        />
                    </svg>
                );
            case "basic":
                return (
                    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
                        <rect
                            x="6"
                            y="6"
                            width="36"
                            height="36"
                            fill="none"
                            stroke="#9CA3AF"
                            strokeWidth="2"
                        />
                    </svg>
                );
            case "rounded":
                return (
                    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
                        <rect
                            x="6"
                            y="6"
                            width="36"
                            height="36"
                            fill="none"
                            stroke="#9CA3AF"
                            strokeWidth="2"
                            rx="8"
                        />
                        <rect x="18" y="18" width="12" height="12" fill="#F3F4F6" rx="2" />
                    </svg>
                );
            case "decorative":
                return (
                    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
                        <rect
                            x="6"
                            y="6"
                            width="36"
                            height="36"
                            fill="none"
                            stroke="#A78BFA"
                            strokeWidth="2"
                            strokeDasharray="4 3"
                            rx="4"
                        />
                        <circle cx="36" cy="36" r="2" fill="#C4B5FD" />
                    </svg>
                );
            case "gradient":
                return (
                    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
                        <defs>
                            <linearGradient id="gGrad" x1="0" x2="1">
                                <stop offset="0%" stopColor="#A78BFA" />
                                <stop offset="100%" stopColor="#F472B6" />
                            </linearGradient>
                        </defs>
                        <rect
                            x="6"
                            y="6"
                            width="36"
                            height="36"
                            fill="none"
                            stroke="url(#gGrad)"
                            strokeWidth="3"
                            rx="6"
                        />
                    </svg>
                );
            default:
                return (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">
                        {id}
                    </div>
                );
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full dark:text-gray-200 dark:bg-bodybg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-200 dark:bg-bodybg">Frame</h3>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {/* ❌ Clear Frame Option */}
                    <button
                        type="button"
                        onClick={() => onSelect(null)}
                        className={`relative flex items-center justify-center w-20 h-20 p-2 rounded-lg border transition-all duration-150
                        ${!selectedFrame ? "border-primary ring-2 ring-primary bg-gray-100" : "border-gray-200 hover:border-primary bg-white"}
                    `}
                        title="Remove Frame"
                    >
                        <X className="w-8 h-8 text-gray-400"/>
                    </button>

                    {/* Frame Options */}
                    {frames.map((frame) => (
                        <button
                            key={frame.id}
                            type="button"
                            onClick={() => onSelect(frame.id)}
                            title={frame.name}
                            aria-pressed={selectedFrame === frame.id}
                            className={`relative flex items-center justify-center p-2 w-20 h-20 rounded-lg border transition-all duration-150
                            ${selectedFrame === frame.id
                                ? "border-primary ring-2 ring-primary bg-gray-100"
                                : "border-gray-200 hover:border-primary bg-white"}
                        `}
                        >
                            <div className="w-10 h-10">{renderPreview(frame.id)}</div>
                            <span className="sr-only">{frame.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
            );
            };

            export default FrameSelector;
