import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {CalendarRange, Edit} from "lucide-react";
import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import {formatDate} from "@helpers/dateTime.js";
import UserWithAvatar from "@components/UserWithAvatar.jsx";
import {Link} from "react-router-dom";

const ApprovalTypeSetupDatatable = () => {
    const columns = [
        {
            Header: 'Code',
            accessor: 'code',
            filterType: 'text',
            filterable: true,
            Cell: ({ row }) => {
                const code = row.original.code;
                const id = row.original.id;
                return (
                    <Link
                        to={`/module/approvals/setups/type/edit/${id}`}
                        className="text-primary hover:underline flex items-center justify-center space-x-1"
                    >
                        <span>{code}</span>
                        <Edit className="h-3.5 w-3.5" />
                    </Link>
                );
            },
        },
        {
            Header: 'Label',
            accessor: 'label',
            filterType: 'text',
            filterable: true,
        },
        {
            Header: 'Description',
            accessor: 'description',
            filterType: 'text',
            filterable: true,
        },
        {
            Header: "Active",
            accessor: "is_active",
            filterType: 'boolean',
            filterable: true,
            Cell: ({value}) => (value ? 'Yes': 'No')
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
                to='/module/approvals/setups/type/create'
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i>
            </Link>
        </div>
    );
    return (
        <>
            <IconPageHeader
                heading="Approval Type Setup"
                description="Configure type of approvals and other things."
                icon={CalendarRange}
            />
            <DataTable
                columns={columns}
                apiUrl="/approvals/type/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
                buttons={buttons}
            />
        </>
    );
};

export default ApprovalTypeSetupDatatable;
