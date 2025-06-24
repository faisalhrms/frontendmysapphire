import React, { useRef, useEffect, useState } from 'react';

const TaskHeaderSort = ({
                            header,
                            sortConfig,
                            handleSortRequest,
                            handleMoveColumn,
                            orderedVisibleHeaders,
                            isSortable,
                        }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSort = (e) => {
        e.stopPropagation();
        handleSortRequest(header.key);
    };

    const handleMove = (e, direction) => {
        e.stopPropagation();
        handleMoveColumn(header.key, direction);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`rounded-full transition-colors duration-200 ${
                    sortConfig.key === header.key
                        ? 'text-info text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-neutral-700'
                }`}
                aria-label={`Sort by ${header.label}`}
            >
                <i
                    className={`ri-arrow-${
                        sortConfig.key === header.key
                            ? sortConfig.direction === 'asc'
                                ? 'up'
                                : 'down'
                            : 'up-down'
                    }-line`}
                ></i>
            </button>

            {isOpen && (
                <div className="absolute right-0 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md shadow-lg p-2 z-50">
                    {isSortable && (
                        <button
                            onMouseDown={handleSort}
                            className="w-full text-left flex items-center gap-x-2 py-2 px-3 text-xs text-gray-500 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                        >
                            <i
                                className={`ri-arrow-${
                                    sortConfig.key === header.key && sortConfig.direction === 'asc'
                                        ? 'down'
                                        : 'up'
                                }-line`}
                            ></i>
                            Sort{' '}
                            {sortConfig.key === header.key && sortConfig.direction === 'asc'
                                ? 'Descending'
                                : 'Ascending'}
                        </button>
                    )}

                    <button
                        onMouseDown={(e) => handleMove(e, 'left')}
                        disabled={orderedVisibleHeaders.indexOf(header) === 0}
                        className="w-full text-left flex items-center gap-x-2 py-2 px-3 text-xs text-gray-500 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <i className="ri-arrow-left-line"></i>
                        Move Left
                    </button>

                    <button
                        onMouseDown={(e) => handleMove(e, 'right')}
                        disabled={orderedVisibleHeaders.indexOf(header) === orderedVisibleHeaders.length - 1}
                        className="w-full text-left flex items-center gap-x-2 py-2 px-3 text-xs text-gray-500 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <i className="ri-arrow-right-line"></i>
                        Move Right
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskHeaderSort;
