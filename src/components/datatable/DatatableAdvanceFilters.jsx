import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const DatatableAdvanceFilters = ({
                                     columns,
                                     filters,
                                     onFiltersChange,
                                     onApplyFilters,
                                     onClearFilters
                                 }) => {
    const [localFilters, setLocalFilters] = useState(() => {
        return filters && Object.keys(filters).length > 0 ? filters : {};
    });

    useEffect(() => {
        if (JSON.stringify(filters) !== JSON.stringify(localFilters)) {
            setLocalFilters(filters || {});
        }
    }, [filters]);

    const handleFilterChange = (columnId, filterType, value) => {
        setLocalFilters(prev => ({
            ...prev,
            [columnId]: {
                ...prev[columnId],
                [filterType]: value
            }
        }));
    };

    const applyFilters = () => {
        onApplyFilters(localFilters);
        onFiltersChange(localFilters);
    };

    const handleRemoveFilter = (columnId) => {
        setLocalFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[columnId];
            return newFilters;
        });
    };

    const clearAllFilters = () => {
        setLocalFilters({});
        onClearFilters();
        onFiltersChange({});
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
                <div className="flex gap-3">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 active:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
                        onClick={applyFilters}
                    >
                        <i className="ri-filter-3-line text-sm"></i>
                        Apply Filters
                        {activeFiltersCount > 0 && (
                            <span
                                className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-blue-600 bg-white rounded-full ml-1">
                {activeFiltersCount}
            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
                        onClick={clearAllFilters}
                    >
                        <i className="ri-close-circle-line text-sm"></i>
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
                                            className="text-red hover:text-red-500 text-sm"
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
}

export default React.memo(DatatableAdvanceFilters);

DatatableAdvanceFilters.propTypes = {
    columns: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    onFiltersChange: PropTypes.func.isRequired,
    onApplyFilters: PropTypes.func.isRequired,
    onClearFilters: PropTypes.func.isRequired,
};