import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link } from "react-router-dom";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {LocateFixed } from "lucide-react";

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
            <IconPageHeader
                heading="Asset Type Wise Report"
                description="Review asset reports categorized by type."
                icon={LocateFixed }
            />
            <DataTable
                columns={columns}
                title="Asset Type Wise"
                apiUrl="/equipments/report-data/"
            />
        </>
    );
};

export default EquipmentReportList;
