import React, { useEffect, useRef, useState } from "react";
import { CalendarRange } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
const ObjectivesList = () => {
    const dataTableRef = useRef();
    const [isActiveYear, setIsActiveYear] = useState(false);

    useEffect(() => {
        const fetchIsActiveYear = async () => {
            try {
                const response = await api.get('/hrms/objectives/is-active-year/?type=objective');
                if (response.data?.status) {
                    setIsActiveYear(response.data.data?.is_active || false);
                } else {
                    Notify.error(response.data?.message || "Failed to fetch active year status");
                }
            } catch (error) {
                Notify.error(error.response?.data?.message || "Something went wrong");
            }
        };

        fetchIsActiveYear();
    }, []);

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
            Header: 'Total Weightage',
            accessor: 'total_weightage',
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
            Header: 'Current Approver',
            accessor: 'current_approver.full_name',
            Cell: ({ row }) => {
                const approver = row.original.current_approver;
                return approver ? approver.full_name : '-';
            },
        },
        {
            Header: 'Actions',
            accessor: 'id',
            disableSortBy: true,
            Cell: ({ row }) => {
                const { id, is_editable } = row.original;
                return (
                    <div className="flex space-x-2">
                        {is_editable && (
                            <button
                                className="ti-btn ti-btn-primary ti-btn-sm"
                                title="Edit Objective"
                                onClick={() => openModal(id, true)}
                            >
                                <i className="ri-edit-line"></i>
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    const buttons = !isActiveYear ? (
        <div className="flex space-x-2">
            <button
                type="button"
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i>
                <span className="ms-1">Add this year Objectives</span>
            </button>
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
