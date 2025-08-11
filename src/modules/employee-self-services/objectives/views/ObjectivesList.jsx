import React, { useRef } from "react";
import { CalendarRange } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import ProgressBar from "@components/ProgressBar.jsx";
import Avatar from "@components/Avatar.jsx";
import {Link} from "react-router-dom";
import {useActiveYear} from "@modules/employee-self-services/objectives/hooks/useActiveYear.js";
const ObjectivesList = () => {
    const { isActiveYear } = useActiveYear();

    const dataTableRef = useRef();
    const columns = [
        {
            Header: 'Year',
            accessor: 'year',
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
        {
            Header: 'Weightage',
            accessor: 'total_weightage',
            excelColumnType:'number',
            Cell: ({ row }) => {
                return (
                    <ProgressBar
                        value={row.original.total_weightage}
                        withStatus={false}
                    />
                );
            },
        },
        {
            Header: 'Total KRAs',
            accessor: 'total_kras',
        },
        {
            Header: 'Submitted At',
            accessor: 'submitted_at',
        },
        {
            Header: 'Actions',
            accessor: 'id',
            disableSortBy: true,
            Cell: ({ row }) => {
                const { slug, year, is_editable } = row.original;
                return (
                    <div className="flex space-x-2">
                        {is_editable && (
                            <Link to={`/module/ess/objectives/edit/${year}`}
                                  title="Edit Objective"
                                  className="ti-btn ti-btn-primary ti-btn-sm">
                                <i className="ri-edit-line"></i>
                            </Link>
                        )}
                        <Link
                            to={`/module/ess/objectives/detail/${slug}`}
                              title="Edit Objective"
                              className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-eye-line"></i>
                        </Link>
                    </div>
                );
            },
        },
    ];

    const buttons = isActiveYear ? (
        <div className="flex space-x-2">
            <Link
                to='/module/ess/objectives/create'
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i> Objective
            </Link>
        </div>
    ) : null;

    return (
        <>
            <IconPageHeader
                heading="Objectives"
                description="Track and manage yearly objectives and their progress."
                icon={CalendarRange}
            />
            <DataTable
                ref={dataTableRef}
                columns={columns}
                apiUrl="/hrms/objectives/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
                buttons={buttons}
            />
        </>
    );
};

export default ObjectivesList;
