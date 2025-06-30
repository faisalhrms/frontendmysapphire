import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {usePagination, useSortBy, useTable} from 'react-table';
import ExcelJS from 'exceljs';

import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PropTypes from "prop-types";
import {useDataTable} from "@hooks/dataTableHooks.js";

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

/**
 * Advanced Filter Component with Professional Features
 */
const AdvancedFilters = ({ columns, filters, onFiltersChange, onApplyFilters, onClearFilters }) => {
    const [localFilters, setLocalFilters] = useState(filters || {});

    const handleFilterChange = (columnId, filterType, value) => {
        setLocalFilters(prev => ({
            ...prev,
            [columnId]: {
                ...prev[columnId],
                [filterType]: value
            }
        }));
    };

    const handleRemoveFilter = (columnId) => {
        setLocalFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[columnId];
            return newFilters;
        });
    };

    const applyFilters = () => {
        onFiltersChange(localFilters);
        onApplyFilters(localFilters);
    };

    const clearAllFilters = () => {
        setLocalFilters({});
        onFiltersChange({});
        onClearFilters();
    };

    const getDateFilterOperators = () => [
        { value: 'equals', label: 'Equals' },
        { value: 'not_equals', label: 'Not Equals' },
        { value: 'greater_than', label: 'After' },
        { value: 'greater_than_equal', label: 'On or After' },
        { value: 'less_than', label: 'Before' },
        { value: 'less_than_equal', label: 'On or Before' },
        { value: 'range', label: 'Between' },
        { value: 'time_period', label: 'Time Period' },
        { value: 'is_null', label: 'Is Empty' },
        { value: 'is_not_null', label: 'Is Not Empty' },
    ];

    const getNumberFilterOperators = () => [
        { value: 'equals', label: 'Equals' },
        { value: 'not_equals', label: 'Not Equals' },
        { value: 'greater_than', label: 'Greater Than' },
        { value: 'greater_than_equal', label: 'Greater Than or Equal' },
        { value: 'less_than', label: 'Less Than' },
        { value: 'less_than_equal', label: 'Less Than or Equal' },
        { value: 'range', label: 'Between' },
        { value: 'is_null', label: 'Is Empty' },
        { value: 'is_not_null', label: 'Is Not Empty' }
    ];

    const getTimePeriodOptions = () => [
        // Current time periods
        { value: 'today', label: 'Today' },
        { value: 'yesterday', label: 'Yesterday' },
        { value: 'tomorrow', label: 'Tomorrow' },

        // Week options
        { value: 'previous_week', label: 'Previous Week' },
        { value: 'previous_two_weeks', label: 'Previous Two Weeks' },
        { value: 'this_week', label: 'This Week' },
        { value: 'next_week', label: 'Next Week' },
        { value: 'next_two_weeks', label: 'Next Two Weeks' },

        // Month options
        { value: 'previous_month', label: 'Previous Month' },
        { value: 'previous_two_months', label: 'Previous Two Months' },
        { value: 'this_month', label: 'This Month' },
        { value: 'next_month', label: 'Next Month' },
        { value: 'next_two_months', label: 'Next Two Months' },

        // Quarter options
        { value: 'previous_quarter', label: 'Previous Quarter' },
        { value: 'this_quarter', label: 'This Quarter' },
        { value: 'next_quarter', label: 'Next Quarter' },

        // Year options
        { value: 'previous_year', label: 'Previous Year' },
        { value: 'this_year', label: 'This Year' },
        { value: 'next_year', label: 'Next Year' },

        // Fiscal periods (assuming fiscal year starts July 1)
        { value: 'current_fiscal_quarter', label: 'Current Fiscal Quarter' },
        { value: 'current_fiscal_year', label: 'Current Fiscal Year' },
        { value: 'previous_fiscal_quarter', label: 'Previous Fiscal Quarter' },
        { value: 'previous_fiscal_year', label: 'Previous Fiscal Year' },

        // Custom rolling periods
        { value: 'last_7_days', label: 'Last 7 Days' },
        { value: 'last_30_days', label: 'Last 30 Days' },
        { value: 'last_90_days', label: 'Last 90 Days' },
        { value: 'last_365_days', label: 'Last 365 Days' },
        { value: 'next_7_days', label: 'Next 7 Days' },
        { value: 'next_30_days', label: 'Next 30 Days' },

        // Special business periods
        { value: 'mtd', label: 'Month to Date' },
        { value: 'qtd', label: 'Quarter to Date' },
        { value: 'ytd', label: 'Year to Date' },
        { value: 'fytd', label: 'Fiscal Year to Date' }
    ];

    const getTextFilterOperators = () => [
        { value: 'equals', label: 'Equals' },
        { value: 'contains', label: 'Contains' },
        { value: 'not_equals', label: 'Not Equals' },
        { value: 'starts_with', label: 'Starts With' },
        { value: 'ends_with', label: 'Ends With' },
        { value: 'is_null', label: 'Is Empty' },
        { value: 'is_not_null', label: 'Is Not Empty' }
    ];

    const renderFilterInput = (column, filterId, operator) => {
        const columnFilter = localFilters[filterId] || {};
        const filterType = column.filterType || 'text';

        if (['is_null', 'is_not_null'].includes(operator)) {
            return null;
        }

        if (operator === 'time_period') {
            return (
                <select
                    className="form-control form-control-sm"
                    value={columnFilter.timePeriod || ''}
                    onChange={(e) => handleFilterChange(filterId, 'timePeriod', e.target.value)}
                >
                    <option value="">Select time period</option>
                    {getTimePeriodOptions().map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        switch (filterType) {
            case 'date':
                if (operator === 'range') {
                    return (
                        <div className="flex gap-2">
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                value={columnFilter.from || ''}
                                onChange={(e) => handleFilterChange(filterId, 'from', e.target.value)}
                                placeholder="From"
                            />
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                value={columnFilter.to || ''}
                                onChange={(e) => handleFilterChange(filterId, 'to', e.target.value)}
                                placeholder="To"
                            />
                        </div>
                    );
                }
                return (
                    <input
                        type="date"
                        className="form-control form-control-sm"
                        value={columnFilter.value || ''}
                        onChange={(e) => handleFilterChange(filterId, 'value', e.target.value)}
                    />
                );

            case 'datetime':
                if (operator === 'range') {
                    return (
                        <div className="flex gap-2">
                            <input
                                type="datetime-local"
                                className="form-control form-control-sm"
                                value={columnFilter.from || ''}
                                onChange={(e) => handleFilterChange(filterId, 'from', e.target.value)}
                                placeholder="From"
                            />
                            <input
                                type="datetime-local"
                                className="form-control form-control-sm"
                                value={columnFilter.to || ''}
                                onChange={(e) => handleFilterChange(filterId, 'to', e.target.value)}
                                placeholder="To"
                            />
                        </div>
                    );
                }
                return (
                    <input
                        type="datetime-local"
                        className="form-control form-control-sm"
                        value={columnFilter.value || ''}
                        onChange={(e) => handleFilterChange(filterId, 'value', e.target.value)}
                    />
                );

            case 'number':
                if (operator === 'range') {
                    return (
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="From"
                                className="form-control form-control-sm"
                                value={columnFilter.from || ''}
                                onChange={(e) => handleFilterChange(filterId, 'from', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="To"
                                className="form-control form-control-sm"
                                value={columnFilter.to || ''}
                                onChange={(e) => handleFilterChange(filterId, 'to', e.target.value)}
                            />
                        </div>
                    );
                }
                return (
                    <input
                        type="number"
                        className="form-control form-control-sm"
                        value={columnFilter.value || ''}
                        onChange={(e) => handleFilterChange(filterId, 'value', e.target.value)}
                        placeholder="Enter value"
                    />
                );

            case 'select':
                return (
                    <select
                        className="form-control form-control-sm"
                        value={columnFilter.value || ''}
                        onChange={(e) => handleFilterChange(filterId, 'value', e.target.value)}
                    >
                        <option value="">Select option</option>
                        {column.filterOptions?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'multiselect':
                return (
                    <select
                        className="form-control form-control-sm"
                        multiple
                        value={columnFilter.values || []}
                        onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions, option => option.value);
                            handleFilterChange(filterId, 'values', values);
                        }}
                    >
                        {column.filterOptions?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'boolean':
                return (
                    <select
                        className="form-control form-control-sm"
                        value={columnFilter.value || ''}
                        onChange={(e) => handleFilterChange(filterId, 'value', e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                );

            default:
                return (
                    <input
                        type="text"
                        placeholder="Enter value"
                        className="form-control form-control-sm"
                        value={columnFilter.value || ''}
                        onChange={(e) => handleFilterChange(filterId, 'value', e.target.value)}
                    />
                );
        }
    };

    const getFilterComponent = (column, filterId) => {
        const columnFilter = localFilters[filterId] || {};
        const filterType = column.filterType || 'text';

        // Get appropriate operators based on filter type
        let operators = [];
        if (filterType === 'date' || filterType === 'datetime') {
            operators = getDateFilterOperators();
        } else if (filterType === 'number') {
            operators = getNumberFilterOperators();
        } else if (filterType === 'text') {
            operators = getTextFilterOperators();
        } else if (filterType === 'select' || filterType === 'multiselect' || filterType === 'boolean') {
            return renderFilterInput(column, filterId, null);
        }

        const currentOperator = columnFilter.operator || operators[0]?.value;

        return (
            <div className="space-y-2">
                <div className="flex gap-2">
                    {operators.length > 0 && (
                        <select
                            className="form-control form-control-sm max-w-[150px]"
                            value={currentOperator}
                            onChange={(e) => handleFilterChange(filterId, 'operator', e.target.value)}
                        >
                            {operators.map(op => (
                                <option key={op.value} value={op.value}>
                                    {op.label}
                                </option>
                            ))}
                        </select>
                    )}
                    {renderFilterInput(column, filterId, currentOperator)}
                </div>
            </div>
        );
    };

    const activeFiltersCount = Object.keys(localFilters).length;

    return (
        <div className="border rounded p-4 mb-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
                <h6 className="font-semibold">Advanced Filters</h6>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={applyFilters}
                    >
                        Apply Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={clearAllFilters}
                    >
                        Clear All
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {columns
                    .filter(col => col.filterable)
                    .map(column => {
                        const filterId = column.filterKey || column.id || column.accessor;
                        const columnFilter = localFilters[filterId];

                        return (
                            <div key={filterId} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">
                                        {typeof column.Header === 'string' ? column.Header : filterId}
                                    </label>
                                    {columnFilter && (
                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-700 text-sm"
                                            onClick={() => handleRemoveFilter(filterId)}
                                        >
                                            <i className="ri-close-line"></i>
                                        </button>
                                    )}
                                </div>
                                {getFilterComponent(column, filterId)}
                            </div>
                        );
                    })}
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
                <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">Active Filters:</span>
                        {Object.entries(localFilters).map(([columnId, filter]) => {
                            const column = columns.find(col =>
                                (col.filterKey || col.id || col.accessor) === columnId
                            );
                            const columnName = typeof column?.Header === 'string' ? column.Header : columnId;

                            return (
                                <span
                                    key={columnId}
                                    className="inline-flex items-center gap-1 px-2 !rounded-full bg-primary/10 text-primary text-xs"
                                >
                                    {columnName}
                                    <button
                                        type="button"
                                        className="hover:text-blue-600"
                                        onClick={() => handleRemoveFilter(columnId)}
                                    >
                                        <i className="ri-close-line"></i>
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
const DataTable = React.memo(({
                                  columns,
                                  apiUrl,
                                  title = null,
                                  buttons,
                                  filter,
                                  needHeader = true,
                                  enableAdvancedFilters = false
                              }) => {
    const [advancedFilters, setAdvancedFilters] = useState({});
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const {
        data,
        isLoading,
        page,
        setPage,
        size,
        handleSearch,
        handleSizeChange,
        handleSortChange,
        handleFilterChange, // Assuming this exists in your hook
    } = useDataTable(apiUrl, 10, { ...filter, ...advancedFilters }, enableAdvancedFilters);

    // Table rows and total count from server response
    const items = Array.isArray(data?.data?.rows) ? data.data?.rows : [];
    const total = data?.data?.total || 0;

    // States for column filtering
    const [hiddenCols, setHiddenCols] = useState([]);
    const [showColFilter, setShowColFilter] = useState(false);

    // Memoize columns/data
    const memoizedColumns = useMemo(() => columns, [columns]);
    const memoizedData = useMemo(() => items, [items]);

    // Initialize React Table
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
        state: { pageIndex, sortBy },
    } = useTable(
        {
            columns: memoizedColumns,
            data: memoizedData,
            manualPagination: true,
            manualSortBy: true,
            pageCount: Math.ceil(total / size),
            initialState: {
                pageIndex: page - 1,
                hiddenColumns: hiddenCols,
            },
            autoResetHiddenColumns: false,
        },
        useSortBy,
        usePagination
    );

    // Keep table page in sync
    useEffect(() => {
        setPage(pageIndex + 1);
    }, [pageIndex, setPage]);

    // On sort changes, inform server
    useEffect(() => {
        if (sortBy.length > 0) {
            const { id: field, desc } = sortBy[0];
            const direction = desc ? 'desc' : 'asc';
            handleSortChange(field, direction);
        } else {
            handleSortChange(null, null);
        }
    }, [sortBy, handleSortChange]);

    // Whenever hiddenCols changes, update React Table
    useEffect(() => {
        setHiddenColumns(hiddenCols);
    }, [hiddenCols, setHiddenColumns]);

    // Toggle column visibility
    const handleToggleColumn = (colId) => {
        setHiddenCols((prev) =>
            prev.includes(colId)
                ? prev.filter((c) => c !== colId)
                : [...prev, colId]
        );
    };

    // Advanced filter handlers
    const handleAdvancedFiltersChange = useCallback((filters) => {
        setAdvancedFilters(filters);
    }, []);

    const handleApplyAdvancedFilters = useCallback((filters) => {
        // If your useDataTable hook supports handleFilterChange
        if (handleFilterChange) {
            handleFilterChange(filters);
        }
        // Reset to first page when filters change
        gotoPage(0);
    }, [handleFilterChange, gotoPage]);

    const handleClearAdvancedFilters = useCallback(() => {
        setAdvancedFilters({});
        if (handleFilterChange) {
            handleFilterChange({});
        }
        gotoPage(0);
    }, [handleFilterChange, gotoPage]);

    /**
     * Download CSV with current filters applied
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
                visibleCols.map(col => {
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

                    return val;
                })
            );

            row.height = 25;
            const isEvenRow = index % 2 === 0;

            row.eachCell((cell, colIndex) => {
                const col = visibleCols[colIndex - 1]; // 1-based index
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
                        onClick={() => canPreviousPage && gotoPage(pageIndex - 1)}
                    >
                        Prev
                    </button>
                </li>

                {startPage > 1 && (
                    <>
                        <li className="page-item">
                            <button type="button" className="page-link" onClick={() => gotoPage(0)}>
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
                            onClick={() => gotoPage(i + startPage - 1)}
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
                                onClick={() => gotoPage(totalPages - 1)}
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
                        onClick={() => canNextPage && gotoPage(pageIndex + 1)}
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
                {enableAdvancedFilters && (
                    <div className="mb-4">
                        {showAdvancedFilters && (
                            <AdvancedFilters
                                columns={memoizedColumns}
                                filters={advancedFilters}
                                onFiltersChange={handleAdvancedFiltersChange}
                                onApplyFilters={handleApplyAdvancedFilters}
                                onClearFilters={handleClearAdvancedFilters}
                            />
                        )}
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
                            <option value="3000">Show 3000</option>
                            <option value="5000">Show 5000</option>
                            <option value="10000">Show 10000</option>
                        </select>

                        {/* Advanced Filters Button */}
                        {enableAdvancedFilters && (
                            <button
                                type="button"
                                className="whitespace-nowrap ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            >
                                <i className={`ri-filter-${showAdvancedFilters ? '3' : '2'}-line mr-1`}></i>
                                {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                                {Object.keys(advancedFilters).length > 0 && (
                                    <span className="ml-2 badge bg-primary/10 text-primary">
                                        {Object.keys(advancedFilters).length}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>


                    {/* RIGHT side => Filter Icon, CSV Download, Search */}
                    <div className="flex items-center gap-2">
                        {/* Column Filter toggle button */}
                        <button
                            type="button"
                            className="px-2 py-1 border rounded text-sm"
                            onClick={() => setShowColFilter((prev) => !prev)}
                        >
                            {showColFilter ? <i className="ri-filter-line"></i> :
                                <i className="ri-filter-off-line"></i>}
                        </button>

                        {/* CSV Download button */}
                        <button
                            type="button"
                            className="px-2 py-1 border rounded text-sm"
                            onClick={handleDownloadExcel}
                        >
                            <i className="ri-download-2-line"></i>
                        </button>

                        {/* Column visibility dropdown */}
                        {showColFilter && (
                            <div className="absolute z-10 bg-white border shadow-md p-2 top-12 right-0">
                                {memoizedColumns.map((col) => {
                                    const colId = col.id || col.accessor;
                                    if (!colId) return null;
                                    const isHidden = hiddenCols.includes(colId);
                                    const label = typeof col.Header === 'string' ? col.Header : colId;
                                    return (
                                        <label key={colId} className="flex items-center gap-2 text-sm my-1">
                                            <input
                                                type="checkbox"
                                                checked={!isHidden}
                                                onChange={() => handleToggleColumn(colId)}
                                            />
                                            {label}
                                        </label>
                                    );
                                })}
                            </div>
                        )}

                        {/* Search */}
                        <input
                            type="search"
                            onChange={handleSearch}
                            placeholder="Search Here"
                            className="form-control form-control-sm"
                        />
                    </div>
                </div>

                {/* Main Table */}
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="table-responsive">
                        <table
                            {...getTableProps()}
                            className="table whitespace-nowrap table-hover min-w-full ti-custom-table-hover"
                        >
                            <thead>
                            {headerGroups.map((headerGroup) => {
                                const { key: headerGroupKey, ...headerGroupProps } =
                                    headerGroup.getHeaderGroupProps();
                                return (
                                    <tr
                                        key={headerGroupKey}
                                        {...headerGroupProps}
                                        className="border-b border-defaultborder"
                                    >
                                        {headerGroup.headers.map((column) => {
                                            const { key: columnKey, ...columnProps } = column.getHeaderProps(
                                                column.getSortByToggleProps
                                                    ? column.getSortByToggleProps()
                                                    : undefined
                                            );

                                            return (
                                                <th
                                                    key={columnKey}
                                                    {...columnProps}
                                                    scope="col"
                                                    className="text-start cursor-pointer select-none align-middle"
                                                >
                                                    <div className="inline-flex items-center">
                                                        <span>{column.render('Header')}</span>
                                                        {/* Sort arrows if sortable */}
                                                        {column.canSort && (
                                                            <span className="flex flex-col items-center justify-center ml-2 leading-none">
                                                                    <span
                                                                        className={
                                                                            (column.isSorted && !column.isSortedDesc
                                                                                ? 'text-black'
                                                                                : 'text-gray-400') + ' text-[0.5rem]'
                                                                        }
                                                                    >
                                                                        ▲
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            (column.isSorted && column.isSortedDesc
                                                                                ? 'text-black'
                                                                                : 'text-gray-400') + ' text-[0.5rem]'
                                                                        }
                                                                    >
                                                                        ▼
                                                                    </span>
                                                                </span>
                                                        )}
                                                    </div>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                            {tablePage.map((row) => {
                                prepareRow(row);
                                const { key: rowKey, ...rowProps } = row.getRowProps();
                                return (
                                    <tr
                                        key={rowKey}
                                        {...rowProps}
                                        className="border-b border-defaultborder text-[0.6875rem]"
                                    >
                                        {row.cells.map((cell) => {
                                            const { key: cellKey, ...cellProps } = cell.getCellProps();
                                            return (
                                                <td key={cellKey} {...cellProps}>
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
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
});

DataTable.propTypes = {
    columns: PropTypes.array.isRequired,
    apiUrl: PropTypes.string.isRequired,
    title: PropTypes.string,
    buttons: PropTypes.node,
    filter: PropTypes.any,
    needHeader: PropTypes.bool,
    enableAdvancedFilters: PropTypes.bool,
};

AdvancedFilters.propTypes = {
    columns: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    onFiltersChange: PropTypes.func.isRequired,
    onApplyFilters: PropTypes.func.isRequired,
    onClearFilters: PropTypes.func.isRequired,
};

export default DataTable;