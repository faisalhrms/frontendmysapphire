import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { BookOpenText  } from "lucide-react";
import DataTable from "@components/datatable/DataTable.jsx";
import React, {useRef, useState} from "react";
import { Link } from "react-router-dom";
import { DYNAMICS_ROUTES } from "@modules/dynamics/routes.js";
import {formatDate} from "@helpers/dateTime.js";
import UserWithAvatar from "@components/UserWithAvatar.jsx";
import {formatAmountWithCommas} from "@helpers/formatters.js";
import {downloadSweepersGuardsReport} from "@modules/dynamics/sweeper-and-gards/hooks/useSweeperGuardFormHook.js";

const SweepersGuardsList = () => {
    const dataTableRef = useRef();
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadPDF = async () => {
        try {
            setIsDownloading(true);
            const pdfData = await downloadSweepersGuardsReport(); // ✅ no filters
            const blob = new Blob([pdfData], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "sweepers_and_guards.pdf";
            link.click();
        } catch (error) {
            console.error("Error downloading PDF:", error);
        } finally {
            setIsDownloading(false);
        }
    };
    const columns = [
        {
            Header: "Actions",
            accessor: "id",          // key for react-table
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex justify-center space-x-2">
                    <Link to={`/module/dynamics/forms/sweepers-and-guards/edit/${row.original.id}`}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line" />
                        </button>
                    </Link>
                </div>
            ),
        },
        {
            Header: "Store Code",
            accessor: "store.store_code",
            filterable: true,
            filterType: "text",
            filterKey: "store__store_code",
        },
        {
            Header: "Store Name",
            accessor: "store.store_name",
            filterable: true,
            filterType: "text",
            filterKey: "store__store_name",
        },
        {
            Header: "Guards",
            accessor: "num_of_guards",
            filterable: true,
            filterType: "number",
            filterKey: "num_of_guards",
            Cell: ({ value }) =>
                value != null ? Number(value).toLocaleString() : "N/A",
            excelFormat: (val) => (val == null ? "" : Number(val)),
        },
        {
            Header: "Sweepers",
            accessor: "num_of_sweepers",
            filterable: true,
            filterType: "number",
            filterKey: "num_of_sweepers",
            Cell: ({ value }) =>
                value != null ? Number(value).toLocaleString() : "N/A",
            excelFormat: (val) => (val == null ? "" : Number(val)),
        },
        {
            Header: "Stock Helpers",
            accessor: "num_of_stock_helpers",
            filterable: true,
            filterType: "number",
            filterKey: "num_of_stock_helpers",
            Cell: ({ value }) =>
                value != null ? Number(value).toLocaleString() : "N/A",
            excelFormat: (val) => (val == null ? "" : Number(val)),
        },
        {
            Header: "Leased Area (total)",
            accessor: "leased_area_total",
            filterable: true,
            filterType: "number",
            filterKey: "leased_area_total",
            Cell: ({ value }) =>
                value != null ? formatAmountWithCommas(value) : "N/A",
            excelFormat: (val) =>
                val == null ? "" : Number(parseFloat(val)),
        },
        {
            Header: "Store Capacity (total)",
            accessor: "store_capacity_total",
            filterable: true,
            filterType: "number",
            filterKey: "store_capacity_total",
            Cell: ({ value }) =>
                value != null ? formatAmountWithCommas(value) : "N/A",
            excelFormat: (val) =>
                val == null ? "" : Number(parseFloat(val)),
        },
        {
            Header: "Hanging Capacity (total)",
            accessor: "hanging_capacity_total",
            filterable: true,
            filterType: "number",
            filterKey: "hanging_capacity_total",
            Cell: ({ value }) =>
                value != null ? formatAmountWithCommas(value) : "N/A",
            excelFormat: (val) =>
                val == null ? "" : Number(parseFloat(val)),
        },
        {
            Header: "Created By",
            accessor: "created_by",
            filterable: true,
            filterType: "text",
            filterKey: "created_by__full_name",
            Cell: ({ value }) => <UserWithAvatar user={value} />,
            excelFormat: (val) => {
                if (!val) return "";
                return val.email || val.full_name ||
                    (typeof val === "object" ? JSON.stringify(val) : String(val));
            },
        },
        {
            Header: "Created At",
            accessor: "created_at",
            filterType: "date",
            filterable: true,
        },
        {
            Header: "Updated By",
            accessor: "updated_by",
            filterable: true,
            filterType: "text",
            filterKey: "updated_by__full_name",
            Cell: ({ value }) => <UserWithAvatar user={value} />,
            excelFormat: (val) => {
                if (!val) return "";
                return val.email || val.full_name ||
                    (typeof val === "object" ? JSON.stringify(val) : String(val));
            },
        },
        {
            Header: "Updated At",
            accessor: "updated_at",
            filterType: "date",
            filterable: true,
        },
    ];

    const buttons = (
        <div className="flex gap-2">
            <button
                type="button"
                onClick={downloadPDF}
                disabled={isDownloading}
                className="ti-btn ti-btn-success !py-1 !px-2 !text-[0.75rem]"
            >
                <i className={`bi bi-file-earmark-pdf ${isDownloading ? "spin" : ""}`}></i>
            </button>

            <Link
                to={DYNAMICS_ROUTES.ADD.path}
                className="whitespace-nowrap ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i> Add New Entry
            </Link>


        </div>
    );

    return (
        <>
            <IconPageHeader
                heading="Sweepers and Guards Management"
                description="Manage sweepers and guards data, store details, and capacity usage."
                icon={BookOpenText}
            />
            <DataTable
                ref={dataTableRef}
                columns={columns}
                title="Sweepers & Guards Management"
                apiUrl="/dynamics/sweepers-and-guards/datatable/"
                buttons={buttons}
                needHeader={false}
                enableAdvancedFilters={true} // ✅ advanced filters enabled
            />
        </>
    );
};

export default SweepersGuardsList;
