import React, { memo } from "react";
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, subtitle, isLoading }) => {
    const shimmerStyle = `
        @keyframes fullSweep {
            0% { transform: translateX(-100%) skewX(-15deg); }
            100% { transform: translateX(200%) skewX(-15deg); }
        }
    `;

    return (
        <div className="relative overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all hover:border-primary/50 dark:text-gray-200 dark:bg-bodybg">
            <style>{shimmerStyle}</style>

            {/* HEADER SECTION: Always visible and professional */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Change indicator: Shimmers only if loading */}
                {change !== undefined && (
                    <div className={`flex items-center space-x-1 text-sm font-semibold ${change >= 0 ? 'text-success' : 'text-danger'}`}>
                        {isLoading ? (
                            <div className="w-10 h-4 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
                        ) : (
                            <>
                                {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                <span>{Math.abs(change)}%</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* VALUE SECTION: Professional Shimmer Logic */}
            <div className="relative mt-2 min-h-[40px] flex items-center">
                {isLoading ? (
                    <div className="relative w-full h-10 overflow-hidden bg-gray-100 dark:bg-white/5 rounded-md">
                        {/* The Glass Sweep Effect */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '40%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                            animation: 'fullSweep 1.5s infinite ease-in-out',
                        }} />
                    </div>
                ) : (
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tabular-nums animate-in fade-in duration-500">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                )}
            </div>
        </div>
    );
};

export default memo(StatCard);