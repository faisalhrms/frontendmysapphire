import React, { useMemo, useEffect } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PropTypes from "prop-types";
import { useDataTable } from "@hooks/dataTableHooks.js";

const DataTable = React.memo(({ columns, apiUrl, title = 'Datatable', buttons, filter }) => {
    const {
        data,
        isLoading,
        page,
        setPage,
        size,
        handleSearch,
        handleSizeChange,
        handleSortChange, // <-- from our updated hook
    } = useDataTable(apiUrl, 10, filter); // Pass filter to hook

    const items = Array.isArray(data?.data?.rows) ? data.data?.rows : [];
    const total = data?.data?.total || 0;

    // Memoize columns/data for performance
    const memoizedColumns = useMemo(() => columns, [columns]);
    const memoizedData = useMemo(() => items, [items]);

    // Initialize React Table with pagination + sorting
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page: tablePage,
        canPreviousPage,
        canNextPage,
        gotoPage,
        state: { pageIndex, sortBy },
    } = useTable(
        {
            columns: memoizedColumns,
            data: memoizedData,
            manualPagination: true,
            manualSortBy: true, // <-- important for server-side sorting
            pageCount: Math.ceil(total / size),
            initialState: { pageIndex: page - 1 },
        },
        useSortBy, // Order: useSortBy must come before usePagination
        usePagination
    );

    // Whenever React Table’s pageIndex changes, tell our hook
    useEffect(() => {
        setPage(pageIndex + 1);
    }, [pageIndex, setPage]);

    // Whenever the sort changes in React Table, tell our hook so we can fetch sorted data
    useEffect(() => {
        // We'll assume single-column sorting. If multi-sort is desired, handle sortBy array accordingly.
        if (sortBy.length > 0) {
            const { id: field, desc } = sortBy[0];
            const direction = desc ? 'desc' : 'asc';
            handleSortChange(field, direction);
        } else {
            // If no sort is applied, reset on the server
            handleSortChange(null, null);
        }
    }, [sortBy, handleSortChange]);

    // Basic pagination controls
    const paginationControls = useMemo(() => {
        const totalPages = Math.ceil(total / size);
        const pageRange = 5; // Number of pages to show around the current page
        const startPage = Math.max(1, page - Math.floor(pageRange / 2));
        const endPage = Math.min(totalPages, startPage + pageRange - 1);

        return (
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
    }, [canPreviousPage, canNextPage, total, size, page, pageIndex, gotoPage]);

    const startResult = (page - 1) * size + 1;
    const endResult = Math.min(page * size, total);

    return (
        <div className="box custom-box">
            <div className="box-header justify-between">
                <div className="box-title">{title}</div>
                <div className="flex items-center space-x-2">{buttons}</div>
            </div>
            <div className="box-body">
                <div className="flex items-center justify-between mb-4">
                    <select
                        className="form-control form-control-sm border me-2 max-w-[120px]"
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
                    <div className="flex items-center gap-2">
                        <input
                            type="search"
                            onChange={handleSearch}
                            placeholder="Search Here"
                            className="form-control form-control-sm"
                        />
                    </div>
                </div>

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
                                const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                                return (
                                    <tr key={key} {...headerGroupProps} className="border-b border-defaultborder">
                                        {headerGroup.headers.map((column) => {
                                            // For sorting: add getSortByToggleProps
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
                                                    className="text-start cursor-pointer select-none"
                                                >
                                                    {column.render('Header')}
                                                    {/* Sorting indicator */}
                                                    {column.isSorted && (
                                                        <span>{column.isSortedDesc ? ' ▼' : ' ▲'}</span>
                                                    )}
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
                                    <tr key={rowKey} {...rowProps} className="border-b border-defaultborder text-[0.6875rem]">
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
