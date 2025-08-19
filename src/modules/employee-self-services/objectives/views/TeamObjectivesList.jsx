import React, { useRef } from "react";
import { Target, ExternalLink, Crown } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import Avatar from "@components/Avatar.jsx";
import {Link} from "react-router-dom";
const TeamObjectivesList = ({ externalFilters = [] }) => {

    const dataTableRef = useRef();
    const columns = [
        {
            Header: "Person",
            accessor: "full_name",
            filterable: true,
            filterType: "text",
            filterKey: "full_name",
            Cell: ({ row }) => {
                const { full_name, email, avatar, is_line_manager } = row.original;

                return (
                    <div className="flex items-center">
                        <Avatar
                            avatar={avatar ? row.original : null}
                            full_name={full_name || "N A"}
                            size="md"
                            parentClasses="dark:text-gray-200 dark:bg-bodybg"
                        />
                        <div className="ms-2">
                            <p className="font-semibold mb-0 flex items-center">
                                {full_name || "N/A"}
                                {is_line_manager && (
                                    <Crown
                                        className="ml-1 text-warning"
                                        size={14}
                                        title="Line Manager"
                                    />
                                )}
                            </p>
                            <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                {email || "N/A"}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            Header: "Designation",
            accessor: "designation",
            filterable: true,
            filterType: 'text',
            filterKey: 'employee__designation__name',
        },
        {
            Header: "Year",
            accessor: "year",
            filterable: false,
            filterType: 'number',
            filterKey: 'year',
            disableSortBy: true,

        },
        {
            Header: "Objective",
            accessor: "actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row }) => {
                const objective = row.original.objective;
                const year = row.original.year;
                return (
                    objective ? (
                        <Link
                            to={`/module/ess/objectives/detail/${objective}`}
                            title={`View Objective for ${year}`}
                            className="text-primary hover:underline flex items-center justify-center space-x-1"
                        >
                            <span>{year}</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                    ) : ''
                );
            },
        }
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
                enableAdvancedFilters={true}
                externalFilters={externalFilters}
            />
        </>
    );
};

export default TeamObjectivesList;
