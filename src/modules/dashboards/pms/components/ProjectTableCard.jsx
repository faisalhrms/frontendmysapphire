import DataTable from "@components/DataTable.jsx";
import React, {useState} from "react";
import ProgressBar from "@components/ProgressBar.jsx";
import {getBadgeClasses} from "@helpers/badges.js";
import {toTitleCase} from "@helpers/formatters.js";
import {formatDate} from "@helpers/dateTime.js";
import AvatarList from "@components/AvatarList.jsx";
import {Link} from "react-router-dom";
import Tooltip from "@components/Tooltip.jsx";
import {priorities, projectStatuses} from "@modules/project-management/services/projectService.js";
import {useSelector} from "react-redux";
import ProjectRemarksModal from "@modules/project-management/components/project/ProjectRemarksModal.jsx";

const ProjectTableCard = ({filters}) => {
    const user = useSelector((state) => state.auth.user);
    const [remarksModalOpen, setRemarksModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const dataTableRef = React.useRef();
    const openRemarksModal = (project) => {
        setSelectedProject(project);
        setRemarksModalOpen(true);
    };

    const handleCloseRemarksModal = (updated) => {
        setRemarksModalOpen(false);
        setSelectedProject(null);
        if (updated) {
            dataTableRef.current?.refetch();
        }
    };
    const columns = [
        {
            Header: 'Project',
            accessor: 'name',
            excelAlignment: 'left',
            filterType: 'text',
            filterable: true,
            Cell: ({row}) => {
                const project = row.original;
                return <div>
                            <Tooltip
                                id={`project-tooltip-${project.id}`}
                                text={`(${project.project_no}) ${project.name}`}
                                tooltipContent={`Click To View Project: ${project.name}`}
                            >
                                <Link
                                    to={`/module/projects/detail/${project.id}`}
                                    className="font-semibold block text-truncate project-list-title">
                                    {project.name}
                                </Link>
                            </Tooltip>
                            <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">Total <strong className="text-defaulttextcolor">{project.completed_tasks}/{project.total_tasks}</strong> tasks completed</p>
                        </div>;
            },
            getCellProps: (cellInfo) => {
                return {
                    className: `!text-left`,
                }
            },
        },
        {
            Header: 'Status',
            accessor: 'status',
            filterType: 'select',
            filterable: true,
            filterOptions: projectStatuses,
            excelStyleMap: {
                not_started:    { label: 'NOT STARTED',     bgColor: '#F57C00', textColor: '#FFFFFF' }, // orange
                active:         { label: 'ACTIVE',          bgColor: '#9E9E9E', textColor: '#FFFFFF' }, // gray
                completed:      { label: 'COMPLETED',       bgColor: '#2E7D32', textColor: '#FFFFFF' }, // green
                on_hold:        { label: 'ON HOLD',         bgColor: '#C2185B', textColor: '#FFFFFF' }, // pink
                archived:       { label: 'ARCHIVED',        bgColor: '#D32F2F', textColor: '#FFFFFF' }, // red
            },
            headerClassName: '!text-center',
            Cell: ({cell}) => {
                return toTitleCase(cell.value);
            },
            getCellProps: (cellInfo) => {
                return {
                    className: `!text-center ${getBadgeClasses(cellInfo.value, '', false)}`,
                }
            },
        },
        {
            Header: 'Start Date',
            accessor: 'started_at',
            filterType: 'datetime',
            filterable: true,
            excelColumnType: 'date',
            excelFormat: "MMM dd, yyyy",
            Cell: ({ value }) => {
                return (
                    formatDate(value)
                );
            },
        },
        {
            Header: 'End Date',
            accessor: 'ended_at',
            filterType: 'datetime',
            filterable: true,
            excelColumnType: 'date',
            excelFormat: "MMM dd, yyyy",
            Cell: ({ value }) => {
                return (
                    formatDate(value)
                );
            },
        },
        {
            Header: 'Estimated Time',
            accessor: 'estimated_time',
        },
        {
            Header: 'Progress',
            accessor: 'progress',
            disableSortBy: true,
            excelColumnType:'number',
            Cell: ({ value }) => {
                return (
                    <ProgressBar
                        value={value}
                    />
                );
            },
        },
        {
            Header: 'Remarks',
            accessor: 'remarks',
            Cell: ({ cell, row }) => {
                const project = row.original;
                const remarks = cell.value || '';
                const [expanded, setExpanded] = React.useState(false);
                const isManager = project.manager_id === user.id;

                const toggleExpand = () => setExpanded(!expanded);

                const plainTextLength = remarks.length;
                const shouldShowToggle = plainTextLength > 100;

                return (
                    <div className={`group relative min-w-[200px] ${isManager ? 'pr-8' : ''}`}>
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

                        {isManager && (
                            <button
                                onClick={() => openRemarksModal(project)}
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
            Header: 'Team',
            accessor: 'users',
            disableSortBy: true,
            filterType: 'text',
            filterable: true,
            filterKey: 'users__full_name',
            Cell: ({value}) => {
                return (
                    <AvatarList users={value}/>
                );
            },
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
                    className: `!text-center ${getBadgeClasses(cellInfo.value, '', false)}`,
                }
            },
        }
    ];
    const buttons = (
            <div className="flex space-x-2">
                <Link to="/module/projects/create"  className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
                    <i className="ri-add-line font-semibold align-middle"></i> Add New Project
                </Link>
            </div>
    );
    return (
        <>
            <div className="xl:col-span-12 col-span-12">
                <DataTable
                    ref={dataTableRef}
                    columns={columns}
                    title="All Projects"
                    apiUrl={`/dashboard/pms/datatable/`}
                    filter={filters}
                    enableAdvancedFilters={true}
                    buttons={buttons}
                    rowClassName='bg-gray-100 dark:bg-neutral-700'
                    tableParentClass='task-table overflow-hidden transition-all duration-300 min-h-[100px]'
                    tableClass='whitespace-nowrap table-bordered min-w-full'
                />
            </div>
            <ProjectRemarksModal
                isOpen={remarksModalOpen}
                project={selectedProject}
                onClose={handleCloseRemarksModal}
            />
        </>
    )
}

export default ProjectTableCard