import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const CodAmountIssuesReport = ({ isActive, filters }) => {
    if (!isActive) return null;

    const columns = [
        { Header: "FO #", accessor: "Formatted_FO_Number__c" },
        { Header: "SKU", accessor: "SKU__c" },
        { Header: "Name", accessor: "FulfilledToName" },
        { Header: "Email", accessor: "FulfilledToEmailAddress" },
        { Header: "Status", accessor: "Status" },
        {
            Header: "COD",
            accessor: "COD_Amount__c",
            Cell: ({ value }) => <span>Rs. {formatNumberWithCommas(Number(value || 0))}</span>,
        },
        {
            Header: "Grand Total",
            accessor: "GrandTotalAmount",
            Cell: ({ value }) => <span>Rs. {formatNumberWithCommas(Number(value || 0))}</span>,
        },
        {
            Header: "Total Payment",
            accessor: "Total_Payment_Amount__c",
            Cell: ({ value }) => <span>Rs. {formatNumberWithCommas(Number(value || 0))}</span>,
        },
        { Header: "Updated", accessor: "SystemModstamp" },
        { Header: "Created", accessor: "CreatedDate" },
    ];

    return (
        <DataTable
            columns={columns}
            apiUrl="dashboard/data-pulse/ecom/cod-amount-issues/"
            needHeader={false}
            filter={filters}
            hiddenParameters={["tab"]}
        />
    );
};

export default CodAmountIssuesReport;
