import React, { memo } from "react";

const styles = `
  @keyframes pulseScan {
    0% { stroke-dashoffset: 400; }
    50% { stroke-dashoffset: 200; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes pulseDot {
    0% { cx: 0; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { cx: 200; opacity: 0; }
  }
  .animate-pulse-scan { animation: pulseScan 2.5s cubic-bezier(0.4,0,0.2,1) infinite; }
  .animate-pulse-dot  { animation: pulseDot  2.5s cubic-bezier(0.4,0,0.2,1) infinite; }
`;

const PulseScan = ({ className = "" }) => {
    return (
        <div className={`w-full relative h-12 ${className}`}>
            <style>{styles}</style>

            <div className="absolute inset-0 flex items-center w-full">
                <svg className="w-full h-12 overflow-visible" viewBox="0 0 200 40" preserveAspectRatio="none">
                    {/* Ghost path */}
                    <path
                        d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-white/15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Glow */}
                    <path
                        d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                        fill="none"
                        stroke="url(#pulse-glow)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-pulse-scan blur-[2px]"
                        style={{ strokeDasharray: "200", strokeDashoffset: "200" }}
                    />

                    {/* Main */}
                    <path
                        d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                        fill="none"
                        stroke="url(#pulse-gradient)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-pulse-scan"
                        style={{ strokeDasharray: "200", strokeDashoffset: "200" }}
                    />

                    {/* Moving dot */}
                    <circle cx="0" cy="20" r="2.5" fill="currentColor" className="text-white animate-pulse-dot">
                        <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" />
                    </circle>

                    <defs>
                        <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                            <stop offset="30%" stopColor="currentColor" stopOpacity="1" />
                            <stop offset="70%" stopColor="currentColor" stopOpacity="1" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                        </linearGradient>

                        <linearGradient id="pulse-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                            <stop offset="50%" stopColor="currentColor" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
};

export default memo(PulseScan);
