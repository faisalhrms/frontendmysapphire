import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const TopEmployeeCardReport = ({ isActive, filters }) => {
    if (!isActive) return null;

    const columns = [
        {
            Header: "Date",
            accessor: "Date",
            Cell: ({ value }) => (value ? String(value) : "-"),
        },
        { Header: "Cust Group", accessor: "CustGroup" },
        { Header: "Customer Account", accessor: "CustomerAccount" },
        { Header: "Known As", accessor: "KnownAs" },
        { Header: "Name", accessor: "Name" },
        {
            Header: "Gross Amount",
            accessor: "GrossAmount",
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
            apiUrl="dashboard/data-pulse/retail/top-employee-card/"
            needHeader={false}
            filter={filters}
            hiddenParameters={["tab"]}
        />
    );
};

export default TopEmployeeCardReport;
