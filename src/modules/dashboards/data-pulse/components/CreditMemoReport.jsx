import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const CreditMemoReport = ({ isActive, filters }) => {
    if (!isActive) return null;

    const columns = [
        {
            Header: "Date",
            accessor: "Date",
            Cell: ({ value }) => (value ? String(value) : "-"),
        },
        { Header: "Area", accessor: "DataAreaId" },
        { Header: "Entry ID", accessor: "EntryId" },
        {
            Header: "Applied Date",
            accessor: "AppliedDate",
            Cell: ({ value }) => (value ? String(value) : "-"),
        },
        { Header: "Store", accessor: "AppliedInStoreId" },
        { Header: "Receipt", accessor: "AppliedByReceiptId" },
        { Header: "Transaction", accessor: "AppliedByTransactionId" },
        {
            Header: "Applied Amount",
            accessor: "AppliedAmount",
            Cell: ({ value }) => (
                <span className="font-bold">
          Rs. {formatNumberWithCommas(Number(value || 0))}
        </span>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            apiUrl="dashboard/data-pulse/retail/credit-memo/"
            needHeader={false}
            filter={filters}
            hiddenParameters={["tab"]}
        />
    );
};

export default CreditMemoReport;
