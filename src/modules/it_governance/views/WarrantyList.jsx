import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { FileText } from "lucide-react";
import DataTable from "@components/datatable/DataTable.jsx";
import React, { useRef } from "react";
import { Link } from "react-router-dom";

const WarrantyList = () => {
    const dataTableRef = useRef();

    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex justify-center space-x-2">
                    <Link to={`/module/it-governance/warranty/edit/${row.original.id}`}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line" />
                        </button>
                    </Link>
                    <Link to={`/module/it-governance/warranty/detail/${row.original.id}`}>
                        <button className="ti-btn ti-btn-info ti-btn-sm">
                            <i className="ri-eye-line"></i>
                        </button>
                    </Link>
                </div>
            ),
        },
        {
            Header: "Vendor",
            accessor: "vendor",
            filterable: true,
            filterType: "text",
            filterKey: "vendor",
        },
        {
            Header: "Client",
            accessor: "client",
            filterable: true,
            filterType: "text",
            filterKey: "client",
        },
        {
            Header: "Warranty Period",
            accessor: "warranty_period",
            filterable: true,
            filterType: "select",
            filterKey: "warranty_period",
            filterOptions: [
                { value: "1_month", label: "1 Month" },
                { value: "2_months", label: "2 Months" },
                { value: "3_months", label: "3 Months" },
                { value: "4_months", label: "4 Months" },
                { value: "5_months", label: "5 Months" },
                { value: "6_months", label: "6 Months" },
                { value: "7_months", label: "7 Months" },
                { value: "8_months", label: "8 Months" },
                { value: "9_months", label: "9 Months" },
                { value: "10_months", label: "10 Months" },
                { value: "11_months", label: "11 Months" },
                { value: "12_months", label: "12 Months" },
                { value: "1_year", label: "1 Year" },
                { value: "2_years", label: "2 Years" },
                { value: "na", label: "Not Applicable" },
            ],
            Cell: ({ value }) =>
                value
                    ? value
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())
                    : "N/A",
        },
        {
            Header: "Warranty Ends",
            accessor: "warranty_ends",
            filterable: true,
            filterType: "number",
            filterKey: "warranty_ends",
        },
        {
            Header: "Disputes Resolved",
            accessor: "disputes_resolved",
            filterable: true,
            filterType: "text",
            filterKey: "disputes_resolved",
            Cell: ({ value }) =>
                value
                    ? value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                    : "N/A",
        },
        {
            Header: "Exclusions",
            accessor: "exclusions",
            disableSortBy: true,
            Cell: ({ value }) =>
                Array.isArray(value) && value.length > 0
                    ? value.join(", ")
                    : "None",
        },
        {
            Header: "Company",
            accessor: "company.name",
            filterable: true,
            filterType: "text",
            filterKey: "company__name",
            Cell: ({ row }) =>
                row.original.company ? row.original.company.name : "N/A",
        },
        {
            Header: "Created At",
            accessor: "created_at",
            filterable: true,
            filterType: "datetime",
            Cell: ({ value }) =>
                value ? new Date(value).toLocaleDateString() : "N/A",
        },
    ];

    const buttons = (
        <Link
            to={`/module/it-governance/warranty/add`}
            className="whitespace-nowrap ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
        >
            <i className="ri-add-line font-semibold align-middle"></i> Add Warranty
        </Link>
    );

    return (
        <>
            <IconPageHeader
                heading="Warranties"
                description="Manage vendor warranties, clients, periods, and exclusions."
                icon={FileText}
            />
            <DataTable
                ref={dataTableRef}
                columns={columns}
                title="Warranties"
                apiUrl="/warranties/datatable/"
                buttons={buttons}
                needHeader={false}
                enableAdvancedFilters={true}
            />
        </>
    );
};

export default WarrantyList;
