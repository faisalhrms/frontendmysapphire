import React from "react";

export const RefreshingSpinner = ({text = 'Refreshing data...'}) => {
    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-slate-700 font-medium">{text}</span>
                </div>
            </div>
        </div>
    )
}

export default React.memo(RefreshingSpinner)