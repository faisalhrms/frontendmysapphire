import React, { useRef } from "react";
import { Target, ExternalLink } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import Avatar from "@components/Avatar.jsx";
import {formatDate} from "@helpers/dateTime.js";
import {Link} from "react-router-dom";
const TeamObjectivesList = () => {

    const dataTableRef = useRef();
    const columns = [
        {
            Header: 'Person',
            accessor: 'user',
            Cell: ({ value }) => (
                <div className="flex items-center">
                    <Avatar
                        avatar={value?.avatar ? value?.avatar : null}
                        full_name={value?.full_name || 'N A'}
                        size='md'
                        parentClasses='dark:text-gray-200 dark:bg-bodybg'
                    />
                    <div className='ms-2'>
                        <p className="font-semibold mb-0 flex items-center">
                            {value?.full_name || 'N/A'}
                        </p>
                        <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                            {value?.email || 'N/A'}
                        </p>
                    </div>
                </div>
            )
        },
        {
            Header: "Year",
            accessor: "year",
            Cell: ({ row }) => {
                const year = row.original.year;
                const slug = row.original.slug;
                return (
                    <Link
                        to={`/module/ess/objectives/detail/${slug}`}
                        title={`View Objective for ${year}`}
                        className="text-primary hover:underline flex items-center space-x-1"
                    >
                        <span className="pl-14">{year}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                );
            },
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ value }) => toTitleCase(value),
            getCellProps: (cellInfo) => {
                const value = cellInfo.value;
                let bgClass = "";

                if (value === "under_approval") bgClass = "bg-warning";
                else if (value === "approved") bgClass = "bg-success";
                else if (value === "rejected") bgClass = "bg-danger";
                else bgClass = "bg-primary";

                return {
                    className: `text-white capitalize ${bgClass}`,
                };
            },
        },
        {
            Header: 'Total KRAs',
            accessor: 'total_kras',
        },
        {
            Header: 'Created At',
            accessor: 'created_at',
            Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy - HH:mm") : ""),
        },
        {
            Header: 'Submitted At',
            accessor: 'submitted_at',
            Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy - HH:mm") : ""),
        },
        {
            Header: 'Pending At',
            accessor: 'current_approver',
            Cell: ({ value }) => (
                <div className="flex items-center">
                    <Avatar
                        avatar={value?.avatar ? value?.avatar : null}
                        full_name={value?.full_name || 'N A'}
                        size='md'
                        parentClasses='dark:text-gray-200 dark:bg-bodybg'
                    />
                    <div className='ms-2'>
                        <p className="font-semibold mb-0 flex items-center">
                            {value?.full_name || 'N/A'}
                        </p>
                        <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                            {value?.email || 'N/A'}
                        </p>
                    </div>
                </div>
            )
        },
    ];

    return (
        <>
            <IconPageHeader
                heading="Team Objectives"
                description="Set, track, and manage your team's yearly objectives to drive collective success."
                icon={Target}
            />
            <DataTable
                ref={dataTableRef}
                columns={columns}
                apiUrl="/hrms/objectives/team-objectives/"
                needHeader={false}
                enableAdvancedFilters={false}
            />
        </>
    );
};

export default TeamObjectivesList;
