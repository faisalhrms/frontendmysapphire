import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";

const AccountsMissingEmailReport = ({ isActive, filters }) => {
    if (!isActive) return null;

    const columns = [
        { Header: "Id", accessor: "Id" },
        { Header: "Account #", accessor: "AccountNumber" },
        { Header: "First Name", accessor: "FirstName" },
        { Header: "Last Name", accessor: "LastName" },
        { Header: "Last Update", accessor: "last_update_date" },
    ];

    return (
        <DataTable
            columns={columns}
            apiUrl="dashboard/data-pulse/ecom/accounts-missing-email/"
            needHeader={false}
            filter={filters}
            hiddenParameters={["tab"]}
        />
    );
};

export default AccountsMissingEmailReport;
