import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {HardHat} from "lucide-react";
import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import {formatDate} from "@helpers/dateTime.js";
import UserWithAvatar from "@components/UserWithAvatar.jsx";
import {Link} from "react-router-dom";
import {toTitleCase} from "@helpers/formatters.js";
import {getStatusClasses} from "@helpers/badges.js";
import AvatarList from "@components/AvatarList.jsx";
import {boqTenderStatuses} from "@modules/civil_mgmt/tender/hooks/useCivilBoqTenderForm.js";

const CivilBoqTenderDatatable = () => {
    const columns = [
        {
            Header: 'Actions',
            accessor: 'id',
            disableSortBy: true,
            Cell: ({ row }) => {
                const { id, status } = row.original;
                return (
                    <div className="flex justify-center space-x-2">
                        {status === "draft" && (
                            <Link to={`/module/civil/tender/edit/${id}`}
                                  title="Edit BOQ"
                                  className="ti-btn ti-btn-primary ti-btn-sm">
                                <i className="ri-edit-line"></i>
                            </Link>
                        )}
                        <Link
                            to={`/module/civil/tender/detail/${id}`}
                            title="View BOQ"
                            className="ti-btn ti-btn-success ti-btn-sm">
                            <i className="ri-eye-line"></i>
                        </Link>
                    </div>
                );
            },
        },
        {
            Header: 'Project',
            accessor: 'boq.project.name',
            filterType: 'text',
            filterable: true,
            filterKey: "boq__project__name"
        },
        {
            Header: 'BOQ #',
            accessor: 'boq.boq_no',
            filterType: 'text',
            filterable: true,
            filterKey: "boq__boq_name"
        },
        {
            Header: 'Title',
            accessor: 'title',
            filterType: 'text',
            filterable: true,
        },
        {
            Header: 'Started At',
            accessor: 'started_at',
            filterType: 'date',
            filterable: true,
        },
        {
            Header: 'Ended At',
            accessor: 'ended_at',
            filterType: 'date',
            filterable: true,
        },
        {
            Header: "Status",
            accessor: "status",
            filterType: 'select',
            filterable: true,
            filterOptions: boqTenderStatuses,
            width: 250,
            excelStyleMap: {
                draft:    { label: 'DRAFT',     bgColor: '#F57C00', textColor: '#FFFFFF' },
                open:     { label: 'OPEN',  bgColor: '#388E3C', textColor: '#FFFFFF' },
                awarded:  { label: 'AWARDED',       bgColor: '#2E7D32', textColor: '#FFFFFF' },
                canceled: { label: 'CANCELLED',       bgColor: '#D32F2F', textColor: '#FFFFFF' },
            },
            Cell: ({ value }) => toTitleCase(value),
            getCellProps: (cellInfo) => {
                const value = cellInfo.value;
                return {
                    className: getStatusClasses(value),
                };
            },
        },
        {
            Header: 'Vendors',
            accessor: 'vendors',
            disableSortBy: true,
            filterType: 'text',
            filterable: true,
            filterKey: 'vendors__full_name',
            Cell: ({row}) => {
                const vendors = row.original.vendors;
                return (
                    <>
                        <AvatarList users={vendors} />
                    </>
                );
            },
        },
        {
            Header: "Created At",
            accessor: "created_at",
            filterType: 'date',
            filterable: true,
            Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy - HH:mm") : ""),
        },
        {
            Header: "Updated At",
            accessor: "updated_at",
            filterType: 'date',
            filterable: true,
            Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy - HH:mm") : ""),
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
                to='/module/civil/tender/create'
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i>
            </Link>
        </div>
    );
    return (
        <>
            <IconPageHeader
                heading="Civil Management System - BOQ - Tenders"
                description="Manage civil projects, track progress, assign managers, and collaborate with team members."
                icon={HardHat}
            />
            <DataTable
                columns={columns}
                apiUrl="/civil/boq-tenders/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
                buttons={buttons}
            />
        </>
    );
};

export default CivilBoqTenderDatatable;
