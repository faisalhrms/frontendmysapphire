import React, {useMemo, useRef} from "react";
import { CalendarRange, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";
import { getBadgeClasses } from "@helpers/badges.js";
import AlertModal from "@components/AlertModal.jsx";
import useObjectiveApproval from "@modules/approvals/objective/hooks/useObjectiveApproval.js";
import {FORMS_ROUTES} from "@modules/forms/routes.js";
import {APPROVAL_ROUTES as PPROVAL_ROUTES, APPROVAL_ROUTES} from "@modules/approvals/routes.js";

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
                            to={`/module/ess/objectives/detail/${slug}`}
                            className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-primary hover:bg-primary"
                            title="view Objective"
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
    const buttons = useMemo(() => (
        <div className="flex space-x-2">
            <Link
                to={PPROVAL_ROUTES.DYNAMICEFORMBUILDER.path}
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                title="Add Form"
            >
                <i className="ri-add-line font-semibold align-middle"></i>
            </Link>
        </div>
    ), []);


    return (
        <>
            <IconPageHeader
                heading="Objectives Approvals"
                description="Review, approve, or reject objectives to ensure alignment with organizational goals."
                icon={CalendarRange}
            />

            <DataTable
                ref={dataTableRef}
                columns={columns}
                apiUrl="/hrms/objectives/que/approvals/"
                needHeader={false}
                enableAdvancedFilters={false}
                buttons={buttons}
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
