import React from 'react';

const TbodyShimmer = ({ rows = 6, columns = 2, rowHeight = 'h-5' }) => {
    return (
        <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="even:bg-gray-50 dark:even:bg-gray-800">
                {Array.from({ length: columns }).map((_, colIndex) => {
                    const widthClasses = [
                        'w-2/3', 'w-1/2', 'w-3/4', 'w-full', 'w-[60%]', 'w-[80%]'
                    ];
                    const randomWidth = widthClasses[(rowIndex + colIndex) % widthClasses.length];

                    return (
                        <td key={colIndex} className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                            <div
                                className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${randomWidth} ${rowHeight} rounded-md`}
                            >
                                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-50" />
                            </div>
                        </td>
                    );
                })}
            </tr>
        ))}
        </tbody>
    );
};

export default TbodyShimmer;
