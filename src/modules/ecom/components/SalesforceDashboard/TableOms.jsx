
import React from "react";
import { toTitleCase } from "../../../../helpers/formatters.js";

const TableOms = ({ apiData }) => {
    const columns = [
        { Header: "Order #", accessor: "orderno" },
        { Header: "Date", accessor: "placedate", Cell: ({ value }) => toTitleCase(value) },
        { Header: "Status", accessor: "confirmationstatus" },
        {
            Header: "Customer Name",
            accessor: "customername",
            Cell: ({ value }) => (
                <div className="whitespace-normal break-words text-wrap max-w-[330px]">{value}</div>
            ),
        },
        { Header: "Payment Status", accessor: "paymentstatus" },
        { Header: "Payment Method", accessor: "c_paymentmethod" },
    ];

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full table-auto border-collapse">
                <thead>
                <tr className="bg-gray-200">
                    {columns.map((column, index) => (
                        <th key={index} className="px-4 py-2 text-sm font-medium text-gray-800 text-left border-b">
                            {column.Header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {apiData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b">
                        {columns.map((column, colIndex) => (
                            <td key={colIndex} className="px-4 py-2 text-sm text-gray-900">
                                {column.Cell ? column.Cell({ value: row[column.accessor] }) : row[column.accessor]}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableOms;
