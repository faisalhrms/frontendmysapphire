import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import DataTable from "@components/datatable/DataTable.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import api from "@config/axiosConfig.js";

import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";
import AlertModal from "../../../components/AlertModal.jsx";

// ✅ renders nothing (so no icon shows)
const EmptyIcon = () => null;

const RequisitionApprovalInbox = () => {
    const tableRef = useRef(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null); // "approve" | "reject"
    const [activeRow, setActiveRow] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const refreshTable = () => {
        const ref = tableRef.current;

        if (ref?.reload) return ref.reload();
        if (ref?.refresh) return ref.refresh();
        if (ref?.fetchData) return ref.fetchData();
        if (ref?.refetch) return ref.refetch();

        window.location.reload();
    };

    const openApproveModal = (row) => {
        setActiveRow(row);
        setModalAction("approve");
        setModalOpen(true);
    };

    const openRejectModal = (row) => {
        setActiveRow(row);
        setModalAction("reject");
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalAction(null);
        setActiveRow(null);
    };

    const onConfirm = async (comment) => {
        if (!activeRow?.id || !modalAction) return;

        setSubmitting(true);
        try {
            await api.post(`/requisition/${activeRow.id}/${modalAction}/`, {
                comment: comment || "",
            });

            closeModal();
            refreshTable();
        } catch (e) {
            const msg =
                e?.response?.data?.message ||
                e?.response?.data?.detail ||
                e?.message ||
                "Something went wrong";
            alert(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                width: 260,
                Cell: ({ row }) => {
                    const r = row.original;

                    return (
                        <div className="flex gap-2">
                            <button
                                onClick={() => openApproveModal(r)}
                                className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-emerald-500 hover:bg-emerald-600"
                                title="Approve"
                                type="button"
                            >
                                Approve
                            </button>

                            <button
                                onClick={() => openRejectModal(r)}
                                className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-rose-500 hover:bg-rose-600"
                                title="Reject"
                                type="button"
                            >
                                Reject
                            </button>

                            <Link
                                to={`/module/requisition/detail/${r.id}`}
                                className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-primary hover:bg-primary"
                                title="View"
                            >
                                View
                            </Link>
                        </div>
                    );
                },
            },
            {
                Header: "Req No",
                accessor: "req_no",
                filterable: true,
                filterType: "text",
                filterKey: "req_no",
                Cell: ({ value }) => value || "—",
            },
            {
                Header: "Title",
                accessor: "job_description.position_title",
                filterable: true,
                filterType: "text",
                filterKey: "job_description__position_title",
                Cell: ({ row }) => row.original.job_description?.position_title || "—",
            },
            {
                Header: "Designation",
                accessor: "designation.name",
                filterable: true,
                filterType: "text",
                filterKey: "designation__name",
                Cell: ({ row }) => row.original.designation?.name || "—",
            },
            {
                Header: "Openings",
                accessor: "openings",
                filterable: true,
                filterType: "number",
                filterKey: "openings",
                Cell: ({ value }) => value ?? "—",
            },
            {
                Header: "Type",
                accessor: "req_type",
                filterable: true,
                filterType: "select",
                filterKey: "req_type",
                filterOptions: ["new", "replacement", "additional"].map((t) => ({
                    label: toTitleCase(t),
                    value: t,
                })),
                Cell: ({ value }) => toTitleCase(String(value || "").replaceAll("_", " ")),
            },
            {
                Header: "Budget",
                accessor: "budget_status",
                filterable: true,
                filterType: "select",
                filterKey: "budget_status",
                filterOptions: ["budgeted", "unbudgeted"].map((b) => ({
                    label: toTitleCase(b),
                    value: b,
                })),
                Cell: ({ value }) => toTitleCase(String(value || "")),
            },
            {
                Header: "Deadline",
                accessor: "application_deadline",
                filterable: true,
                filterType: "date",
                filterKey: "application_deadline",
                Cell: ({ value }) => (value ? formatDate(value) : "—"),
            },
            {
                Header: "Created On",
                accessor: "created_at",
                filterable: true,
                filterType: "date",
                filterKey: "created_at",
                Cell: ({ value }) => (value ? formatDate(value) : "—"),
            },
        ],
        []
    );

    const modalTitle = modalAction === "approve" ? "Approve Requisition" : "Reject Requisition";
    const modalBtn = modalAction === "approve" ? "Approve" : "Reject";
    const modalType = modalAction === "approve" ? "success" : "danger";

    const modalMessage =
        modalAction === "approve"
            ? `Are you sure you want to approve ${activeRow?.req_no || "this requisition"}?`
            : `Are you sure you want to reject ${activeRow?.req_no || "this requisition"}?`;

    return (
        <>
            <IconPageHeader
                heading="Requisition Approval Inbox"
                description="Approve or reject requisitions assigned to you."
                icon={EmptyIcon}
            />

            <DataTable
                ref={tableRef}
                columns={columns}
                title="Pending Requisitions"
                apiUrl={`/requisition/approval-inbox/datatable/`}
                enableAdvancedFilters={true}
                hiddenParameters={["tab", "inbox", "exclude_approved", "role"]}
            />

            <AlertModal
                id="requisition-approval-inbox-action"
                type={modalType}
                title={modalTitle}
                message={modalMessage}
                btnTxt={modalBtn}
                isOpen={modalOpen}
                needInput={true}
                inputLabel="Comments/Suggestions"
                inputType="textarea"
                isSubmitting={submitting}
                onConfirm={onConfirm}
                onClose={closeModal}
            />
        </>
    );
};

export default RequisitionApprovalInbox;
