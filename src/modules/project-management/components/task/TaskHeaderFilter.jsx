import React, { useState, useRef, useEffect } from 'react';
import Avatar from "@components/Avatar.jsx";

const TaskHeaderFilter = ({
                              header,
                              filters,
                              setFilters,
                              projectUsers,
                              milestoneLaunch
                          }) => {
    const [tempDateFilter, setTempDateFilter] = useState({});
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [exactMatch, setExactMatch] = useState(false);
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

    const handleFilterChange = (key, value, type = 'value') => {
        setFilters(prev => {
            const newFilters = { ...prev };

            if (type === 'search') {
                if (!value || value.trim() === '') {
                    delete newFilters[`${key}_search`];
                } else {
                    newFilters[`${key}_search`] = value;
                }
            } else {
                if (
                    value === '' ||
                    value === null ||
                    (typeof value === 'object' && (!value.start && !value.end))
                ) {
                    delete newFilters[key];
                } else {
                    newFilters[key] = value;
                }
            }

            return newFilters;
        });
    };

    const clearFilter = (key) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
        });
    };

    const quickRanges = [
        {
            label: 'Today',
            range: () => {
                const today = new Date().toISOString().split('T')[0];
                return { start: today, end: today };
            }
        },
        {
            label: 'Yesterday',
            range: () => {
                const d = new Date();
                d.setDate(d.getDate() - 1);
                const day = d.toISOString().split('T')[0];
                return { start: day, end: day };
            }
        },
        {
            label: 'This Week',
            range: () => {
                const now = new Date();
                const start = new Date(now);
                start.setDate(now.getDate() - now.getDay());
                const end = new Date(start);
                end.setDate(start.getDate() + 6);
                return {
                    start: start.toISOString().split('T')[0],
                    end: end.toISOString().split('T')[0],
                };
            }
        },
        {
            label: 'Next Week',
            range: () => {
                const now = new Date();
                const start = new Date();
                start.setDate(now.getDate() - now.getDay() + 7);
                const end = new Date(start);
                end.setDate(start.getDate() + 6);
                return {
                    start: start.toISOString().split('T')[0],
                    end: end.toISOString().split('T')[0],
                };
            }
        },
        {
            label: 'Last 7 Days',
            range: () => {
                const end = new Date();
                const start = new Date();
                start.setDate(end.getDate() - 6);
                return {
                    start: start.toISOString().split('T')[0],
                    end: end.toISOString().split('T')[0],
                };
            }
        },
        {
            label: 'Last 30 Days',
            range: () => {
                const end = new Date();
                const start = new Date();
                start.setDate(end.getDate() - 29);
                return {
                    start: start.toISOString().split('T')[0],
                    end: end.toISOString().split('T')[0],
                };
            }
        },
        {
            label: 'This Month',
            range: () => {
                const now = new Date();
                const start = new Date(now.getFullYear(), now.getMonth(), 1);
                const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                return {
                    start: start.toISOString().split('T')[0],
                    end: end.toISOString().split('T')[0],
                };
            }
        },
        {
            label: 'Next Month',
            range: () => {
                const now = new Date();
                const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
                return {
                    start: start.toISOString().split('T')[0],
                    end: end.toISOString().split('T')[0],
                };
            }
        },
        {
            label: 'Last Month',
            range: () => {
                const now = new Date();
                const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const end = new Date(now.getFullYear(), now.getMonth(), 0);
                return {
                    start: start.toISOString().split('T')[0],
                    end: end.toISOString().split('T')[0],
                };
            }
        },
        {
            label: 'Coming 2 Months',
            range: () => {
                const now = new Date();
                const start = now;
                const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
                return {
                    start: start.toISOString().split('T')[0],
                    end: end.toISOString().split('T')[0],
                };
            }
        },
        {
            label: 'Year to Date',
            range: () => {
                const now = new Date();
                const start = new Date(now.getFullYear(), 0, 1);
                return {
                    start: start.toISOString().split('T')[0],
                    end: now.toISOString().split('T')[0],
                };
            }
        },
    ];


    const statusOptions = [
        { value: 'open', label: 'Open', color: 'bg-gray-500', textColor: 'text-gray-800', bgColor: 'bg-gray-100', icon: '○' },
        { value: 'not_started', label: 'Not Started', color: 'bg-gray-400', textColor: 'text-gray-800', bgColor: 'bg-gray-100', icon: '○' },
        { value: 'in_progress', label: 'In Progress', color: 'bg-primary', textColor: 'text-primary', bgColor: 'bg-primary/10', icon: '◐' },
        { value: 'half_completed', label: 'Half Completed', color: 'bg-info', textColor: 'text-info', bgColor: 'bg-info/10', icon: '◓' },
        { value: 'near_completion', label: 'Near Completion', color: 'bg-success/70', textColor: 'text-success', bgColor: 'bg-success/10', icon: '◔' },
        { value: 'completed', label: 'Completed', color: 'bg-success', textColor: 'text-success', bgColor: 'bg-success/10', icon: '●' },
        { value: 'reopened', label: 'Reopened', color: 'bg-secondary', textColor: 'text-secondary', bgColor: 'bg-secondary/10', icon: '↻' },
        { value: 'on_hold', label: 'On Hold', color: 'bg-warning', textColor: 'text-warning', bgColor: 'bg-warning/10', icon: '⏸' },
        { value: 'cancelled', label: 'Cancelled', color: 'bg-danger', textColor: 'text-danger', bgColor: 'bg-danger/10', icon: '✕' }
    ];

    const priorityOptions = [
        { value: 'high', label: 'High Priority', textColor: 'text-danger', bgColor: 'bg-danger/10', icon: '🔴', bColor: 'border-danger', dColor: 'bg-danger' },
        { value: 'medium', label: 'Medium Priority', textColor: 'text-warning', bgColor: 'bg-warning/10', icon: '🟡', bColor: 'border-warning', dColor: 'bg-warning' },
        { value: 'low', label: 'Low Priority', textColor: 'text-success', bgColor: 'bg-success/10', icon: '🟢', bColor: 'border-success', dColor: 'bg-success' }
    ];

    const renderFilterContent = () => {
        const dropdownContainer = "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 min-w-[280px] max-w-[400px] z-50";
        const headerClass = "flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750";
        const contentClass = "p-4 space-y-4";
        const footerClass = "flex items-center justify-between p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750";
        const inputClass = "w-full h-10 px-3 py-2 text-sm font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-400";
        const labelClass = "block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide";
        const secondaryButton = "inline-flex items-center px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md transition-colors duration-150 border border-gray-300 dark:border-gray-500";

        if (['started_at', 'ended_at', 'completed_at', 'launch'].includes(header.key)) {
            return (
                <div className={dropdownContainer}>
                    <div className={headerClass}>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Date Filter</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Filter by {header.label}</p>
                            </div>
                        </div>
                    </div>

                    <div className={contentClass}>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <input
                                    type="date"
                                    value={tempDateFilter.start || ''}
                                    onChange={(e) => setTempDateFilter(prev => ({...prev, start: e.target.value}))}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <input
                                    type="date"
                                    value={tempDateFilter.end || ''}
                                    onChange={(e) => setTempDateFilter(prev => ({...prev, end: e.target.value}))}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <button
                            className="mt-2 px-3 py-1 text-xs bg-primary text-white"
                            onClick={() => {
                                handleFilterChange(header.key, tempDateFilter);
                                setIsOpen(false);
                            }}
                        >
                            Apply
                        </button>

                        <div className="pt-2">
                            <label className={labelClass}>Quick Select</label>
                            <div className="flex flex-wrap gap-2">
                                {quickRanges.map(({label, range}) => {
                                    const {start, end} = range();
                                    const isActive = tempDateFilter.start === start && tempDateFilter.end === end;
                                    return (
                                        <button
                                            key={label}
                                            onClick={() => {
                                                const rangeValue = range();
                                                setTempDateFilter(rangeValue);
                                                handleFilterChange(header.key, rangeValue);
                                            }}
                                            className={`px-2 py-1 text-xs flex items-center gap-1 rounded transition-colors bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500`}
                                        >
                                            {label}
                                            {isActive && <i className="ri-check-line text-sm"></i>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className={footerClass}>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {(filters[header.key]?.start || filters[header.key]?.end) ?
                                `${filters[header.key]?.start || 'Start'} → ${filters[header.key]?.end || 'End'}` :
                                'No date range selected'
                            }
                        </div>
                        {(filters[header.key]?.start || filters[header.key]?.end) && (
                            <button
                                onClick={() => {
                                    clearFilter(header.key);
                                    setTempDateFilter({ start: '', end: '' });
                                }}
                                className={secondaryButton}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        switch (header.key) {
            case 'name':
                return (
                    <div className={dropdownContainer}>
                        <div className={headerClass}>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Search Filter</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Search by {header.label}</p>
                                </div>
                            </div>
                        </div>

                        <div className={contentClass}>
                            <div>
                                <label className={labelClass}>Search Term</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={`Enter ${header.label.toLowerCase()} to search...`}
                                        value={filters[header.key] || ''}
                                        onChange={(e) => handleFilterChange(header.key, e.target.value)}
                                        className={`${inputClass} pl-10`}
                                    />
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    {filters[header.key] && (
                                        <button
                                            onClick={() => clearFilter(header.key)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 text-xs">
                                <label className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                    <input
                                        type="checkbox"
                                        checked={caseSensitive}
                                        onChange={(e) => setCaseSensitive(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>Case sensitive</span>
                                </label>
                                <label className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                    <input
                                        type="checkbox"
                                        checked={exactMatch}
                                        onChange={(e) => setExactMatch(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>Exact match</span>
                                </label>
                            </div>
                        </div>

                        <div className={footerClass}>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {filters[header.key] ? `Searching for: "${filters[header.key]}"` : 'No search term'}
                            </div>
                            {filters[header.key] && (
                                <button onClick={() => clearFilter(header.key)} className={secondaryButton}>
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 'status':
                return (
                    <div className={dropdownContainer}>
                        <div className={headerClass}>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Status Filter</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Filter by status</p>
                                </div>
                            </div>
                        </div>

                        <div className={contentClass}>
                            <div className="space-y-2">
                                <label className={labelClass}>Available Options</label>
                                <div className="grid grid-cols-1 gap-1">
                                    {statusOptions.map(option => (
                                        <div
                                            key={option.value}
                                            className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                                filters[header.key] === option.value
                                                    ? `${option.bgColor} dark:${option.bgColor} dark:bg-opacity-20 border border-opacity-30 ${option.color.replace('bg-', 'border-')}`
                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-sm'
                                            }`}
                                            onClick={() => {
                                                handleFilterChange(header.key, filters[header.key] === option.value ? '' : option.value);
                                            }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-3.5 h-3.5 rounded-full ${option.color} shadow-sm ring-1 ring-white dark:ring-gray-800`}></div>
                                                <div className="flex flex-col">
                          <span className={`text-sm font-medium text-gray-900 dark:text-gray-100 ${
                              filters[header.key] === option.value
                                  ? option.textColor
                                  : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            {option.label}
                          </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                        <span className={`text-sm opacity-70 ${
                            filters[header.key] === option.value
                                ? option.textColor
                                : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {option.icon}
                        </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={footerClass}>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {filters[header.key] ?
                                    `Selected: ${statusOptions.find(s => s.value === filters[header.key])?.label}` :
                                    'All statuses shown'
                                }
                            </div>
                            {filters[header.key] && (
                                <button onClick={() => clearFilter(header.key)} className={secondaryButton}>
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 'priority':
                return (
                    <div className={dropdownContainer}>
                        <div className={headerClass}>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Priority Filter</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Filter by priority level</p>
                                </div>
                            </div>
                        </div>

                        <div className={contentClass}>
                            <div className="space-y-2">
                                <label className={labelClass}>Priority Levels</label>
                                <div className="space-y-1">
                                    {priorityOptions.map(option => (
                                        <div
                                            key={option.value}
                                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border-2 transition-all duration-200 hover:shadow-sm ${option.bgColor} ${option.bColor}`}
                                            onClick={() => {
                                                handleFilterChange(header.key, filters[header.key] === option.value ? '' : option.value);
                                            }}
                                        >
                                            <div className={`flex items-center space-x-3`}>
                                                <span className="text-lg">{option.icon}</span>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{option.label}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {option.value === 'high' && 'Critical items requiring immediate attention'}
                                                        {option.value === 'medium' && 'Important items with moderate urgency'}
                                                        {option.value === 'low' && 'Items that can be handled when convenient'}
                                                    </div>
                                                </div>
                                            </div>
                                            {filters[header.key] === option.value && (
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ml-2 text-white ${option.dColor}`}>
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={footerClass}>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {filters[header.key] ?
                                    `Showing: ${priorityOptions.find(p => p.value === filters[header.key])?.label}` :
                                    'All priorities shown'
                                }
                            </div>
                            {filters[header.key] && (
                                <button onClick={() => clearFilter(header.key)} className={secondaryButton}>
                                    Clear Filter
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 'person':
                return (
                    <div className={dropdownContainer}>
                        <div className={headerClass}>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Assignee Filter</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Filter by person assigned</p>
                                </div>
                            </div>
                        </div>

                        <div className={contentClass}>
                            <div>
                                <label className={labelClass}>Select Assignee</label>
                                <div className="space-y-2 max-h-48 overflow-auto">
                                    <div
                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                            !filters[header.key] ? 'bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700' : ''
                                        }`}
                                        onClick={() => {
                                            handleFilterChange(header.key, '');
                                        }}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">All People</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">Show items for everyone</div>
                                            </div>
                                        </div>
                                        {!filters[header.key] && (
                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>

                                    {projectUsers
                                        .filter((user) =>
                                            !filters[`${header.key}_search`] ||
                                            user.full_name.toLowerCase().includes(filters[`${header.key}_search`].toLowerCase())
                                        ).map(user => (
                                            <div
                                                key={user.id}
                                                className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                                    filters[header.key] === user.id ? 'bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700' : ''
                                                }`}
                                                onClick={() => {
                                                    handleFilterChange(header.key, filters[header.key] === user.id ? '' : user.id);
                                                }}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <Avatar avatar={user.avatar} full_name={user?.full_name || 'N/A'}/>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.full_name}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Team Member</div>
                                                    </div>
                                                </div>
                                                {filters[header.key] === user.id && (
                                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Quick Search</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={`Enter ${header.label.toLowerCase()} to search...`}
                                        value={filters[`${header.key}_search`] || ''}
                                        className={`${inputClass} pl-10`}
                                        onChange={(e) => handleFilterChange(header.key, e.target.value, 'search')}
                                    />
                                    <svg
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className={footerClass}>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>
                  {filters[header.key] ?
                      `Selected: ${projectUsers.find(u => u.id === filters[header.key])?.full_name}` :
                      `${projectUsers.length} team members available`
                  }
                </span>
                            </div>
                            {filters[header.key] && (
                                <button onClick={() => clearFilter(header.key)} className={secondaryButton}>
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-neutral-700`}
                aria-label={`Filter by ${header.label}`}
            >
                <i className={`ri-filter-2-line ${filters[header.key] ? 'text-success' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-neutral-700'}`}></i>
            </button>
            {isOpen && (
                <div className="absolute animate-fade-in" style={{ zIndex: 9 }}>
                    {renderFilterContent()}
                </div>
            )}
        </div>
    );
};

export default TaskHeaderFilter;