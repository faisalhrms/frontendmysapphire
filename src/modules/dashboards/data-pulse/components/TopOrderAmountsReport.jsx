import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const TopOrderAmountsReport = ({ isActive, filters }) => {
    if (!isActive) return null;

    const columns = [
        { Header: "Order #", accessor: "OrderNumber" },
        {
            Header: "Ordered Date",
            accessor: "OrderedDate",
            Cell: ({ value }) => (value ? String(value) : "-"),
        },
        { Header: "Status", accessor: "Status" },
        { Header: "Customer", accessor: "Description" },
        {
            Header: "Grand Total",
            accessor: "GrandTotalAmount",
            Cell: ({ value }) => (
                <span className="font-bold">Rs. {formatNumberWithCommas(Number(value || 0))}</span>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            apiUrl="dashboard/data-pulse/ecom/top-order-amounts/"
            needHeader={false}
            filter={filters}
            hiddenParameters={["tab"]}
        />
    );
};

export default TopOrderAmountsReport;
