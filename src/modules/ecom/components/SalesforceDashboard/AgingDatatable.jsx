
import React, { useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const AgingDatatable = ({ data = [], columns, pageSize = 10 }) => {
    const memoizedColumns = useMemo(() => columns, [columns]);
    const memoizedData = useMemo(() => Array.isArray(data) ? data : [], [data]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        nextPage,
        previousPage,
        pageCount,
        gotoPage,
        state: { pageIndex },
    } = useTable(
        {
            columns: memoizedColumns,
            data: memoizedData,
            initialState: { pageIndex: 0, pageSize },
        },
        useSortBy,
        usePagination
    );

    const totalPages = Math.ceil(memoizedData.length / pageSize);
    const pageRange = 5;
    const startPage = Math.max(1, pageIndex - Math.floor(pageRange / 2));
    const endPage = Math.min(totalPages, startPage + pageRange - 1);

    if (!memoizedData || memoizedData.length === 0) {
        return <div className="text-center p-2 text-gray-500">No data available.</div>;
    }

    return (
        <div className="overflow-hidden w-full dark:text-gray-200 dark:bg-bodybg">

            <table
                {...getTableProps()}
                className="table-auto w-full border-collapse border border-gray-300 dark:text-gray-200 dark:bg-bodybg"
                style={{ tableLayout: "fixed" }}  // Ensure the table fits within its container without scrollbars
            >
                <thead style={{backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white"}} className="text-center text-white bg-gray-100 border-b border-gray-300 dark:text-gray-200 dark:bg-bodybg">
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                        {headerGroup.headers.map((column) => (
                            <th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                className="px-2 py-2 text-sm text-white text-center font-medium text-gray-800  border-r border-gray-300 cursor-pointer"
                                key={column.id}
                            >
                                {column.render("Header")}
                                <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()} className="text-left">
                {page.map((row) => {
                    prepareRow(row);
                    return (
                        <tr
                            {...row.getRowProps()}
                            key={row.id}
                            className="border-b border-gray-300 hover:bg-gray-50"
                        >
                            {row.cells.map((cell) => (
                                <td
                                    {...cell.getCellProps()}
                                    className="px-2 py-2 text-sm text-gray-900 border-r border-gray-300 dark:text-gray-200 dark:bg-bodybg"
                                    key={cell.column.id}
                                >
                                    {cell.render("Cell")}
                                </td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <div className="flex justify-between items-center mt-4 p-2 border-t border-gray-300 dark:text-gray-200 dark:bg-bodybg">
                <span className="text-sm text-gray-600">
                    Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, memoizedData.length)} of{" "}
                    {memoizedData.length} results
                </span>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                        className={`px-3 py-1 border rounded ${!canPreviousPage ? "text-gray-400 cursor-not-allowed" : ""}`}
                    >
                        {"<<"}
                    </button>
                    <button
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                        className={`px-3 py-1 border rounded ${!canPreviousPage ? "text-gray-400 cursor-not-allowed" : ""}`}
                    >
                        Prev
                    </button>

                    {startPage > 1 && (
                        <>
                            <button onClick={() => gotoPage(0)} className="px-3 py-1 border rounded">
                                1
                            </button>
                            {startPage > 2 && <button className="px-3 py-1 border rounded" disabled>...</button>}
                        </>
                    )}

                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
                        <button
                            key={i + startPage}
                            onClick={() => gotoPage(i + startPage - 1)}
                            className={`px-3 py-1 border rounded transition-all ${pageIndex === i + startPage ? "bg-primary text-white font-semibold" : "bg-gray-200"}`}
                        >
                            {i + startPage}
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <button className="px-3 py-1 border rounded" disabled>...</button>}
                            <button onClick={() => gotoPage(totalPages - 1)} className="px-3 py-1 border rounded">
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                        className={`px-3 py-1 border rounded ${!canNextPage ? "text-gray-400 cursor-not-allowed" : ""}`}
                    >
                        Next
                    </button>
                    <button
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                        className={`px-3 py-1 border rounded ${!canNextPage ? "text-gray-400 cursor-not-allowed" : ""}`}
                    >
                        {">>"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgingDatatable;
