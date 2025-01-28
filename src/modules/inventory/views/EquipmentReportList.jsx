import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { Link } from "react-router-dom";

const EquipmentReportList = () => {
    // Columns for the aggregated report
    const columns = [
        { Header: "Site", accessor: "site" },
        { Header: "Type", accessor: "type" },
        { Header: "No", accessor: "no" },
    ];

    // Optional "Add" button or other actions
    // You can remove this if you want a read-only report
    const buttons = (
        <div className="grid grid-cols-1 sm:grid-cols-1">
            <Link to="/module/equipment/add" className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
                <i className="ri-add-line font-semibold align-middle"></i> Add Equipment
            </Link>
        </div>
    );

    return (
        <>
            <PageHeader currentpage="Equipment Report" mainpage="Equipment" />
            <DataTable
                columns={columns}
                title="Equipment Report"
                apiUrl="/equipments/report-data/"
                buttons={buttons}
            />
        </>
    );
};

export default EquipmentReportList;
