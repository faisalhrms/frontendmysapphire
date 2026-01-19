import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const StoreCreditReport = ({ isActive, filters }) => {
    if (!isActive) return null;

    const columns = [
        { Header: "Order #", accessor: "OrderNumber" },
        { Header: "Ordered Date", accessor: "OrderedDate" },
        { Header: "Status", accessor: "Status" },
        { Header: "Customer", accessor: "Description" },
        {
            Header: "Store Credit",
            accessor: "store_credit_amount",
            Cell: ({ value }) => (
                <span className="font-bold">Rs. {formatNumberWithCommas(Number(value || 0))}</span>
            ),
        },
        {
            Header: "Total Payment",
            accessor: "total_payment_amount",
            Cell: ({ value }) => (
                <span>Rs. {formatNumberWithCommas(Number(value || 0))}</span>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            apiUrl="dashboard/data-pulse/ecom/store-credit/"
            needHeader={false}
            filter={filters}
            hiddenParameters={["tab"]}
        />
    );
};

export default StoreCreditReport;
