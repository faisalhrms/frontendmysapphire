import React, {useMemo, useRef} from "react";
import {FileCheck2} from "lucide-react";
import { Link } from "react-router-dom";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";
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
            Cell: ({ row }) => {
                const slug = row.original.objective.slug;
                return (
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
                        <Link
                            to={`/module/forms/edit/${row.original.id}`}
                            className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-primary hover:bg-primary"
                            title="Edit Form"
                        >
                            View
                        </Link>
                    </div>
                )
            },
        },
        {
            Header: "Form",
            accessor: "form",
        },
        {
            Header: "Submitter",
            accessor: "objective.user",
            Cell: ({ value }) => (
                <div className="flex items-center gap-2">
                    {value?.avatar && (
                        <img
                            src={value.avatar}
                            alt={value.full_name}
                            className="w-6 h-6 rounded-full"
                        />
                    )}
                    <span>{value?.full_name}</span>
                </div>
            ),
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
    ];



    return (
        <>
            <IconPageHeader
                heading="Dynamic Forms Approval"
                description="Manage and streamline multi-level form approval workflows with ease."
                icon={FileCheck2}
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
