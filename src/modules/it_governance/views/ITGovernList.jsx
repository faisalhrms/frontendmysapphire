import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { FileText } from "lucide-react";
import DataTable from "@components/datatable/DataTable.jsx";
import React, { useRef } from "react";
import { Link } from "react-router-dom";

const ITGovernList = () => {
    const dataTableRef = useRef();

    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex justify-center space-x-2">
                    <Link to={`/module/it-governance/service-level-agreements/edit/${row.original.id}`}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line" />
                        </button>
                    </Link>
                    <Link to={`/module/it-governance/service-level-agreements/detail/${row.original.id}`}>
                        <button className="ti-btn ti-btn-info ti-btn-sm">
                            <i className="ri-eye-line"></i>
                        </button>
                    </Link>
                </div>
            ),
        },
        {
            Header: "Vendor Name",
            accessor: "vendor_name",
            filterable: true,
            filterType: "text",
            filterKey: "vendor_name",
        },
        {
            Header: "Key Metric",
            accessor: "key_metric.name",
            Cell: ({ row }) => row.original.key_metric ? row.original.key_metric.name : "N/A",
            filterable: true,
            filterType: "text",
            filterKey: "key_metric__name",
        },
        {
            Header: "Priority",
            accessor: "priority",
            filterable: true,
            filterType: "select",
            filterKey: "priority",
            filterOptions: [
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
            ],
            Cell: ({ value }) => value ? value.charAt(0).toUpperCase() + value.slice(1) : "N/A",
        },
        {
            Header: "Termination Notice Period (Days)",
            accessor: "termination_notice_period",
            filterable: true,
            filterType: "number",
            filterKey: "termination_notice_period",
            Cell: ({ value }) => value ? `${value} days` : "N/A",
        },
        {
            Header: "Created At",
            accessor: "created_at",
            filterable: true,
            filterType: "date",
            filterKey: "created_at",
            Cell: ({ value }) =>
                value ? new Date(value).toLocaleDateString() : "N/A",
        },
    ];

    const buttons = (
        <Link
            to={`/module/it-governance/service-level-agreements/add`}
            className="whitespace-nowrap ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
        >
            <i className="ri-add-line font-semibold align-middle"></i> Add New SLA
        </Link>
    );

    return (
        <>
            <IconPageHeader
                heading="Service Level Agreements"
                description="Manage IT governance service level agreements with vendors and associated key metrics."
                icon={FileText}
            />
            <DataTable
                ref={dataTableRef}
                columns={columns}
                title="Service Level Agreements"
                apiUrl="/service-level-agreements/datatable/"
                buttons={buttons}
                needHeader={false}
                enableAdvancedFilters={true}
            />
        </>
    );
};

export default ITGovernList;
