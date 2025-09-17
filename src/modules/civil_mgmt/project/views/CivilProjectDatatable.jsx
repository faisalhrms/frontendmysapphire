import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Edit, HardHat} from "lucide-react";
import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import {formatDate} from "@helpers/dateTime.js";
import UserWithAvatar from "@components/UserWithAvatar.jsx";
import {Link} from "react-router-dom";
import {priorities, projectStatuses} from "@modules/project-management/services/projectService.js";
import {formatAmountWithCommas, toTitleCase} from "@helpers/formatters.js";
import {getBadgeClasses, getStatusClasses} from "@helpers/badges.js";
import AvatarList from "@components/AvatarList.jsx";
import {projectCurrency} from "@modules/civil_mgmt/project/hooks/useCivilProjectForm.js";

const CivilProjectDatatable = () => {
    const columns = [
        {
            Header: '#',
            accessor: 'project_no',
            filterType: 'text',
            filterable: true,
            Cell: ({ row }) => {
                const project_no = row.original.project_no;
                const id = row.original.id;
                return (
                    <Link
                        to={`/module/civil/project/edit/${id}`}
                        className="text-primary hover:underline flex items-center justify-center space-x-1"
                    >
                        <span>{project_no}</span>
                        <Edit className="h-3.5 w-3.5" />
                    </Link>
                );
            },
        },
        {
            Header: 'Site',
            accessor: 'site.name',
            filterType: 'text',
            filterable: true,
            filterKey: 'site__name',
        },
        {
            Header: 'Name',
            accessor: 'name',
            filterType: 'text',
            filterable: true,
        },
        {
            Header: 'Type',
            accessor: 'type.name',
            filterType: 'text',
            filterable: true,
            filterKey: 'type__name',
        },
        {
            Header: 'Manager',
            accessor: 'manager',
            Cell: ({value}) => (
                <UserWithAvatar user={value} />
            )
        },
        {
            Header: 'Members',
            accessor: 'users',
            disableSortBy: true,
            filterType: 'text',
            filterable: true,
            filterKey: 'users__full_name',
            Cell: ({row}) => {
                const users = row.original.users;
                return (
                    <>
                        <AvatarList users={users} />
                    </>
                );
            },
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
            Header: 'Completed At',
            accessor: 'completed_at',
            filterType: 'date',
            filterable: true,
        },
        {
            Header: "Status",
            accessor: "status",
            filterType: 'select',
            filterable: true,
            filterOptions: projectStatuses,
            width: 250,
            excelStyleMap: {
                not_started:    { label: 'NOT STARTED',     bgColor: '#F57C00', textColor: '#FFFFFF' }, // orange
                active:         { label: 'ACTIVE',  bgColor: '#388E3C', textColor: '#FFFFFF' }, // dark green
                completed:      { label: 'COMPLETED',       bgColor: '#2E7D32', textColor: '#FFFFFF' }, // green
                on_hold:        { label: 'ON HOLD',         bgColor: '#C2185B', textColor: '#FFFFFF' }, // pink
                archived:       { label: 'ARCHIVED',       bgColor: '#D32F2F', textColor: '#FFFFFF' }, // red
            },
            Cell: ({ row }) => (
                <div className={`min-w-[200px]`}>
                    <p className={getStatusClasses(row.original.status)}>{toTitleCase(row.original.status)}</p>
                </div>
            ),
        },
        {
            Header: 'Priority',
            accessor: 'priority',
            filterType: 'select',
            filterable: true,
            filterOptions: priorities,
            excelStyleMap: {
                low: {label: 'LOW', bgColor: '#9E9E9E', textColor: '#FFFFFF'},
                high: {label: 'HIGH', bgColor: '#D32F2F', textColor: '#FFFFFF'},
                medium: {label: 'MEDIUM', bgColor: '#0097A7', textColor: '#FFFFFF'},
            },
            headerClassName: '!text-center',
            Cell: ({cell}) => {
                return toTitleCase(cell.value);
            },
            getCellProps: (cellInfo) => {
                return {
                    className: `${getBadgeClasses(cellInfo.value, '', false)}`,
                }
            },
        },
        {
            Header: 'Estimated Budget',
            accessor: 'estimated_budget',
            filterType: 'number',
            filterable: true,
            Cell: ({ value }) => (value ? formatAmountWithCommas(value) : ""),
        },
        {
            Header: "Currency",
            accessor: "currency",
            filterType: 'select',
            filterable: true,
            filterOptions: projectCurrency,
        },
        {
            Header: 'Company',
            accessor: 'company.name',
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
                to='/module/civil/project/create'
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i>
            </Link>
        </div>
    );
    return (
        <>
            <IconPageHeader
                heading="Civil Management System - Projects"
                description="Manage civil projects, track progress, assign managers, and collaborate with team members."
                icon={HardHat}
            />
            <DataTable
                columns={columns}
                apiUrl="/civil/project/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
                buttons={buttons}
            />
        </>
    );
};

export default CivilProjectDatatable;
