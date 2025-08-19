import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {usePagination, useSortBy, useTable} from 'react-table';
import ExcelJS from 'exceljs';
import { Inbox } from "lucide-react";
import PropTypes from "prop-types";
import {useDataTable} from "@hooks/dataTableHooks.js";
import DatatableAdvanceFilters from "@components/datatable/DatatableAdvanceFilters.jsx";
import {useDispatch, useSelector} from "react-redux";
import {updateColumnOrder, updateColumnWidths} from "@redux/common/tableConfigSlice.js";
import EmptyState from "@components/EmptyState.jsx";
import TableShimmerRow from "@components/TableShimmerRow.jsx";

/**
 * Safely gets nested values (e.g., "employee.location.name") from an object.
 * If any segment is missing/undefined, returns undefined.
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, key) => {
        if (acc && acc[key] !== undefined) {
            return acc[key];
        }
        return undefined;
    }, obj);
}

const DataTable = React.memo(React.forwardRef(({
                                                   columns,
                                                   apiUrl,
                                                   title = null,
                                                   buttons,
                                                   filter = {},
                                                   needHeader = true,
                                                   enableAdvancedFilters = false,
                                                   tableParentClass = 'task-table overflow-hidden transition-all duration-300 min-h-[200px] !rounded-l-none',
                                                   tableClass = 'whitespace-nowrap table-bordered min-w-full !border-l',
                                                   rowClassName = 'bg-gray-100 dark:bg-neutral-700',
                                                   externalFilters = [],
                                                   hiddenParameters = []
                                               }, ref) => {

    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const EMPTY_ARRAY = Object.freeze([]);
    const EMPTY_OBJECT = Object.freeze({});
    const dispatch = useDispatch();
    const selectColumnOrder = (state, apiUrl) => state.tableConfig[apiUrl]?.columnOrder || EMPTY_ARRAY;
    const selectTableConfig = (state, apiUrl) => state.tableConfig[apiUrl] || EMPTY_OBJECT;
    const selectColumnWidths = (state, apiUrl) => state.tableConfig[apiUrl]?.columnWidths || EMPTY_OBJECT;

    const storedColumnOrder = useSelector((state) => selectColumnOrder(state, apiUrl));
    const tableConfig = useSelector((state) => selectTableConfig(state, apiUrl));
    const storedColumnWidths = useSelector((state) => selectColumnWidths(state, apiUrl));

    const normalizedColumns = useMemo(() => {
        return (columns || []).map((col, idx) => ({
            ...col,
            id: col.id || col.accessor || `col_${idx}`,
            width: col.width || 200,
            minWidth: col.minWidth || 100,
            maxWidth: col.maxWidth || 1000,
        }));
    }, [columns]);

    const [columnWidths, setColumnWidths] = useState(() => {
        const widths = {};
        normalizedColumns.forEach(col => {
            if (storedColumnWidths[col.id] !== undefined) {
                widths[col.id] = storedColumnWidths[col.id];
            }
            else {
                widths[col.id] = col.width || 200;
            }
        });
        return widths;
    });

    useEffect(() => {
        setColumnWidths(prevWidths => {
            const newWidths = {...prevWidths};
            let hasChanges = false;

            normalizedColumns.forEach(col => {
                if (newWidths[col.id] === undefined) {
                    newWidths[col.id] = col.width || 200;
                    hasChanges = true;
                }
            });

            Object.keys(newWidths).forEach(colId => {
                if (!normalizedColumns.some(col => col.id === colId)) {
                    delete newWidths[colId];
                    hasChanges = true;
                }
            });

            return hasChanges ? newWidths : prevWidths;
        });
    }, [normalizedColumns]);

    useEffect(() => {
        if (Object.keys(storedColumnWidths).length > 0) {
            setColumnWidths(prevWidths => {
                const newWidths = {...prevWidths};
                let hasChanges = false;

                normalizedColumns.forEach(col => {
                    if (storedColumnWidths[col.id] !== undefined &&
                        storedColumnWidths[col.id] !== prevWidths[col.id]) {
                        newWidths[col.id] = storedColumnWidths[col.id];
                        hasChanges = true;
                    }
                });

                return hasChanges ? newWidths : prevWidths;
            });
        }
    }, [storedColumnWidths, normalizedColumns]);

    const [columnOrder, setColumnOrder] = useState(() =>
        storedColumnOrder.length > 0 ? storedColumnOrder : normalizedColumns.map(col => col.id)
    );

    useEffect(() => {
        if (storedColumnOrder.length === 0 && normalizedColumns.length > 0 && columnOrder.length === 0) {
            const newOrder = normalizedColumns.map(col => col.id);
            setColumnOrder(newOrder);
        }
    }, [normalizedColumns, storedColumnOrder, columnOrder.length]);

    const handleMoveColumn = useCallback((headerId, direction) => {
        setColumnOrder(prevOrder => {
            const currentIndex = prevOrder.indexOf(headerId);
            if (currentIndex === -1) return prevOrder;

            const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
            if (newIndex < 0 || newIndex >= prevOrder.length) return prevOrder;

            const newOrder = [...prevOrder];
            [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];

            // Save to Redux
            dispatch(updateColumnOrder({
                apiKey: apiUrl,
                columnOrder: newOrder
            }));

            return newOrder;
        });
    }, [apiUrl, dispatch]);

    const handleColumnResize = useCallback((columnId, width) => {
        const columnDefinition = normalizedColumns.find(col => col.id === columnId);
        const minW = columnDefinition?.minWidth || 100;
        const maxW = columnDefinition?.maxWidth || 1000;

        const newWidth = Math.max(minW, Math.min(maxW, width));

        setColumnWidths(prev => {
            if (prev[columnId] === newWidth) {
                return prev;
            }
            return {
                ...prev,
                [columnId]: newWidth
            };
        });
    }, [normalizedColumns]); // <<< IMPORTANT: Add normalizedColumns as a dependency

    const saveTimeoutRef = useRef(null);
    useEffect(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            if (Object.keys(columnWidths).length > 0) {
                dispatch(updateColumnWidths({
                    apiKey: apiUrl,
                    columnWidths
                }));
            }
        }, 300);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [columnWidths, apiUrl, dispatch]);

    const ColumnResizer = React.memo(({ column }) => {
        const [isDragging, setIsDragging] = useState(false);
        const startPositionRef = useRef({ x: 0, width: 0 });

        const handleMouseDown = useCallback((e) => {
            e.preventDefault();
            e.stopPropagation();

            const currentWidth = columnWidths[column.id] || (column.width || 200);
            setIsDragging(true);
            setIsResizing(true);
            startPositionRef.current = {
                x: e.clientX,
                width: currentWidth
            };

            const handleMouseMove = (moveEvent) => {
                const diff = moveEvent.clientX - startPositionRef.current.x;
                handleColumnResize(column.id, startPositionRef.current.width + diff);
            };

            const handleMouseUp = () => {
                setIsDragging(false);
                setIsResizing(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        }, [column.id, column.width, columnWidths, handleColumnResize]);

        return (
            <div
                className={`absolute top-0 right-[-4px] w-[8px] h-full cursor-col-resize transition-colors duration-150 ${
                    isDragging ? '' : ''
                }`}
                onMouseDown={handleMouseDown}
                style={{ zIndex: 10 }}
            />
        );
    });

    const EnhancedHeader = ({ column, handleSortChange, sortField, sortDirection }) => {
        const headerLabel = column.render ? column.render('Header') : column.Header;
        const [isOpen, setIsOpen] = useState(false);
        const dropdownRef = useRef(null);
        const headerId = column.filterKey || column.id || column.accessor;
        const currentIndex = columnOrder.indexOf(headerId);

        const isCurrentlySorted = sortField === headerId;
        const currentSortDirection = isCurrentlySorted ? sortDirection : null;

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        const handleSort = useCallback((direction) => {
            if (direction === 'clear') {
                handleSortChange(null, null);
            } else {
                handleSortChange(headerId, direction);
            }
            setIsOpen(false);
        }, [headerId, handleSortChange]);

        return (
            <div className="flex items-center justify-between w-full relative pr-2">
                <div className="flex items-center flex-1 min-w-0">
                    <span className="truncate">{headerLabel}</span>
                    {isCurrentlySorted && (
                        <span className="ml-1 flex-shrink-0">
                            {currentSortDirection === 'asc' ? (
                                <i className="ri-arrow-up-line text-blue-500"></i>
                            ) : (
                                <i className="ri-arrow-down-line text-blue-500"></i>
                            )}
                        </span>
                    )}
                </div>

                <div className="relative ml-2 flex-shrink-0" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="rounded-full transition-colors duration-200 text-gray-500 hover:bg-gray-200 dark:hover:bg-neutral-700 p-1"
                        aria-label={`Column options for ${column.Header}`}
                    >
                        <i className="ri-more-2-line"></i>
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 w-40 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md shadow-lg py-1 z-50">
                            {!column.disableSortBy && (
                                <>
                                    <button
                                        onClick={() => handleSort('asc')}
                                        className={`w-full text-left flex items-center gap-x-2 py-2 px-3 text-xs hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                                            currentSortDirection === 'asc' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-gray-500 dark:text-neutral-200'
                                        }`}
                                    >
                                        <i className="ri-arrow-up-line"></i>
                                        Sort Ascending
                                        {currentSortDirection === 'asc' && <i className="ri-check-line ml-auto"></i>}
                                    </button>

                                    <button
                                        onClick={() => handleSort('desc')}
                                        className={`w-full text-left flex items-center gap-x-2 py-2 px-3 text-xs hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                                            currentSortDirection === 'desc' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-gray-500 dark:text-neutral-200'
                                        }`}
                                    >
                                        <i className="ri-arrow-down-line"></i>
                                        Sort Descending
                                        {currentSortDirection === 'desc' && <i className="ri-check-line ml-auto"></i>}
                                    </button>

                                    {isCurrentlySorted && (
                                        <button
                                            onClick={() => handleSort('clear')}
                                            className="w-full text-left flex items-center gap-x-2 py-2 px-3 text-xs text-gray-500 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                                        >
                                            <i className="ri-close-line"></i>
                                            Clear Sort
                                        </button>
                                    )}

                                    <hr className="my-1 border-gray-200 dark:border-neutral-700" />
                                </>
                            )}

                            <button
                                onClick={() => {
                                    handleMoveColumn(headerId, 'left');
                                    setIsOpen(false);
                                }}
                                disabled={currentIndex === 0}
                                className="w-full text-left flex items-center gap-x-2 py-2 px-3 text-xs text-gray-500 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <i className="ri-arrow-left-line"></i>
                                Move Left
                            </button>

                            <button
                                onClick={() => {
                                    handleMoveColumn(headerId, 'right');
                                    setIsOpen(false);
                                }}
                                disabled={currentIndex === columnOrder.length - 1}
                                className="w-full text-left flex items-center gap-x-2 py-2 px-3 text-xs text-gray-500 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <i className="ri-arrow-right-line"></i>
                                Move Right
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const {
        data,
        isLoading,
        error,
        refetch,
        page,
        setPage,
        size,
        search,
        advancedFilters,
        sortField,
        sortDirection,
        handleSearch,
        handleSizeChange,
        handleSortChange,
        handleFilterChange,
        applyAdvancedFilters,
        clearAdvancedFilters,
        resetAll,
    } = useDataTable(apiUrl, 10, filter, enableAdvancedFilters, externalFilters, normalizedColumns, hiddenParameters);

    const orderedColumns = useMemo(() => {
        if (!normalizedColumns || normalizedColumns.length === 0) return [];

        return [...normalizedColumns]
            .sort((a, b) => {
                const aId = a.id;
                const bId = b.id;
                return columnOrder.indexOf(aId) - columnOrder.indexOf(bId);
            })
            .map(column => ({
                ...column,
                width: columnWidths[column.id] || column.width || 150,
                Header: () => (
                    <EnhancedHeader
                        column={column}
                        handleSortChange={handleSortChange}
                        sortField={sortField}
                        sortDirection={sortDirection}
                    />
                ),
            }));
    }, [normalizedColumns, columnOrder, columnWidths, handleSortChange, sortField, sortDirection]);

    React.useImperativeHandle(ref, () => ({
        refetch,
    }));

    // Table rows and total count from server response
    const items = Array.isArray(data?.data?.rows) ? data.data?.rows : [];
    const total = data?.data?.total || 0;

    // States for column filtering
    const [hiddenCols, setHiddenCols] = useState(() =>
        columns.filter(col => col.hide).map(col => col.id || col.accessor)
    );
    const [showColFilter, setShowColFilter] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Memoize columns/data
    const memoizedColumns = useMemo(() => columns, [columns]);
    const memoizedData = useMemo(() => items, [items]);

    const filteredColumns = memoizedColumns.filter(col => {
        const colId = col.id || col.accessor;
        const label = typeof col.Header === 'string' ? col.Header : colId;
        return label.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Initialize React Table without resizing hooks
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page: tablePage,
        canPreviousPage,
        canNextPage,
        gotoPage,
        setHiddenColumns,
        state: { pageIndex },
    } = useTable(
        {
            columns: orderedColumns,
            data: memoizedData,
            manualPagination: true,
            manualSortBy: true,
            pageCount: Math.ceil(total / size),
            initialState: {
                pageIndex: page - 1,
                hiddenColumns: hiddenCols,
            },
            autoResetHiddenColumns: false,
            getCellProps: (cell) => cell.column.getCellProps?.(cell) || {},
            disableSortBy: true,
        },
        useSortBy,
        usePagination
    );

    useEffect(() => {
        if (pageIndex + 1 !== page) {
            gotoPage(page - 1);
        }
    }, [page, pageIndex, gotoPage]);

    useEffect(() => {
        setHiddenColumns(hiddenCols);
    }, [hiddenCols, setHiddenColumns]);

    const handleToggleColumn = useCallback((colId) => {
        setHiddenCols((prev) =>
            prev.includes(colId)
                ? prev.filter((c) => c !== colId)
                : [...prev, colId]
        );
    }, []);

    const handleAdvancedFiltersChange = useCallback((filters) => {
        handleFilterChange(filters);
    }, [handleFilterChange]);

    const handleApplyAdvancedFilters = useCallback((filters) => {
        applyAdvancedFilters(filters);
        toggleAdvancedFilters();
    }, [applyAdvancedFilters]);

    const handleClearAdvancedFilters = useCallback(() => {
        clearAdvancedFilters();
        toggleAdvancedFilters();
    }, [clearAdvancedFilters]);

    const toggleAdvancedFilters = useCallback(() => {
        setShowAdvancedFilters(prev => !prev);
    }, []);

    const handleResetColumnWidths = useCallback(() => {
        const defaultWidths = {};
        normalizedColumns.forEach(col => {
            defaultWidths[col.id] = col.width || 200;
        });
        setColumnWidths(defaultWidths);
        dispatch(updateColumnWidths({
            apiKey: apiUrl,
            columnWidths: {}
        }));
    }, [normalizedColumns, apiUrl, dispatch]);

    /**
     * Download Excel with current filters applied
     */
    const handleDownloadExcel = async () => {
        const visibleCols = memoizedColumns.filter(
            (col) => !hiddenCols.includes(col.id || col.accessor)
        );
        if (!visibleCols.length) {
            alert('No columns are visible to export.');
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        const headers = visibleCols.map(col =>
            typeof col.Header === 'string' ? col.Header : col.id || ''
        );
        worksheet.addRow(headers);

        const headerRow = worksheet.getRow(1);
        headerRow.height = 30;

        const formatForExcel = (rowObj, col) => {
            let val;

            if (typeof col.accessor === 'string') {
                val = getNestedValue(rowObj, col.accessor);
            } else if (typeof col.accessor === 'function') {
                val = col.accessor(rowObj);
            }

            if (val == null) return '';

            if (Array.isArray(val)) {
                val = val.map(item =>
                    item && typeof item === 'object'
                        ? (item.name ?? item.full_name ?? JSON.stringify(item))
                        : String(item)
                ).join(', ');
            }

            const type = col.excelColumnType;
            const format = col.excelFormat;

            try {
                if (type === 'date') {
                    if (!val) return null;
                    const [year, month, day] = val.split('T')[0].split('-').map(Number);
                    return new Date(Date.UTC(year, month - 1, day));
                }

                if (type === 'datetime') {
                    return val ? new Date(val) : null;
                }

                if (type === 'boolean') {
                    return val ? 'Yes' : 'No';
                }

                if (type === 'number') {
                    return Number(val);
                }

                if (type === 'string') {
                    return String(val);
                }

                if (typeof format === 'function') {
                    return format(val);
                }

                return String(val);
            } catch {
                return String(val);
            }
        };

        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF1F4E79' }
            };
            cell.font = {
                name: 'Calibri',
                size: 12,
                bold: true,
                color: { argb: 'FFFFFFFF' }
            };
            cell.alignment = {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: false
            };
            cell.border = {
                top: { style: 'medium', color: { argb: 'FF1F4E79' } },
                bottom: { style: 'medium', color: { argb: 'FF1F4E79' } },
                left: { style: 'thin', color: { argb: 'FF4472C4' } },
                right: { style: 'thin', color: { argb: 'FF4472C4' } }
            };
        });

        worksheet.views = [{ state: 'frozen', ySplit: 1 }];

        memoizedData.forEach((rowObj, index) => {
            const row = worksheet.addRow(
                visibleCols.map(col => formatForExcel(rowObj, col))
            );

            row.height = 25;
            const isEvenRow = index % 2 === 0;

            row.eachCell((cell, colIndex) => {
                const col = visibleCols[colIndex - 1];
                const rawValue = row.values[colIndex] ?? '';

                const styleMap = col.excelStyleMap || {};
                const style = styleMap[rawValue];

                if (style) {
                    cell.value = style.label || rawValue;
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: (style.bgColor || '#FFFFFF').replace('#', 'FF') }
                    };
                    cell.font = {
                        name: 'Calibri',
                        size: 10,
                        bold: true,
                        color: { argb: (style.textColor || '#000000').replace('#', 'FF') }
                    };
                    cell.alignment = {
                        horizontal: 'center',
                        vertical: 'middle',
                        wrapText: false
                    };
                } else {
                    cell.font = {
                        name: 'Calibri',
                        size: 10,
                        color: { argb: 'FF333333' }
                    };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: isEvenRow ? 'FFFFFFFF' : 'FFF2F2F2' }
                    };
                    cell.alignment = {
                        horizontal: col?.excelAlignment || 'center',
                        vertical: 'middle',
                        wrapText: false
                    };
                }

                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
                    bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
                    left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
                    right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
                };
            });
        });

        visibleCols.forEach((col, colIndex) => {
            let maxLength = headers[colIndex]?.length || 0;

            memoizedData.forEach((rowObj) => {
                let val;
                if (typeof col.accessor === 'string') {
                    val = getNestedValue(rowObj, col.accessor);
                } else if (typeof col.accessor === 'function') {
                    val = col.accessor(rowObj);
                }
                if (val == null) val = '';

                if (Array.isArray(val)) {
                    val = val.map(item =>
                        item && typeof item === 'object'
                            ? (item.name ?? item.full_name ?? JSON.stringify(item))
                            : String(item)
                    ).join(', ');
                }

                const lines = String(val).split('\n');
                const longestLine = Math.max(...lines.map(line => line.length));
                maxLength = Math.max(maxLength, longestLine);
            });

            const minWidth = 10;
            const maxWidth = 50;
            worksheet.getColumn(colIndex + 1).width = Math.min(maxWidth, Math.max(minWidth, maxLength + 3));
        });

        workbook.creator = 'Professional Report System';
        workbook.lastModifiedBy = 'Professional Report System';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.company = 'Report Generator';
        workbook.description = 'Professional data export with enhanced formatting';

        worksheet.pageSetup = {
            paperSize: 9,
            orientation: 'landscape',
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0,
            margins: {
                left: 0.5,
                right: 0.5,
                top: 0.75,
                bottom: 0.75,
                header: 0.3,
                footer: 0.3
            },
            printTitlesRow: '1:1'
        };

        worksheet.headerFooter.oddHeader = `&C&"Calibri,Bold"&16${title || 'Professional Data Report'}`;
        worksheet.headerFooter.oddFooter = '&L&"Calibri"&10Generated: &D &T&C&"Calibri,Bold"&12Confidential&R&"Calibri"&10Page &P of &N';

        const lastRow = memoizedData.length + 1;
        const lastCol = visibleCols.length;
        worksheet.pageSetup.printArea = `A1:${String.fromCharCode(64 + lastCol)}${lastRow}`;

        worksheet.properties.showGridLines = true;
        worksheet.properties.showRowColHeaders = true;

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10);
        const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
        const fileName = `${title || 'Professional_Report'}_${dateStr}_${timeStr}.xlsx`;

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
    };

    // Pagination
    const totalPages = Math.ceil(total / size);
    const pageRange = 5;
    const startPage = Math.max(1, page - Math.floor(pageRange / 2));
    const endPage = Math.min(totalPages, startPage + pageRange - 1);

    const paginationControls = (
        <nav aria-label="Page navigation" className="pagination-style-3">
            <ul className="ti-pagination mb-0 flex-wrap">
                <li className={`page-item ${!canPreviousPage ? 'disabled' : ''}`}>
                    <button
                        type="button"
                        className="page-link"
                        onClick={() => canPreviousPage && setPage(page - 1)}
                    >
                        Prev
                    </button>
                </li>

                {startPage > 1 && (
                    <>
                        <li className="page-item">
                            <button type="button" className="page-link" onClick={() => setPage(1)}>
                                1
                            </button>
                        </li>
                        {startPage > 2 && (
                            <li className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        )}
                    </>
                )}

                {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
                    <li
                        key={i + startPage}
                        className={`page-item ${page === i + startPage ? 'active' : ''}`}
                    >
                        <button
                            type="button"
                            className="page-link"
                            onClick={() => setPage(i + startPage)}
                        >
                            {i + startPage}
                        </button>
                    </li>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && (
                            <li className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        )}
                        <li className="page-item">
                            <button
                                type="button"
                                className="page-link"
                                onClick={() => setPage(totalPages)}
                            >
                                {totalPages}
                            </button>
                        </li>
                    </>
                )}

                <li className={`page-item ${!canNextPage ? 'disabled' : ''}`}>
                    <button
                        type="button"
                        className="page-link"
                        onClick={() => canNextPage && setPage(page + 1)}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );

    const startResult = (page - 1) * size + 1;
    const endResult = Math.min(page * size, total);

    return (
        <div className="box custom-box">
            {needHeader && (
                <div className="box-header justify-between">
                    {title && <div className="box-title">{title}</div>}
                    <div className="flex items-center space-x-2">{buttons}</div>
                </div>
            )}

            <div className="box-body">
                {enableAdvancedFilters && showAdvancedFilters && (
                    <div className="mb-4">
                        <DatatableAdvanceFilters
                            columns={memoizedColumns}
                            filters={advancedFilters}
                            onFiltersChange={handleAdvancedFiltersChange}
                            onApplyFilters={handleApplyAdvancedFilters}
                            onClearFilters={handleClearAdvancedFilters}
                        />
                    </div>
                )}

                {/* Top toolbar */}
                <div className="flex items-center justify-between mb-4 relative">
                    {/* LEFT side => Rows-per-page Select */}
                    <div className="flex items-center space-x-3 overflow-x-auto">
                        {/* Page size select */}
                        <select
                            className="form-control form-control-sm border w-[120px]"
                            value={size}
                            onChange={handleSizeChange}
                        >
                            <option value="10">Show 10</option>
                            <option value="25">Show 25</option>
                            <option value="50">Show 50</option>
                            <option value="100">Show 100</option>
                            <option value="500">Show 500</option>
                            <option value="1000">Show 1000</option>
                        </select>

                        {/* Advanced Filters Button */}
                        {enableAdvancedFilters && (
                            <>
                                <button
                                    type="button"
                                    className="whitespace-nowrap ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                                    onClick={toggleAdvancedFilters}
                                >
                                    <i className={`ri-filter-${showAdvancedFilters ? '3' : '2'}-line mr-1`}></i>
                                    {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                                    {Object.keys(advancedFilters).length > 0 && (
                                        <span className="ml-2 badge bg-success text-white">
                                        {Object.keys(advancedFilters).length}
                                    </span>
                                    )}
                                </button>
                            </>
                        )}

                        {/* Reset Column Widths Button */}
                        <button
                            type="button"
                            className="whitespace-nowrap ti-btn ti-btn-secondary-full !py-1 !px-2 !text-[0.75rem]"
                            onClick={handleResetColumnWidths}
                            title="Reset column widths to default"
                        >
                            <i className="ri-refresh-line mr-1"></i>
                            Reset Widths
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className='relative'>
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 px-2 py-1.5 border rounded text-sm"
                                onClick={() => setShowColFilter((prev) => !prev)}
                            >
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
                                </svg>
                                <span>Columns</span>
                                {Object.keys(hiddenCols).length > 0 && (
                                    <span className="ml-2 badge bg-warning/10 text-warning">
                                        {Object.keys(hiddenCols).length}
                                    </span>
                                )}
                                <svg
                                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showColFilter ? 'rotate-180' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>

                            {showColFilter && (
                                <div
                                    className="absolute z-50 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg top-full right-0 overflow-hidden">
                                    <div
                                        className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-900">Column visibility</h3>
                                        <button
                                            onClick={() => setShowColFilter(false)}
                                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none"
                                                 stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="p-3 border-b border-gray-200">
                                        <div className="relative">
                                            <svg
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                            </svg>
                                            <input
                                                type="text"
                                                placeholder="Search columns..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Column list */}
                                    <div className="max-h-60 overflow-y-auto">
                                        {filteredColumns.length > 0 ? (
                                            <div className="p-2">
                                                {filteredColumns.map((col) => {
                                                    const colId = col.id || col.accessor;
                                                    if (!colId) return null;
                                                    const isHidden = hiddenCols.includes(colId);
                                                    const label = typeof col.Header === 'string' ? col.Header : colId;

                                                    return (
                                                        <div
                                                            key={colId}
                                                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                                                            onClick={() => handleToggleColumn(colId)}
                                                        >
                                                            <div className="relative flex-shrink-0">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={!isHidden}
                                                                    onChange={() => {
                                                                    }}
                                                                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                                />
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                    <span className={`text-sm font-normal ${
                                                                        !isHidden ? 'text-gray-900' : 'text-gray-500'
                                                                    }`}>
                                                                        {label}
                                                                    </span>
                                                            </div>

                                                            <div className="flex-shrink-0">
                                                                    <span
                                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                            !isHidden
                                                                                ? 'badge !rounded-full bg-success text-white'
                                                                                : 'badge !rounded-full bg-warning text-white'
                                                                        }`}>
                                                                        {!isHidden ? 'Visible' : 'Hidden'}
                                                                    </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="px-4 py-8 text-center">
                                                <svg className="mx-auto w-8 h-8 text-gray-300 mb-2" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                                </svg>
                                                <p className="text-sm text-gray-500">No columns found</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500">
                                                    {memoizedColumns.length - hiddenCols.length} of {memoizedColumns.length} visible
                                                </span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        memoizedColumns.forEach(col => {
                                                            const colId = col.id || col.accessor;
                                                            if (colId && hiddenCols.includes(colId)) {
                                                                handleToggleColumn(colId);
                                                            }
                                                        });
                                                    }}
                                                    className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                                >
                                                    Show all
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        memoizedColumns.slice(1).forEach(col => {
                                                            const colId = col.id || col.accessor;
                                                            if (colId && !hiddenCols.includes(colId)) {
                                                                handleToggleColumn(colId);
                                                            }
                                                        });
                                                    }}
                                                    className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                                >
                                                    Hide all
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CSV Download button */}
                        <button
                            type="button"
                            className="px-2 py-1 border rounded text-sm"
                            onClick={handleDownloadExcel}
                        >
                            <i className="ri-download-2-line"></i>
                        </button>

                        {/* Search */}
                        <input
                            type="search"
                            onChange={handleSearch}
                            placeholder="Search Here"
                            defaultValue={search}
                            className="form-control form-control-sm"
                        />
                        {
                            !needHeader && buttons &&
                            <>{buttons}</>
                        }
                    </div>
                </div>

                <div className={`table-responsive ${tableParentClass}`}>
                    <table
                        {...getTableProps()}
                        className={`table whitespace-nowrap table-hover min-w-full ti-custom-table-hover ${tableClass}`}
                        style={{
                            cursor: isResizing ? 'col-resize' : 'default'
                        }}
                    >
                        <thead>
                        {headerGroups.map((headerGroup) => {
                            const {key: headerGroupKey, ...headerGroupProps} =
                                headerGroup.getHeaderGroupProps();
                            return (
                                <tr
                                    key={headerGroupKey}
                                    {...headerGroupProps}
                                    className={`border-b border-defaultborder ${rowClassName || ''}`}
                                >
                                    {headerGroup.headers.map((column) => {
                                        const {key: columnKey, ...columnProps} = column.getHeaderProps();

                                        return (
                                            <th
                                                key={columnKey}
                                                {...columnProps}
                                                scope="col"
                                                className={`text-start align-middle relative ${column.headerClassName || ''}`}
                                                style={{
                                                    width: `${columnWidths[column.id] || 200}px`,
                                                    minWidth: `${columnWidths[column.id] || 200}px`,
                                                    maxWidth: `${columnWidths[column.id] || 200}px`,
                                                    position: 'relative'
                                                }}
                                            >
                                                <div className="inline-flex items-center">
                                                    <span>{column.render('Header')}</span>
                                                </div>
                                                <ColumnResizer column={column} />
                                            </th>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                        {isLoading ? (
                            Array.from({length: 10}).map((_, idx) => (
                                <TableShimmerRow key={idx} columns={columns.length}/>
                            ))
                        ) : tablePage.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="py-6">
                                    <EmptyState
                                        icon={Inbox}
                                        heading="No Results"
                                        description="There is no data available to display."
                                    />
                                </td>
                            </tr>
                        ) : (
                            tablePage.map((row) => {
                                prepareRow(row);
                                const {key: rowKey, ...rowProps} = row.getRowProps();
                                return (
                                    <tr
                                        key={rowKey}
                                        {...rowProps}
                                        className="border-b border-defaultborder text-[0.6875rem]"
                                    >
                                        {row.cells.map((cell) => {
                                            const {key: cellKey, ...baseProps} = cell.getCellProps();
                                            const customProps = cell.column.getCellProps
                                                ? cell.column.getCellProps(cell)
                                                : {};

                                            return (
                                                <td
                                                    key={cellKey}
                                                    {...baseProps}
                                                    {...customProps}
                                                    style={{
                                                        width: `${columnWidths[cell.column.id] || 150}px`,
                                                        minWidth: `${columnWidths[cell.column.id] || 150}px`,
                                                        maxWidth: `${columnWidths[cell.column.id] || 150}px`,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })
                        )}
                        </tbody>

                    </table>
                </div>
            </div>

            <div className="box-footer">
                <div className="sm:flex items-center">
                    <div className="text-defaulttextcolor dark:text-defaulttextcolor/70">
                        Showing {startResult} to {endResult} of {total} results
                        <i className="bi bi-arrow-right ms-2 font-semibold"></i>
                    </div>
                    <div className="ms-auto">{paginationControls}</div>
                </div>
            </div>
        </div>
    );
}));

DataTable.propTypes = {
    columns: PropTypes.array.isRequired,
    apiUrl: PropTypes.string.isRequired,
    title: PropTypes.string,
    buttons: PropTypes.node,
    filter: PropTypes.any,
    needHeader: PropTypes.bool,
    enableAdvancedFilters: PropTypes.bool,
};

export default DataTable;