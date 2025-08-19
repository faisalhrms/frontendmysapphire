import React, { useRef, useState } from "react";
import { Trophy, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import ProgressBar from "@components/ProgressBar.jsx";
import Avatar from "@components/Avatar.jsx";
import {Link} from "react-router-dom";
import ObjectiveRemarksModal from "@modules/hrms/components/ObjectiveRemarksModel.jsx";

const HrObjectivesList = () => {
    const dataTableRef = useRef();
    const [remarksModalOpen, setRemarksModalOpen] = useState(false);
    const [selectedObjective, setSelectedObjective] = useState(null);

    const openRemarksModal = (objective) => {
        setSelectedObjective(objective);
        setRemarksModalOpen(true);
    };

    const handleCloseRemarksModal = (updated) => {
        setRemarksModalOpen(false);
        setSelectedObjective(null);
        if (updated) {
            dataTableRef.current?.refetch();
        }
    };



    const columns = [
        {
            Header: "Year",
            accessor: "year",
            filterable: true,
            filterType: "number",
            filterKey: "setup_year__year",
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
            Header: 'Person',
            accessor: 'user.full_name',
            filterable: true,
            filterType: 'text',
            filterKey: 'user__full_name',
            Cell: ({ row }) => {
                return (
                    <div className="flex items-center">
                        <Avatar
                            avatar={row.original?.user?.avatar ? row.original : null}
                            full_name={row.original?.user?.full_name || 'N A'}
                            size="md"
                            parentClasses="dark:text-gray-200 dark:bg-bodybg"
                        />
                        <div className="ms-2">
                            <p className="font-semibold mb-0 flex items-center">
                                {row.original?.user?.full_name || 'N/A'}
                            </p>
                            <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                {row.original?.user?.email || 'N/A'}
                            </p>
                        </div>
                    </div>
                );
            }
        },
        {
            Header: "Designation",
            accessor: "user.designation",
            filterable: true,
            filterType: 'text',
            filterKey: 'user__employee__designation__name',
        },
        {
            Header: "Department",
            accessor: "user.department",
            filterable: true,
            filterType: 'text',
            filterKey: 'user__employee__department__name',

        },
        {
            Header: "Position",
            accessor: "user.position",
            filterable: true,
            filterType: 'text',
            filterKey: 'user__employee__position__name',

        },
        {
            Header: 'Pending At',
            accessor: 'current_approver',
            filterable: true,
            filterType: 'text',
            filterKey: 'current_approver__full_name',
            Cell: ({ value }) => {
                if (!value?.full_name && !value?.email && !value?.avatar) {
                    return null;
                }

                return (
                    <div className="flex items-center">
                        <Avatar
                            avatar={value?.avatar || null}
                            full_name={value?.full_name || ''}
                            size='md'
                            parentClasses='dark:text-gray-200 dark:bg-bodybg'
                        />
                        <div className='ms-2'>
                            {value?.full_name && (
                                <p className="font-semibold mb-0 flex items-center">
                                    {value.full_name}
                                </p>
                            )}
                            {value?.email && (
                                <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                    {value.email}
                                </p>
                            )}
                        </div>
                    </div>
                );
            }
        },
        {
            Header: 'Status',
            accessor: 'status',
            filterable: true,
            filterType: 'select',
            filterKey: 'status',
            filterOptions: [
                { value: 'approved', label: 'Approved' },
                { value: 'under_approval', label: 'Under Approval' },
                { value: 'rejected', label: 'Rejected' },
            ],
            Cell: ({ value }) => toTitleCase(value),
            getCellProps: (cellInfo) => {
                const value = cellInfo.value;
                let bgClass = "";
                let textClass = "";

                if (value === "under_approval") {
                    bgClass = "bg-warning/30";
                    textClass = "text-warning";
                }
                else if (value === "approved") {
                    bgClass = "bg-success/30";
                    textClass = "text-success";
                }
                else if (value === "rejected") {
                    bgClass = "bg-danger/30";
                    textClass = "text-danger";
                }
                else {
                    bgClass = "bg-primary/30";
                    textClass = "text-primary";
                }

                return {
                    className: `capitalize px-2 py-1 rounded ${bgClass} ${textClass}`,
                };
            },
        },
        {
            Header: 'Weightage',
            accessor: 'total_weightage',
            excelColumnType:'number',
            disableSortBy:true,
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
            disableSortBy:true,
        },
        {
            Header: 'HR Remarks',
            accessor: 'remarks',
            disableSortBy:true,
            Cell: ({ cell, row }) => {
                const objective = row.original;
                const remarks = cell.value || '';
                const [expanded, setExpanded] = React.useState(false);

                const toggleExpand = () => setExpanded(!expanded);

                const plainTextLength = remarks.length;
                const shouldShowToggle = plainTextLength > 100;

                // check if remarks are editable (status must be approved)
                const isEditable = objective.status === 'approved';

                return (
                    <div className="group relative min-w-[200px] pr-8">
                        <div
                            className={`text-xs text-gray-500 italic whitespace-pre-line break-words transition-all duration-300 ${
                                shouldShowToggle && !expanded ? 'max-h-5 overflow-hidden' : ''
                            }`}
                            style={{
                                maskImage:
                                    shouldShowToggle && !expanded
                                        ? 'linear-gradient(to bottom, black 60%, transparent 100%)'
                                        : 'none'
                            }}
                        >
                            {remarks || (isEditable ? '' : '—')}
                        </div>

                        {shouldShowToggle && (
                            <button
                                onClick={toggleExpand}
                                className="text-primary hover:text-primary-800 text-xs font-medium mt-1 flex items-center transition-colors"
                            >
                                {expanded ? (
                                    <>
                                        <i className="ri-arrow-up-s-line mr-1"></i>
                                        Collapse
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-arrow-down-s-line mr-1"></i>
                                        Read More
                                    </>
                                )}
                            </button>
                        )}

                        {/* Show add/edit button only if status is approved */}
                        {isEditable && (
                            <button
                                onClick={() => openRemarksModal(objective)}
                                className={`absolute ${
                                    remarks
                                        ? 'right-0 top-0'
                                        : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-success'
                                } group-hover:opacity-100 transition-opacity duration-200 p-1 text-gray-500 hover:text-primary`}
                                aria-label={remarks ? 'Edit remarks' : 'Add remarks'}
                            >
                                <i className={`ri-${remarks ? 'edit-2' : 'add'}-line text-base`}></i>
                            </button>
                        )}
                    </div>
                );
            },
            minWidth: 200,
            maxWidth: 400
        },
        {
            Header: 'Submitted At',
            accessor: 'submitted_at',
            filterType: 'date',
            filterable: true,
        },
        {
            Header: 'Created At',
            accessor: 'created_at',
            filterType: 'date',
            filterable: true,
        },
    ];

    return (
        <>
            <IconPageHeader
                heading="Organization Objective"
                description="Manage your Organiztion objectives and stay on track to success."
                icon={Trophy}
            />
            <DataTable
                ref={dataTableRef}
                columns={columns}
                apiUrl="/hrms/hr/objective/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
            />
            <ObjectiveRemarksModal
                isOpen={remarksModalOpen}
                objective={selectedObjective}
                onClose={handleCloseRemarksModal}
            />
        </>
    );
};

export default HrObjectivesList;