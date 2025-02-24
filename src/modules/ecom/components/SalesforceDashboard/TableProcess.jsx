import React, { useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { toTitleCase } from "../../../../helpers/formatters.js";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const TableProcess = ({ apiDataprocess, title }) => {
    const columns = useMemo(
        () => [
            { Header: "Order #", accessor: "orderno" },
            { Header: "Date", accessor: "placedate", Cell: ({ value }) => toTitleCase(value) },
            { Header: "Status", accessor: "confirmationstatus" },
            {
                Header: "Order Value",
                accessor: "ordertotal",
                Cell: ({ value }) => <div className="text-right">{formatNumberWithCommas(value)}</div>,
            },
            {
                Header: "Customer Name",
                accessor: "customername",
                Cell: ({ value }) => <div className="whitespace-normal break-words text-wrap max-w-[250px]">{value}</div>,
            },
            { Header: "Payment Status", accessor: "paymentstatus" },
            { Header: "Payment Method", accessor: "c_paymentmethod" },
            { Header: "Reason", accessor: "reason" },
        ],
        []
    );

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
            columns,
            data: apiDataprocess,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useSortBy,
        usePagination
    );

    return (
        <div className="overflow-x-auto w-full">
            {/* Title with Blue Left Border */}
            <div className="mb-3">
                <h2 className="text-lg font-semibold flex items-center">
                    <span className="border-l-4 border-blue-500 pl-2">{title || "In-Process with Customer Care"}</span>
                </h2>
            </div>

            {/* Table */}
            <table {...getTableProps()} className="w-full table-auto border-collapse border border-gray-300">
                <thead className="text-center bg-gray-100 border-b border-gray-300">
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                className="px-4 py-2 text-sm font-medium text-gray-800 text-left border-r border-gray-300 cursor-pointer"
                                key={column.id}
                            >
                                {column.render("Header")}
                                <span>
                                        {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                                    </span>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()} className="text-left">
                {page.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} key={row.id} className="border-b border-gray-300 hover:bg-gray-50">
                            {row.cells.map(cell => (
                                <td
                                    {...cell.getCellProps()}
                                    className="px-4 py-2 text-sm text-gray-900 border-r border-gray-300"
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

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 p-2 border-t border-gray-300">
                <span className="text-sm text-gray-600">
                    Showing {pageIndex * 10 + 1} to {Math.min((pageIndex + 1) * 10, apiDataprocess.length)} of {apiDataprocess.length} results
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

                    {Array.from({ length: pageCount }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => gotoPage(i)}
                            className={`px-3 py-1 border rounded transition-all ${
                                pageIndex === i ? "bg-primary text-white font-semibold" : "bg-gray-200"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

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

export default TableProcess;
