import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const ReturnQtyReport = ({ isActive, filters }) => {
    if (!isActive) return null;

    const columns = [
        { Header: "Date", accessor: "Date", Cell: ({ value }) => (value ? String(value) : "—") },
        { Header: "Store", accessor: "StoreId" },
        { Header: "Store Name", accessor: "WAREHOUSENAME" },
        {
            Header: "Return Qty",
            accessor: "ReturnQty",
            Cell: ({ value }) => formatNumberWithCommas(Number(value || 0)),
        },
        {
            Header: "Net Amount",
            accessor: "NET_AMOUNT",
            Cell: ({ value }) => (
                <span className="font-bold">Rs. {formatNumberWithCommas(Number(value || 0))}</span>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            apiUrl="dashboard/data-pulse/retail/return-qty/"
            needHeader={false}
            filter={filters}
            hiddenParameters={["tab"]}
        />
    );
};

export default ReturnQtyReport;
