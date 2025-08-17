import React, { useRef } from "react";
import { Trophy,ExternalLink } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import ProgressBar from "@components/ProgressBar.jsx";
import Avatar from "@components/Avatar.jsx";
import {Link} from "react-router-dom";
import {useActiveYear} from "@modules/employee-self-services/objectives/hooks/useActiveYear.js";
const HrObjectivesList = () => {

    const dataTableRef = useRef();
    const columns = [
        {
            Header: 'Person',
            accessor: 'user.full_name',
            filterable: true,
            filterType: 'text',
            filterKey: 'user__full_name',
            Cell: ({ row }) => (
                <div className="flex items-center">
                    <Avatar
                        avatar={row.original?.user?.avatar ? row.original : null}
                        full_name={row.original?.user?.full_name || 'N A'}
                        size='md'
                        parentClasses='dark:text-gray-200 dark:bg-bodybg'
                    />
                    <div className='ms-2'>
                        <p className="font-semibold mb-0 flex items-center">
                            {row.original?.user?.full_name || 'N/A'}
                        </p>
                        <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                            {row.original?.user?.email || 'N/A'}
                        </p>
                    </div>
                </div>
            )
        },
        {
            Header: "Designation",
            accessor: "user.designation",
            filterable: true,
            filterType: 'text',
            filterKey: 'user__employee__designation__name',
        },
        {
            Header: "Position",
            accessor: "user.position",
            filterable: true,
            filterType: 'text',
            filterKey: 'user__employee__position__name',
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
                        className="text-primary hover:underline flex items-center justify-center space-x-1"
                    >
                        <span>{year}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                );
            },
        },

        {
            Header: 'Submitted At',
            accessor: 'submitted_at',
        },
        {
            Header: 'Created At',
            accessor: 'created_at',
        },
    ];


    return (
        <>
            <IconPageHeader
                heading="Objectives"
                description="Manage your strategic objectives and stay on track to success."
                icon={Trophy}
            />
            <DataTable
                ref={dataTableRef}
                columns={columns}
                apiUrl="/hrms/hr/objective/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
            />
        </>
    );
};

export default HrObjectivesList;
