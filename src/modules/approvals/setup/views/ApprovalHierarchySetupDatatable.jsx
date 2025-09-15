import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {CalendarRange, Edit} from "lucide-react";
import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import {formatDate} from "@helpers/dateTime.js";
import UserWithAvatar from "@components/UserWithAvatar.jsx";
import {Link} from "react-router-dom";

const ApprovalHierarchySetupDatatable = () => {
    const columns = [
        {
            Header: 'Approval Type',
            accessor: 'approval_type',
            filterType: 'text',
            filterable: true,
            filterKey:  'approval_type__label',
            Cell: ({ row }) => {
                const approval_type = row.original.approval_type;
                const id = row.original.id;
                return (
                    <Link
                        to={`/module/approvals/setups/hierarchy/edit/${id}`}
                        className="text-primary hover:underline flex items-center justify-center space-x-1"
                    >
                        <span>{approval_type}</span>
                        <Edit className="h-3.5 w-3.5" />
                    </Link>
                );
            },
        },
        {
            Header: 'Company',
            accessor: 'company.name',
            filterType: 'text',
            filterable: true,
            filterKey:  'company__name',
        },
        {
            Header: 'Department',
            accessor: 'department.name',
            filterType: 'text',
            filterable: true,
            filterKey:  'department__name',
        },
        {
            Header: "Created At",
            accessor: "created_at",
            Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy - HH:mm") : ""),
            filterType: 'date',
            filterable: true,
        },
        {
            Header: 'Created by',
            accessor: 'created_by',
            Cell: ({value}) => (
                <UserWithAvatar user={value} />
            )
        },
    ]
    const buttons =  (
        <div className="flex space-x-2">
            <Link
                to='/module/approvals/setups/hierarchy/create'
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i>
            </Link>
        </div>
    );
    return (
        <>
            <IconPageHeader
                heading="Approval Hierarchy Setup"
                description="Configure approval hierarchy and other things."
                icon={CalendarRange}
            />
            <DataTable
                columns={columns}
                apiUrl="/approvals/hierarchy/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
                buttons={buttons}
            />
        </>
    );
};

export default ApprovalHierarchySetupDatatable;
