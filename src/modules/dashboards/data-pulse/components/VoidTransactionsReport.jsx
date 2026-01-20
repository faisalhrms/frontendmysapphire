import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const VoidTransactionsReport = ({ isActive, filters }) => {
    if (!isActive) return null;

    const columns = [
        { Header: "Date", accessor: "Date", Cell: ({ value }) => (value ? String(value) : "—") },
        { Header: "Store", accessor: "StoreId" },
        { Header: "Store Name", accessor: "WAREHOUSENAME" },
        {
            Header: "Void Txn Count",
            accessor: "transaction_count",
            Cell: ({ value }) => formatNumberWithCommas(Number(value || 0)),
        },
    ];

    return (
        <DataTable
            columns={columns}
            apiUrl="dashboard/data-pulse/retail/void-transactions/"
            needHeader={false}
            filter={filters}
            hiddenParameters={["tab"]}
        />
    );
};

export default VoidTransactionsReport;
