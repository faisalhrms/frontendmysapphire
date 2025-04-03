// import React from "react";
//
// const OrderDetailForm = () => {
//     return (
//         <div className="p-4">
//             <h2 className="text-base mb-2 border-b pb-1">Details for Order 'PK-686502'</h2>
//
//             <table className="w-full text-sm border-collapse">
//                 <tbody>
//                 <tr className="bg-gray-100">
//                     <td className="p-1 w-32">Information:</td>
//                     <td colSpan={3}>Contains 1 line item to 1 shipping location. The total price is Rs8,181.00.</td>
//                 </tr>
//                 <tr>
//                     <td className="p-1">Date Received:</td>
//                     <td colSpan={3}>2/20/25 4:11:46 pm Asia/Karachi</td>
//                 </tr>
//                 <tr className="bg-gray-100">
//                     <td className="p-1">Site:</td>
//                     <td colSpan={3}>Sapphire</td>
//                 </tr>
//                 <tr>
//                     <td className="p-1">Created By:</td>
//                     <td colSpan={3}>Customer</td>
//                 </tr>
//                 <tr className="bg-gray-100">
//                     <td className="p-1">Customer:</td>
//                     <td colSpan={3}>Asif Shah (unregistered customer)</td>
//                 </tr>
//                 <tr>
//                     <td className="p-1">Customer No.:</td>
//                     <td colSpan={3}>n/a</td>
//                 </tr>
//                 <tr className="bg-gray-100">
//                     <td className="p-1">IP Address:</td>
//                     <td colSpan={3}>192.140.148.155</td>
//                 </tr>
//                 <tr>
//                     <td className="p-1">Source Code / Group:</td>
//                     <td colSpan={3}>FacebookAds / metaAds</td>
//                 </tr>
//                 <tr className="bg-gray-100">
//                     <td className="p-1">Email:</td>
//                     <td colSpan={3}>
//                         <a href="mailto:syedashaik@gmail.com" className="text-blue-600">syedashaik@gmail.com</a>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td className="p-1">Phone:</td>
//                     <td colSpan={3}>03349203124</td>
//                 </tr>
//                 <tr>
//                     <td className="p-1">Order Status:</td>
//                     <td>Open</td>
//                     <td className="p-1 text-blue-600">Confirmation Status:</td>
//                     <td>Confirmed</td>
//                 </tr>
//                 <tr className="bg-gray-100">
//                     <td className="p-1">Shipping Status:</td>
//                     <td>Not Shipped</td>
//                     <td className="p-1 text-blue-600">Export Status:</td>
//                     <td>Ready for Export</td>
//                 </tr>
//                 </tbody>
//             </table>
//
//             <div className="mt-4">
//                 <a href="#" className="text-blue-600 text-sm">Shipment 02800634</a>
//             </div>
//
//             <table className="w-full mt-2 text-sm border">
//                 <thead>
//                 <tr className="bg-gray-50">
//                     <th className="border p-1 text-left">Qty</th>
//                     <th className="border p-1 text-left">Product ID</th>
//                     <th className="border p-1 text-left">Name</th>
//                     <th className="border p-1 text-left">Manufacturer</th>
//                     <th className="border p-1 text-left">Tax Rate</th>
//                     <th className="border p-1 text-left">Unit Sales Price</th>
//                     <th className="border p-1 text-left">Tax Basis</th>
//                     <th className="border p-1 text-left">Item Total</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 <tr>
//                     <td className="border p-1">2</td>
//                     <td className="border p-1">0U3PEDV25V26</td>
//                     <td className="border p-1">3 Piece - Embroidered Lawn Suit</td>
//                     <td className="border p-1"></td>
//                     <td className="border p-1">18.00 %</td>
//                     <td className="border p-1">Rs4,090.00</td>
//                     <td className="border p-1">Rs8,180.00</td>
//                     <td className="border p-1">Rs8,180.00</td>
//                 </tr>
//                 </tbody>
//             </table>
//
//             <table className="w-full text-sm mt-4">
//                 <tbody>
//                 <tr>
//                     <td></td>
//                     <td className="text-right p-1">Shipment Shipping Cost:</td>
//                     <td className="text-right w-24 p-1">Rs0.00</td>
//                 </tr>
//                 <tr>
//                     <td></td>
//                     <td className="text-right p-1">Total Shipping Cost (S002):</td>
//                     <td className="text-right p-1">Rs0.00</td>
//                 </tr>
//                 <tr>
//                     <td></td>
//                     <td className="text-right p-1 text-red-600">Adjustment FBR Service Charges:</td>
//                     <td className="text-right p-1 text-red-600">Rs1.00</td>
//                 </tr>
//                 <tr>
//                     <td></td>
//                     <td className="text-right p-1 border-t">Shipping Total:</td>
//                     <td className="text-right p-1 border-t">Rs0.00</td>
//                 </tr>
//                 <tr>
//                     <td></td>
//                     <td className="text-right p-1 font-bold">Total:</td>
//                     <td className="text-right p-1 font-bold">Rs8,181.00</td>
//                 </tr>
//                 <tr>
//                     <td></td>
//                     <td className="text-right p-1 text-blue-600">Tax Total Included:</td>
//                     <td className="text-right p-1 text-blue-600">Rs1,247.80</td>
//                 </tr>
//                 </tbody>
//             </table>
//
//             <div className="mt-4 flex justify-end gap-2">
//                 <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded border">Send Email</button>
//                 <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded border">Print Order</button>
//             </div>
//         </div>
//     );
// };
//
// export default OrderDetailForm;
import React, { useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const OrderDetailTable = ({ apiorderDetails }) => {
    const columns = useMemo(
        () => [
            { Header: "Qty", accessor: "quantity" },
            { Header: "Product ID", accessor: "productId" },
            { Header: "Name", accessor: "productName" },
            { Header: "Manufacturer", accessor: "manufacturer" },
            { Header: "Tax Rate", accessor: "taxRate", Cell: ({ value }) => `${value} %` },
            {
                Header: "Unit Sales Price",
                accessor: "unitSalesPrice",
                Cell: ({ value }) => `Rs${formatNumberWithCommas(value)}`,
            },
            {
                Header: "Tax Basis",
                accessor: "taxBasis",
                Cell: ({ value }) => `Rs${formatNumberWithCommas(value)}`,
            },
            {
                Header: "Item Total",
                accessor: "itemTotal",
                Cell: ({ value }) => `Rs${formatNumberWithCommas(value)}`,
            },
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
            data: apiorderDetails,
            initialState: { pageIndex: 0, pageSize: 5 },
        },
        useSortBy,
        usePagination
    );

    return (
        <div className="overflow-x-auto w-full">
            <h2 className="text-lg font-semibold flex items-center mb-3">
                <span className="border-l-4 border-blue-500 pl-2">Order Details</span>
            </h2>

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
                                <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
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
                    Showing {pageIndex * 5 + 1} to {Math.min((pageIndex + 1) * 5, apiorderDetails.length)} of {apiorderDetails.length} results
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

export default OrderDetailTable;
