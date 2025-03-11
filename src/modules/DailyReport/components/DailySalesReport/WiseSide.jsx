// import React, { useMemo } from "react";
// import { useTable } from "react-table";
// import LoadingSpinner from "@components.jsx/LoadingSpinner.jsx";
// import PropTypes from "prop-types";
// import { useDataTable } from "@hooks/dataTableHooks.js";
//
// const StoreWise = ({ apiUrl, title = "Store Wise Report" }) => {
//     const { data, isLoading } = useDataTable(apiUrl, 10);
//
//     // Extract unique dates dynamically from data
//     const dateHeaders = useMemo(() => {
//         if (!data?.data?.rows?.length) return [];
//         return Object.keys(data.data.rows[0]?.store_data || {}).sort();
//     }, [data]);
//
//     // Process data into hierarchical format
//     const processedData = useMemo(() => {
//         if (!data?.data?.rows) return [];
//
//         let structuredData = [];
//
//         data.data.rows.forEach(row => {
//             if (row.category === "Offline") {
//                 structuredData.push({ store: "Offline", isCategory: true });
//             }
//             if (row.category === "A-Class") {
//                 structuredData.push({ store: "A-Class", isSubCategory: true });
//             }
//             if (row.category === "Central") {
//                 structuredData.push({ store: "Central", isSubCategory: true });
//             }
//
//             structuredData.push({
//                 store: row.store_name || "Unknown Store",
//                 ...dateHeaders.reduce((acc, date) => {
//                     acc[date] = row.store_data[date] || 0;
//                     return acc;
//                 }, {})
//             });
//         });
//
//         return structuredData;
//     }, [data, dateHeaders]);
//
//     // Calculate column totals
//     const columnTotals = useMemo(() => {
//         const totals = { store: "Total" };
//         dateHeaders.forEach(date => {
//             totals[date] = processedData.reduce((sum, row) => sum + (row[date] || 0), 0);
//         });
//         return totals;
//     }, [processedData, dateHeaders]);
//
//     // Create react-table columns
//     const columns = useMemo(() => [
//         {
//             Header: "Store Type",
//             accessor: "store",
//             Cell: ({ row }) => {
//                 if (row.original.isCategory) {
//                     return <span className="font-bold bg-black text-white px-2">{row.original.store}</span>;
//                 }
//                 if (row.original.isSubCategory) {
//                     return <span className="font-semibold bg-yellow-300 px-2">{row.original.store}</span>;
//                 }
//                 return <span className="pl-4">{row.original.store}</span>;
//             },
//             sticky: "left"
//         },
//         {
//             Header: '1-Feb-2025 ',
//             accessor: '1-Feb-2025 ',
//             Cell: ({ value }) => value || 0
//         },
//         {
//             Header: '2-Feb-2025 ',
//             accessor: '2-Feb-2025 ',
//             Cell: ({ value }) => value || 0
//         },
//         {
//             Header: '3-Feb-2025 ',
//             accessor: '3-Feb-2025 ',
//             Cell: ({ value }) => value || 0
//         },
//         {
//             Header: '4-Feb-2025 ',
//             accessor: '4-Feb-2025 ',
//             Cell: ({ value }) => value || 0
//         },
//         {
//             Header: '5-Feb-2025 ',
//             accessor: '5-Feb-2025 ',
//             Cell: ({ value }) => value || 0
//         },
//         {
//             Header: '6-Feb-2025 ',
//             accessor: '6-Feb-2025 ',
//             Cell: ({ value }) => value || 0
//         },
//         {
//             Header: '7-Feb-2025 ',
//             accessor: '7-Feb-2025 ',
//             Cell: ({ value }) => value || 0
//         },
//         {
//             Header: '8-Feb-2025 ',
//             accessor: '8-Feb-2025 ',
//             Cell: ({ value }) => value || 0
//         },
//         {
//             Header: 'Total',
//             accessor: 'total',
//             Cell: ({ value }) => value || 0
//         },
//         ...dateHeaders.map(date => ({
//             Header: date,
//             accessor: date,
//             Cell: ({ value }) => (value ? value.toLocaleString() : 0)
//         }))
//     ], [dateHeaders]);
//
//     // React-table configuration
//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         rows: tableRows,
//         prepareRow
//     } = useTable({
//         columns,
//         data: [...processedData, columnTotals]
//     });
//
//     return (
//         <div className="box custom-box mt-4">
//             <div className="box-header justify-between">
//                 <div className="box-title">{title}</div>
//             </div>
//
//             <div className="box-body">
//                 {isLoading ? (
//                     <LoadingSpinner />
//                 ) : (
//                     <div className="overflow-x-auto">
//                         <table
//                             {...getTableProps()}
//                             className="table whitespace-nowrap table-hover min-w-full ti-custom-table-hover"
//                         >
//                             <thead className="bg-gray-100 sticky top-0 z-10">
//                             {headerGroups.map(headerGroup => (
//                                 <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
//                                     {headerGroup.headers.map((column, columnIndex) => (
//                                         <th
//                                             {...column.getHeaderProps()}
//                                             key={column.id}
//                                             className={`px-4 py-2 border-b text-center ${
//                                                 columnIndex === 0 ? "sticky left-0 bg-white z-10" : ""
//                                             }`}
//                                         >
//                                             {column.render("Header")}
//                                         </th>
//                                     ))}
//                                 </tr>
//                             ))}
//                             </thead>
//                             <tbody {...getTableBodyProps()}>
//                             {tableRows.map(row => {
//                                 prepareRow(row);
//                                 return (
//                                     <tr {...row.getRowProps()} key={row.id}>
//                                         {row.cells.map((cell, columnIndex) => (
//                                             <td
//                                                 {...cell.getCellProps()}
//                                                 key={cell.id}
//                                                 className={`px-4 py-2 border-b text-right ${
//                                                     columnIndex === 0 ? "sticky left-0 bg-white z-10" : ""
//                                                 }`}
//                                             >
//                                                 {cell.render("Cell")}
//                                             </td>
//                                         ))}
//                                     </tr>
//                                 );
//                             })}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// StoreWise.propTypes = {
//     apiUrl: PropTypes.string.isRequired,
//     title: PropTypes.string
// };
//
// export default StoreWise;
import React, { useMemo } from "react";
import { useTable } from "react-table";

import PropTypes from "prop-types";
import { useDataTable } from "@hooks/dataTableHooks.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const StoreWise = ({ filters, title = "Store Wise Report" }) => {
    const { data, isLoading } = useDataTable(
        "/your-api-endpoint", // Replace with the actual API URL
        10,
        filters // Pass filters to the data fetching hook
    );

    // Extract unique dates dynamically from data
    const dateHeaders = useMemo(() => {
        if (!data?.data?.rows?.length) return [];
        return Object.keys(data.data.rows[0]?.store_data || {}).sort();
    }, [data]);

    // Process data into hierarchical format
    const processedData = useMemo(() => {
        if (!data?.data?.rows) return [];

        let structuredData = [];

        data.data.rows.forEach(row => {
            if (row.category === "Offline") {
                structuredData.push({ store: "Offline", isCategory: true });
            }
            if (row.category === "A-Class") {
                structuredData.push({ store: "A-Class", isSubCategory: true });
            }
            if (row.category === "Central") {
                structuredData.push({ store: "Central", isSubCategory: true });
            }

            structuredData.push({
                store: row.store_name || "Unknown Store",
                ...dateHeaders.reduce((acc, date) => {
                    acc[date] = row.store_data[date] || 0;
                    return acc;
                }, {})
            });
        });

        return structuredData;
    }, [data, dateHeaders]);

    // Calculate column totals
    const columnTotals = useMemo(() => {
        const totals = { store: "Total" };
        dateHeaders.forEach(date => {
            totals[date] = processedData.reduce((sum, row) => sum + (row[date] || 0), 0);
        });
        return totals;
    }, [processedData, dateHeaders]);

    // Create react-table columns
    const columns = useMemo(() => [
        {
            Header: "Store Type",
            accessor: "store",
            Cell: ({ row }) => {
                if (row.original.isCategory) {
                    return <span className="font-bold bg-black text-white px-2  ">{row.original.store}</span>;
                }
                if (row.original.isSubCategory) {
                    return <span className="font-semibold bg-yellow-300 px-2">{row.original.store}</span>;
                }
                return <span className="pl-4">{row.original.store}</span>;
            },
            sticky: "left"
        },
        {
            Header: '1-Feb-2025 ',
            accessor: '1-Feb-2025 ',
            Cell: ({ value }) => value || 0
        },
        {
            Header: '2-Feb-2025 ',
            accessor: '2-Feb-2025 ',
            Cell: ({ value }) => value || 0
        },
        {
            Header: '3-Feb-2025 ',
            accessor: '3-Feb-2025 ',
            Cell: ({ value }) => value || 0
        },
        {
            Header: '4-Feb-2025 ',
            accessor: '4-Feb-2025 ',
            Cell: ({ value }) => value || 0
        },
        {
            Header: '5-Feb-2025 ',
            accessor: '5-Feb-2025 ',
            Cell: ({ value }) => value || 0
        },
        {
            Header: '6-Feb-2025 ',
            accessor: '6-Feb-2025 ',
            Cell: ({ value }) => value || 0
        },
        {
            Header: '7-Feb-2025 ',
            accessor: '7-Feb-2025 ',
            Cell: ({ value }) => value || 0
        },
        {
            Header: '8-Feb-2025 ',
            accessor: '8-Feb-2025 ',
            Cell: ({ value }) => value || 0
        },
        {
            Header: 'Total',
            accessor: 'total',
            Cell: ({ value }) => value || 0
        },
        ...dateHeaders.map(date => ({
            Header: date,
            accessor: date,
            Cell: ({ value }) => (value ? value.toLocaleString() : 0)
        }))
    ], [dateHeaders]);

    // React-table configuration
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows: tableRows,
        prepareRow
    } = useTable({
        columns,
        data: [...processedData, columnTotals]
    });

    return (
        <div className="box custom-box mt-4">
            <div className="box-header justify-between">
                <div  className="box-title">{title}</div>
            </div>

            <div className="box-body">
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="overflow-x-auto">
                        <table
                            {...getTableProps()}
                            className="table whitespace-nowrap table-hover min-w-full ti-custom-table-hover"
                        >
                            <thead className="bg-gray-100 sticky top-0 z-10 ">
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                                    {headerGroup.headers.map((column, columnIndex) => (
                                        <th
                                            {...column.getHeaderProps()}
                                            key={column.id}
                                            className={`px-4 py-2 border-b text-center ${
                                                columnIndex === 0 ? "sticky left-0 bg-white z-10" : ""
                                            }`}
                                        >
                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                            {tableRows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} key={row.id}>
                                        {row.cells.map((cell, columnIndex) => (
                                            <td
                                                {...cell.getCellProps()}
                                                key={cell.id}
                                                className={`px-4 py-2 border-b text-right ${
                                                    columnIndex === 0 ? "sticky left-0 bg-white z-10" : ""
                                                }`}
                                            >
                                                {cell.render("Cell")}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

StoreWise.propTypes = {
    filters: PropTypes.object.isRequired,
    title: PropTypes.string
};

export default StoreWise;
