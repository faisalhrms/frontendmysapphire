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
    const [expandedRows, setExpandedRows] = useState(new Set());
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

    const toggleRowExpansion = (rowId) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(rowId)) {
                newSet.delete(rowId);
            } else {
                newSet.add(rowId);
            }
            return newSet;
        });
    };

    // Helper component for rendering the details table
    const DetailsTable = ({ details }) => {
        if (!details || details.length === 0) {
            return (
                <div className="p-4 text-center text-gray-500">
                    No details available
                </div>
            );
        }

        const getPriorityBadge = (priority) => {
            const badges = {
                high: 'badge bg-danger text-white',
                medium: 'badge bg-warning text-white',
                low: 'badge bg-success text-white'
            };
            return badges[priority?.toLowerCase()] || 'badge bg-secondary text-white';
        };

        return (
            <div className="p-4 bg-gray-50 dark:bg-neutral-800">
                <h6 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    Objective Details
                </h6>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-200 dark:border-neutral-700">
                        <thead>
                        <tr className="bg-gray-100 dark:bg-neutral-700">
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-neutral-600">
                                KRA
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-neutral-600">
                                KPI
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-neutral-600">
                                Weightage
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-neutral-600">
                                Quarter
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-neutral-600">
                                Priority
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {details.map((detail, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-neutral-750">
                                <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-neutral-600">
                                    {detail.kra || 'N/A'}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-neutral-600">
                                    {detail.kpi || 'N/A'}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-neutral-600">
                                        <span className="font-medium">
                                            {detail.weightage ? `${parseFloat(detail.weightage)}%` : 'N/A'}
                                        </span>
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-neutral-600">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                            Q{detail.quarter || 'N/A'}
                                        </span>
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-neutral-600">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(detail.priority)}`}>
                                            {toTitleCase(detail.priority) || 'N/A'}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const columns = [
        {
            Header: 'Person',
            accessor: 'user.full_name',
            filterable: true,
            filterType: 'text',
            filterKey: 'user__full_name',
            Cell: ({ row }) => {
                const isExpanded = expandedRows.has(row.original.id);
                const hasDetails = row.original.details && row.original.details.length > 0;

                return (
                    <div>
                        <div className="flex items-center">
                            {/* Expansion toggle button */}
                            <button
                                onClick={() => toggleRowExpansion(row.original.id)}
                                className={`mr-2 p-1 rounded transition-colors duration-200 ${
                                    hasDetails
                                        ? 'hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-600 dark:text-gray-400'
                                        : 'text-gray-300 cursor-not-allowed'
                                }`}
                                disabled={!hasDetails}
                                title={hasDetails ? (isExpanded ? 'Collapse details' : 'Expand details') : 'No details available'}
                            >
                                {hasDetails ? (
                                    isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )
                                ) : (
                                    <div className="h-4 w-4" />
                                )}
                            </button>

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

                        {/* Expandable details section */}
                        {isExpanded && hasDetails && (
                            <div className="mt-3 ml-6">
                                <DetailsTable details={row.original.details} />
                            </div>
                        )}
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
            Header: 'Remarks',
            accessor: 'remarks',
            Cell: ({ cell, row }) => {
                const objective = row.original;
                const remarks = cell.value || '';
                const [expanded, setExpanded] = React.useState(false);

                const toggleExpand = () => setExpanded(!expanded);

                const plainTextLength = remarks.length;
                const shouldShowToggle = plainTextLength > 100;

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
                            {remarks}
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
                    </div>
                );
            },
            minWidth: 200,
            maxWidth: 400
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
            <ObjectiveRemarksModal
                isOpen={remarksModalOpen}
                objective={selectedObjective}
                onClose={handleCloseRemarksModal}
            />
        </>
    );
};

export default HrObjectivesList;