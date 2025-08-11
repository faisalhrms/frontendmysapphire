import React, { useRef } from "react";
import { CalendarRange, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";
import ProgressBar from "@components/ProgressBar.jsx";
import Avatar from "@components/Avatar.jsx";
import { getBadgeClasses } from "@helpers/badges.js";
import AlertModal from "@components/AlertModal.jsx";
import useObjectiveApproval from "@modules/approvals/objective/hooks/useObjectiveApproval.js";

const ObjectiveApprovalList = () => {
    const dataTableRef = useRef();
    const {
        selectedId,
        actionType,
        isModalOpen,
        isSubmitting,
        getModalType,
        getModalTitle,
        getModalMessage,
        getModalButtonText,
        handleActionClick,
        handleSubmit,
        setIsModalOpen,
    } = useObjectiveApproval(() => {
        dataTableRef.current?.refetch();
    });

    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleActionClick(row.original.id, "approved")}
                        className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-emerald-500 hover:bg-emerald-600"
                        title="Approve Objective"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => handleActionClick(row.original.id, "rejected")}
                        className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-rose-500 hover:bg-rose-600"
                        title="Reject Objective"
                    >
                        Reject
                    </button>
                </div>
            ),
        },
        {
            Header: "Submitter",
            accessor: "objective.user",
            Cell: ({ value }) => (
                <div className="flex items-center">
                    <Avatar
                        avatar={value?.avatar || null}
                        full_name={value?.full_name || "N/A"}
                        size="md"
                        parentClasses="dark:text-gray-200 dark:bg-bodybg"
                    />
                    <div className="ms-2">
                        <p className="font-semibold mb-0">{value?.full_name || "N/A"}</p>
                        <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                            {value?.email || "N/A"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            Header: "Year",
            accessor: "objective.year",
            Cell: ({ row }) => {
                const year = row.original.objective.year;
                const slug = row.original.objective.slug;
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
            Header: "Status",
            accessor: "objective.status",
            Cell: ({ value }) => toTitleCase(value),
            getCellProps: (cellInfo) => ({
                className: `${getBadgeClasses(cellInfo.value, "", false)}`,
            }),
        },
        {
            Header: "Submitted At",
            accessor: "objective.submitted_at",
            Cell: ({ value }) => formatDate(value),
        },
        {
            Header: "Created At",
            accessor: "created_at",
            Cell: ({ value }) => formatDate(value),
        },
        {
            Header: "Weightage",
            accessor: "total_weightage",
            excelColumnType: "number",
            Cell: ({ row }) => (
                <ProgressBar value={row.original.total_weightage} withStatus={false} />
            ),
        },
        {
            Header: "Total KRAs",
            accessor: "total_kras",
        },
    ];

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
                apiUrl="/hrms/objectives/que/approvals/"
                needHeader={false}
                enableAdvancedFilters={false}
            />

            {selectedId && (
                <AlertModal
                    id="objective-approval"
                    isOpen={isModalOpen}
                    type={getModalType(actionType)}
                    title={getModalTitle(actionType)}
                    message={getModalMessage(actionType)}
                    btnTxt={getModalButtonText(actionType)}
                    isSubmitting={isSubmitting}
                    needInput={true}
                    inputLabel="Remarks"
                    onConfirm={handleSubmit}
                    onClose={setIsModalOpen}
                />
            )}
        </>
    );
};

export default ObjectiveApprovalList;
