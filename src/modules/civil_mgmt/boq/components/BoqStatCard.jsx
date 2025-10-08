import React from "react";

const BoqStatCard = ({icon, label, value, sublabel}) => {
    return (
        <div
            className="bg-white border border-gray-200 rounded-lg p-5 hover:border-primary/20 hover:shadow-sm transition-all duration-200 dark:text-gray-200 dark:bg-bodybg">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                    {icon}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-200 dark:bg-bodybg">{label}</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1 dark:text-gray-200 dark:bg-bodybg">{value}</div>
            {sublabel && <div className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">{sublabel}</div>}
        </div>
    )
}

export default BoqStatCard