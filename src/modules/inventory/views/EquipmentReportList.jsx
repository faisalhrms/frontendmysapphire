import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { Link } from "react-router-dom";

const EquipmentReportList = () => {
    // Columns for the aggregated report
    const columns = [
        { Header: "Site", accessor: "site" },
        { Header: "Type", accessor: "type" },
        { Header: "No", accessor: "total_equipment" },
    ];

    // Optional "Add" button or other actions
    // You can remove this if you want a read-only report


    return (
        <>
            <PageHeader currentpage="Asset Report" mainpage="Asset" />
            <DataTable
                columns={columns}
                title="Asset Report"
                apiUrl="/equipments/report-data/"
            />
        </>
    );
};

export default EquipmentReportList;
