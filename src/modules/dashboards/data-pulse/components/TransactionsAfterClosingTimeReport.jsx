import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const TransactionsAfterClosingTimeReport = ({ isActive, filters }) => {
    if (!isActive) return null;

    const columns = [
        {
            Header: "Date",
            accessor: "TRANSACTIONDATE",
            Cell: ({ value }) => (value ? String(value) : "—"),
        },
        { Header: "Time", accessor: "TransactionTime", Cell: ({ value }) => (value ? String(value) : "—") },
        { Header: "Store", accessor: "WAREHOUSE" },
        { Header: "Store Name", accessor: "WAREHOUSENAME" },
        {
            Header: "Gross",
            accessor: "GROSSAMOUNT",
            Cell: ({ value }) => `Rs. ${formatNumberWithCommas(Number(value || 0))}`,
        },
        {
            Header: "Net",
            accessor: "NETAMOUNT",
            Cell: ({ value }) => `Rs. ${formatNumberWithCommas(Number(value || 0))}`,
        },
        {
            Header: "Discount",
            accessor: "DISCOUNTAMOUNT",
            Cell: ({ value }) => `Rs. ${formatNumberWithCommas(Number(value || 0))}`,
        },
    ];

    return (
        <DataTable
            columns={columns}
            apiUrl="dashboard/data-pulse/retail/transactions-after-closing-time/"
            needHeader={false}
            filter={filters}
            hiddenParameters={["tab"]}
        />
    );
};

export default TransactionsAfterClosingTimeReport;
