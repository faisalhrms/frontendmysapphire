import React, { memo } from "react";
import { TrendingUp, TrendingDown } from 'lucide-react';

const PulseLine = () => (
    <div className="absolute inset-0 flex items-center w-full">
        <svg
            className="w-full h-12 overflow-visible"
            viewBox="0 0 200 40"
            preserveAspectRatio="none"
        >
            {/* Background Static Line (Ghost Path) */}
            <path
                d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-gray-300/40 dark:text-white/15"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Glow effect underneath */}
            <path
                d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                fill="none"
                stroke="url(#pulse-glow)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse-scan blur-[2px]"
                style={{
                    strokeDasharray: '200',
                    strokeDashoffset: '200',
                }}
            />

            {/* Main Animated Pulse Line */}
            <path
                d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                fill="none"
                stroke="url(#pulse-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse-scan"
                style={{
                    strokeDasharray: '200',
                    strokeDashoffset: '200',
                }}
            />

            {/* Moving dot at the end of the pulse */}
            <circle
                cx="0"
                cy="20"
                r="2.5"
                fill="currentColor"
                className="text-primary animate-pulse-dot"
            >
                <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </circle>

            <defs>
                <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="currentColor" className="text-primary/20" stopOpacity="0.2" />
                    <stop offset="30%" stopColor="currentColor" className="text-primary" stopOpacity="1" />
                    <stop offset="70%" stopColor="currentColor" className="text-primary" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" className="text-primary/20" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="pulse-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="currentColor" className="text-primary/10" stopOpacity="0" />
                    <stop offset="50%" stopColor="currentColor" className="text-primary/40" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="currentColor" className="text-primary/10" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);

const StatCard = ({ title, value, change, icon: Icon, subtitle, isLoading, classes = '' }) => {
    const styles = `
    @keyframes pulseScan {
      0% { 
        stroke-dashoffset: 400;
      }
      50% {
        stroke-dashoffset: 200;
      }
      100% { 
        stroke-dashoffset: 0;
      }
    }
    
    @keyframes pulseDot {
      0% { 
        cx: 0;
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% { 
        cx: 200;
        opacity: 0;
      }
    }
    
    .animate-pulse-scan {
      animation: pulseScan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    
    .animate-pulse-dot {
      animation: pulseDot 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }
  `;

    return (
        <div className={`relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20 dark:bg-bodybg dark:border-white/5 dark:hover:border-primary/30  ${classes}`}>
            <style>{styles}</style>

            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.01] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* HEADER */}
            <div className="relative flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-primary/5 rounded-lg text-primary ring-1 ring-primary/5 dark:bg-primary/8 dark:ring-primary/15">
                        <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {title}
                        </h3>
                        {subtitle && !isLoading && (
                            <p className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {change !== undefined && !isLoading && (
                    <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                        change >= 0
                            ? 'bg-success/10 text-success ring-1 ring-success/20'
                            : 'bg-danger/10 text-danger ring-1 ring-danger/20'
                    }`}>
                        {change >= 0 ? (
                            <TrendingUp size={12} className="mr-1" strokeWidth={2.5} />
                        ) : (
                            <TrendingDown size={12} className="mr-1" strokeWidth={2.5} />
                        )}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>

            {/* VALUE / PULSE SECTION */}
            <div className="relative mt-6 h-12 flex items-center">
                {isLoading ? (
                    <div className="w-full relative">
                        <PulseLine />
                        <div className="absolute -bottom-5 left-0 flex items-center space-x-2">
                            <div className="flex space-x-1">
                                <span className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                                <span className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                                <span className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-[9px] uppercase tracking-wider text-primary/60 font-semibold">
                                Analyzing
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-baseline space-x-1 animate-fade-in">
                        <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white tabular-nums animate-in fade-in duration-500">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(StatCard);
