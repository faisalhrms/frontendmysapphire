// src/modules/dashboards/data-pulse/components/SaleswiseTop10Report.jsx
import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const SaleswiseTop10Report = ({ isActive, filters }) => {
    if (!isActive) return null;

    const columns = [
        { Header: "Date", accessor: "Date", Cell: ({ value }) => (value ? String(value) : "—") },
        { Header: "Store", accessor: "WAREHOUSE" },
        { Header: "Store Name", accessor: "WAREHOUSENAME" },
        {
            Header: "Net Amount",
            accessor: "net_amount",
            Cell: ({ value }) => (
                <span className="font-bold">Rs. {formatNumberWithCommas(Number(value || 0))}</span>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            apiUrl="dashboard/data-pulse/retail/saleswise-top-10/"
            needHeader={false}
            filter={filters}
            hiddenParameters={["tab"]}
        />
    );
};

export default SaleswiseTop10Report;
