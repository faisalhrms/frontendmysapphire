import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { FileText } from "lucide-react";
import DataTable from "@components/datatable/DataTable.jsx";
import React, { useRef } from "react";
import { Link } from "react-router-dom";

const ApplicationUniverseList = () => {
    const dataTableRef = useRef();

    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex justify-center space-x-2">
                    <Link to={`/module/it-governance/application-universe/edit/${row.original.id}`}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line" />
                        </button>
                    </Link>
                    <Link to={`/module/it-governance/application-universe/detail/${row.original.id}`}>
                        <button className="ti-btn ti-btn-info ti-btn-sm">
                            <i className="ri-eye-line"></i>
                        </button>
                    </Link>
                </div>
            ),
        },
        {
            Header: "Application Name",
            accessor: "application_name",
            filterable: true,
            filterType: "text",
            filterKey: "application_name",
        },
        {
            Header: "Application Type",
            accessor: "application_type",
            filterable: true,
            filterType: "select",
            filterKey: "application_type",
            filterOptions: [
                { value: "in_house", label: "In-house Developed" },
                { value: "purchased", label: "Purchased" },
                { value: "customized", label: "Customized" },
                { value: "offshore", label: "Offshore" },
            ],
            Cell: ({ value }) =>
                value ? value.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()) : "N/A",
        },
        {
            Header: "Ownership",
            accessor: "application_ownership",
            filterable: true,
            filterType: "text",
            filterKey: "application_ownership",
        },
        {
            Header: "Company",
            accessor: "company.name",
            Cell: ({ row }) =>
                row.original.company ? row.original.company.name : "N/A",
            filterable: true,
            filterType: "text",
            filterKey: "company__name",
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
            to={`/module/it-governance/application-universe/add`}
            className="whitespace-nowrap ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
        >
            <i className="ri-add-line font-semibold align-middle"></i> Add Application
        </Link>
    );

    return (
        <>
            <IconPageHeader
                heading="Application Universe"
                description="Manage the list of in-house or purchased applications with ownership and company details."
                icon={FileText}
            />
            <DataTable
                ref={dataTableRef}
                columns={columns}
                title="Application Universe"
                apiUrl="/application-universe/datatable/"
                buttons={buttons}
                needHeader={false}
                enableAdvancedFilters={true}
            />
        </>
    );
};

export default ApplicationUniverseList;
