import React, { memo } from "react";
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow hover:border-primary dark:text-gray-200 dark:bg-bodybg">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-200 dark:bg-bodybg">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">{subtitle}</p>}
                </div>
            </div>
            {change !== undefined && (
                <div className={`flex items-center space-x-1 text-sm font-semibold ${change >= 0 ? 'text-success' : 'text-danger'}`}>
                    {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{Math.abs(change)}%</span>
                </div>
            )}
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg">{typeof value === 'string' ? value : value.toLocaleString()}</p>
    </div>
);

export default memo(StatCard);