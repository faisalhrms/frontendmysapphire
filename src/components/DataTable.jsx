import React, { useMemo, useEffect, useState } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PropTypes from "prop-types";
import { useDataTable } from "@hooks/dataTableHooks.js";

/**
 * Safely gets nested values (e.g., "employee.location.name") from an object.
 * If any segment is missing/undefined, returns undefined.
 */
function getNestedValue(obj, path) {
    // If accessor is "employee.location.name", split by "."
    return path.split('.').reduce((acc, key) => {
        if (acc && acc[key] !== undefined) {
            return acc[key];
        }
        return undefined;
    }, obj);
}

const DataTable = React.memo(({ columns, apiUrl, title = null, buttons, filter, needHeader = true }) => {
    const {
        data,
        isLoading,
        page,
        setPage,
        size,
        handleSearch,
        handleSizeChange,
        handleSortChange,
    } = useDataTable(apiUrl, 10, filter);

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

    /**
     * Download CSV
     * If a value is an array of objects (e.g. roles), we try to map `item.name`.
     * Otherwise, we use .toString() or JSON-stringify as fallback.
     */
    const handleDownloadCSV = () => {
        const visibleCols = memoizedColumns.filter(
            (col) => !hiddenCols.includes(col.id || col.accessor)
        );
        if (!visibleCols.length) {
            alert('No columns are visible to export.');
            return;
        }

        // 1) Header
        const headerRow = visibleCols.map((col) =>
            typeof col.Header === 'string' ? col.Header : col.id || ''
        );
        const csvRows = [headerRow.join(',')];

        // 2) Data rows
        memoizedData.forEach((rowObj) => {
            const rowArray = visibleCols.map((col) => {
                let val;
                if (typeof col.accessor === 'string') {
                    val = getNestedValue(rowObj, col.accessor);
                } else if (typeof col.accessor === 'function') {
                    val = col.accessor(rowObj);
                }
                if (val == null) val = '';

                // If val is an array, try to handle array-of-objects or array-of-strings
                if (Array.isArray(val)) {
                    // For array of objects with "name"
                    if (val.every((item) => item && typeof item === 'object' && (item.name ?? item.full_name))) {
                        val = val.map((item) => item.name ?? item.full_name).join(', ');
                    } else {
                        // generic fallback for arrays
                        val = val.map((item) =>
                            typeof item === 'object'
                                ? JSON.stringify(item)
                                : String(item)
                        ).join(', ');
                    }
                }

                // Convert to string, escaping quotes
                val = String(val).replace(/"/g, '""');
                // Wrap in quotes for CSV
                return `"${val}"`;
            });
            csvRows.push(rowArray.join(','));
        });

        // 3) Blob + Download
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });

        // Get current date and time for the filename in the required format (MM-DD-YYYY, h:mm:ss A)
        const currentDate = new Date();
        const options = { month: '2-digit', day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);

        // Construct filename
        const fileName = `${title} Report ${formattedDate}.csv`;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName; // Use the dynamically generated file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
            {
                needHeader &&
                <div className="box-header justify-between">
                    {
                        title &&
                        <div className="box-title">{title}</div>
                    }
                    <div className="flex items-center space-x-2">{buttons}</div>
                </div>
            }

            <div className="box-body">
                {/* Top toolbar */}
                <div className="flex items-center justify-between mb-4 relative">
                    {/* LEFT side => Rows-per-page Select */}
                    <div className="flex items-center">
                        <select
                            className="form-control form-control-sm border max-w-[120px]"
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
                    </div>

                    {/* RIGHT side => Filter Icon, CSV Download, Search */}
                    <div className="flex items-center gap-2">
                        {/* Column Filter toggle button */}
                        <button
                            type="button"
                            className="px-2 py-1 border rounded text-sm"
                            onClick={() => setShowColFilter((prev) => !prev)}
                        >
                            {showColFilter ? <i className="ri-filter-line"></i> : <i className="ri-filter-off-line"></i>}
                        </button>

                        {/* CSV Download button */}
                        <button
                            type="button"
                            className="px-2 py-1 border rounded text-sm"
                            onClick={handleDownloadCSV}
                        >
                            <i className="ri-download-2-line"></i>
                        </button>

                        {/* If showColFilter is ON, display a small dropdown with column checkboxes */}
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
};

export default DataTable;
