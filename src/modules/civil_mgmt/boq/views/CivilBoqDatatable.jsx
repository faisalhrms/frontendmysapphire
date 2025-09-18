import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Home , Edit} from "lucide-react";
import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import {formatDate} from "@helpers/dateTime.js";
import UserWithAvatar from "@components/UserWithAvatar.jsx";
import {Link} from "react-router-dom";

const CivilBoqDatatable = () => {
    const columns = [
        {
            Header: 'Name',
            accessor: 'name',
            filterType: 'text',
            filterable: true,
            Cell: ({ row }) => {
                const name = row.original.name;
                const id = row.original.id;
                return (
                    <Link
                        to={`/module/civil/site/edit/${id}`}
                        className="text-primary hover:underline flex items-center justify-center space-x-1"
                    >
                        <span>{name}</span>
                        <Edit className="h-3.5 w-3.5" />
                    </Link>
                );
            },
        },
        {
            Header: 'Address',
            accessor: 'address',
            filterType: 'text',
            filterable: true,
        },
        {
            Header: 'Ended At',
            accessor: 'ended_at',
            filterType: 'date',
            filterable: true,
        },
        {
            Header: 'Company',
            accessor: 'company.name',
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
                to='/module/civil/site/create'
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i>
            </Link>
        </div>
    );
    return (
        <>
            <IconPageHeader
                heading="Civil Management System - Sites"
                description="Manage sites, addresses, and locations."
                icon={Home}
            />
            <DataTable
                columns={columns}
                apiUrl="/civil/site/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
                buttons={buttons}
            />
        </>
    );
};

export default CivilBoqDatatable;
