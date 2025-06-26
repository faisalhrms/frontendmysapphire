import React from 'react';

const ShimmerTable = ({ rows = 5, columns = 2, rowHeight = 'h-6' }) => {
    return (
        <div className="p-2 bg-white mb-4 rounded-lg dark:bg-bodybg">
            <div className="overflow-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i} className="p-2 border border-gray-300">
                                <div className={`w-full bg-gray-300 dark:bg-gray-600 animate-pulse ${rowHeight} rounded`} />
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <td key={colIndex} className="p-2 border border-gray-300">
                                    <div className={`w-full bg-gray-200 dark:bg-gray-700 animate-pulse ${rowHeight} rounded`} />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShimmerTable;
