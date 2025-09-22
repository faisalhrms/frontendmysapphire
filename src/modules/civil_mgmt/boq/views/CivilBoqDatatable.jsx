import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Home , Edit} from "lucide-react";
import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import {formatDate} from "@helpers/dateTime.js";
import UserWithAvatar from "@components/UserWithAvatar.jsx";
import {Link} from "react-router-dom";
import {formatAmountWithCommas, toTitleCase} from "@helpers/formatters.js";
import DatatableFilesList from "@components/datatable/DatatableFilesList.jsx";

const CivilBoqDatatable = () => {
    const columns = [
        {
            Header: 'Actions',
            accessor: 'id',
            disableSortBy: true,
            Cell: ({ row }) => {
                const { id, is_finalized } = row.original;
                return (
                    <div className="flex justify-center space-x-2">
                        {!is_finalized && (
                            <Link to={`/module/civil/boq/edit/${id}`}
                                  title="Edit BOQ"
                                  className="ti-btn ti-btn-primary ti-btn-sm">
                                <i className="ri-edit-line"></i>
                            </Link>
                        )}
                        <Link
                            to={`/module/civil/boq/detail/${id}`}
                            title="View BOQ"
                            className="ti-btn ti-btn-success ti-btn-sm">
                            <i className="ri-eye-line"></i>
                        </Link>
                    </div>
                );
            },
        },
        {
            Header: '#',
            accessor: 'boq_no',
            filterType: 'text',
            filterable: true,
            Cell: ({ row }) => {
                const { id, boq_no, is_finalized } = row.original;
                return is_finalized ? (
                    <span className="text-gray-500 flex items-center justify-center space-x-1">
                        {boq_no}
                    </span>
                ) : (
                    <Link
                        to={`/module/civil/boq/edit/${id}`}
                        className="text-primary hover:underline flex items-center justify-center space-x-1"
                    >
                        <span>{boq_no}</span>
                        <Edit className="h-3.5 w-3.5" />
                    </Link>
                );
            },
        },
        {
            Header: 'Title',
            accessor: 'title',
            filterType: 'text',
            filterable: true,
        },
        {
            Header: 'Total amount',
            accessor: 'total_amount',
            filterable: true,
            filterType: 'number',
            Cell: ({ value }) => (value ? formatAmountWithCommas(value) : ""),
        },
        {
            Header: 'Version',
            accessor: 'version',
            filterable: true,
            filterType: 'number',
            Cell: ({ value }) => (value ? `V ${value}` : ""),
        },
        {
            Header: 'Finalised',
            accessor: 'is_finalized',
            filterable: true,
            filterType: 'boolean',
            Cell: ({value}) => value ? 'YES' : 'NO',
            getCellProps: (cellInfo) => {
                const is_finalized = cellInfo.value;
                return {
                    className: `capitalize px-2 py-1 rounded text-white ${is_finalized ? 'bg-success' : 'bg-primary'}`,
                };
            },
        },
        {
            Header: 'Attachments',
            accessor: 'attachments',
            disableSortBy: true,
            Cell: ({ value }) => {
                return (
                    <DatatableFilesList files={value} />
                );
            },
        },
        {
            Header: 'Site',
            accessor: 'site.name',
            filterable: true,
            filterType: 'text',
            filterKey: "project__site__name"
        },
        {
            Header: 'Project',
            accessor: 'project.name',
            filterable: true,
            filterType: 'text',
            filterKey: "project__name"
        },
        {
            Header: 'Drawings',
            accessor: 'project_drawings',
            disableSortBy: true,
            Cell: ({ value }) => {
                return (
                    <DatatableFilesList files={value} />
                );
            },
        },
        {
            Header: "Created At",
            accessor: "created_at",
            Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy - HH:mm") : ""),
            filterType: 'date',
            filterable: true,
        },
        {
            Header: "Updated At",
            accessor: "updated_at",
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
                to='/module/civil/boq/create'
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i>
            </Link>
        </div>
    );
    return (
        <>
            <IconPageHeader
                heading="Civil Management System - BOQs"
                description="Manage bill of quantities."
                icon={Home}
            />
            <DataTable
                columns={columns}
                apiUrl="/civil/boq/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
                buttons={buttons}
            />
        </>
    );
};

export default CivilBoqDatatable;
