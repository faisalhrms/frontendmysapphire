import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";

const ShiftOpenReport = ({ isActive, filters }) => {
    if (!isActive) return null;

    const columns = [
        { Header: "Data Area", accessor: "DATAAREAID" },
        { Header: "Store #", accessor: "STORENUMBER" },
        { Header: "Terminal", accessor: "TERMINAL" },
        { Header: "Batch Shift ID", accessor: "BATCHSHIFTID" },
        {
            Header: "Start Date",
            accessor: "STARTDATE",
            Cell: ({ value }) => (value ? String(value) : "—"),
        },
        { Header: "Status", accessor: "STATUS" },
        { Header: "Operator", accessor: "OPERATORID" },
    ];

    return (
        <DataTable
            columns={columns}
            apiUrl="dashboard/data-pulse/retail/shift-open/"
            needHeader={false}
            filter={filters}
            hiddenParameters={["tab"]}
        />
    );
};

export default ShiftOpenReport;
