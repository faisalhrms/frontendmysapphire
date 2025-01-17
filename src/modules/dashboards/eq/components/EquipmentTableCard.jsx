// src/modules/inventory/components/EquipmentTableCard.jsx

import React, { useMemo } from "react";
import DataTable from "@components/DataTable.jsx";
import ProgressBar from "@components/ProgressBar.jsx";
import { getBadgeClasses } from "@helpers/badges.js";
import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";
import { Link } from "react-router-dom";
import Tooltip from "@components/Tooltip.jsx";

const EquipmentTableCard = () => {
    const columns = useMemo(() => [
        {
            Header: "Code",
            accessor: "code",
        },
        {
            Header: "Description",
            accessor: "description",
        },
        {
            Header: "Serial No",
            accessor: "serial_no",
        },
        {
            Header: "Type",
            accessor: "equipment_type",
            Cell: ({ value }) => toTitleCase(value),
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({ value }) => (
                <span className={getBadgeClasses(value)}>
                    {toTitleCase(value.replace('_', ' '))}
                </span>
            ),
        },
        {
            Header: "Purchase Date",
            accessor: "purchase_date",
            Cell: ({ value }) => (value ? formatDate(value) : 'N/A'),
        },
        {
            Header: "Handover Date",
            accessor: "handover_date",
            Cell: ({ value }) => (value ? formatDate(value) : 'N/A'),
        },
        {
            Header: "Actions",
            Cell: ({ row }) => (
                <div className="flex space-x-2">

                    <Link to={`/module/equipment/detail/${row.original.id}`}>
                        <button className="ti-btn ti-btn-info ti-btn-sm">
                            <i className="ri-eye-line"></i>
                        </button>
                    </Link>
                </div>
            ),
        },
    ], []);

    return (
        <div className="col-span-12 mt-4">
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">
                        Equipment Details
                    </div>
                </div>
                <div className="box-body">
                    <DataTable
                        columns={columns}
                        title="All Equipments"
                        apiUrl={`/equipments/datatable/`} // Ensure this endpoint is correct
                    />
                </div>
            </div>
        </div>
    );
};

export default EquipmentTableCard;
