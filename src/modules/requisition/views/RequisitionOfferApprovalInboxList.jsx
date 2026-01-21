// src/modules/requisition/views/RequisitionOfferApprovalInboxList.jsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import DataTable from "@components/datatable/DataTable.jsx";
import Avatar from "@components/Avatar.jsx";
import api from "@config/axiosConfig.js";
import AlertModal from "../../../components/AlertModal.jsx";

import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";

import IconPageHeader from "../../layouts/includes/IconPageHeader.jsx";
import { BadgeCheck } from "lucide-react";

const renderUserCell = (userObj) => {
    if (!userObj) return "—";
    return (
        <div className="flex items-center">
            <Avatar
                avatar={userObj.avatar || null}
                full_name={userObj.full_name || "—"}
                size="sm"
                parentClasses="bg-primary/10 !fill-primary"
            />
            <div className="ms-2 leading-tight">
                <p className="font-semibold mb-0">{userObj.full_name || "—"}</p>
                <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">{userObj.email || "—"}</p>
            </div>
        </div>
    );
};

const truncate = (s, n = 70) => {
    if (!s) return "—";
    const str = String(s);
    return str.length > n ? `${str.slice(0, n)}…` : str;
};

export default function RequisitionOfferApprovalInboxList() {
    const tableRef = useRef(null);

    // ✅ modal state (same pattern as RequisitionApprovalInbox)
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null); // "offer-approve" | "offer-reject"
    const [activeRow, setActiveRow] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const refreshTable = useCallback(() => {
        const ref = tableRef.current;

        if (ref?.reload) return ref.reload();
        if (ref?.refresh) return ref.refresh();
        if (ref?.fetchData) return ref.fetchData();
        if (ref?.refetch) return ref.refetch();

        window.location.reload();
    }, []);

    const openApproveModal = useCallback((row) => {
        setActiveRow(row);
        setModalAction("offer-approve");
        setModalOpen(true);
    }, []);

    const openRejectModal = useCallback((row) => {
        setActiveRow(row);
        setModalAction("offer-reject");
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setModalAction(null);
        setActiveRow(null);
    }, []);

    const onConfirm = useCallback(
        async (remarks) => {
            const reqId = activeRow?.requisition?.id;
            const appId = activeRow?.id;

            if (!reqId || !appId || !modalAction) return;

            setSubmitting(true);
            try {
                // ✅ endpoints exactly as you shared
                await api.post(`/requisition/${reqId}/applicants/${appId}/${modalAction}/`, {
                    remarks: remarks || "",
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
        },
        [activeRow, modalAction, closeModal, refreshTable]
    );

    const columns = useMemo(
        () => [
            {
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                width: 320,
                Cell: ({ row }) => {
                    const r = row?.original || {};
                    const appId = r?.id;
                    const reqId = r?.requisition?.id;

                    const disableOfferActions = !reqId || !appId || submitting;

                    return (
                        <div className="flex gap-2">
                            {/* ✅ Approve / Reject (NO icons, like your approval inbox) */}
                            <button
                                onClick={() => openApproveModal(r)}
                                className={`px-3 py-1 text-xs font-semibold text-white rounded-full bg-emerald-500 hover:bg-emerald-600 ${
                                    disableOfferActions ? "!opacity-60 !cursor-not-allowed" : ""
                                }`}
                                title="Approve Offer"
                                type="button"
                                disabled={disableOfferActions}
                            >
                                Approve
                            </button>

                            <button
                                onClick={() => openRejectModal(r)}
                                className={`px-3 py-1 text-xs font-semibold text-white rounded-full bg-rose-500 hover:bg-rose-600 ${
                                    disableOfferActions ? "!opacity-60 !cursor-not-allowed" : ""
                                }`}
                                title="Reject Offer"
                                type="button"
                                disabled={disableOfferActions}
                            >
                                Reject
                            </button>

                            {/* ✅ View Applicant */}
                            {reqId && appId ? (
                                <Link
                                    to={`/module/requisition/${reqId}/applicants/${appId}`}
                                    className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-primary hover:bg-primary"
                                    title="View Applicant"
                                >
                                    View
                                </Link>
                            ) : (
                                <button
                                    className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-gray-400 !opacity-60 !cursor-not-allowed"
                                    disabled
                                    title="Missing IDs"
                                    type="button"
                                >
                                    View
                                </button>
                            )}

                            {/* Optional: Decision Summary */}
                            {reqId && appId ? (
                                <Link
                                    to={`/module/requisition/${reqId}/applicants/${appId}/decision-summary`}
                                    className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-indigo-500 hover:bg-indigo-600"
                                    title="Decision Summary"
                                >
                                    Summary
                                </Link>
                            ) : null}
                        </div>
                    );
                },
            },

            {
                Header: "Applicant",
                accessor: "full_name",
                filterType: "text",
                filterable: true,
                filterKey: "first_name",
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ row }) => {
                    const r = row?.original || {};
                    const full = r.full_name || [r.first_name, r.last_name].filter(Boolean).join(" ") || "N/A";
                    return (
                        <div className="flex items-center">
                            <Avatar
                                avatar={r.avatar ? r.avatar : null}
                                full_name={full}
                                size="md"
                                parentClasses="bg-primary/10 !fill-primary"
                            />
                            <div className="ms-2">
                                <p className="font-semibold mb-0 flex items-center">{full}</p>
                                <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">{r.email || "—"}</p>
                            </div>
                        </div>
                    );
                },
            },

            { Header: "Mobile", accessor: "mobile_number", filterType: "text", filterable: true },
            { Header: "CNIC", accessor: "cnic_number", filterType: "text", filterable: true },

            {
                Header: "Requisition",
                id: "requisition_meta",
                accessor: (r) => r?.requisition || null,
                filterable: false,
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => {
                    const rq = value;
                    if (!rq) return "—";
                    const deptName = rq?.department?.name || "—";
                    return (
                        <div className="leading-tight">
                            <p className="font-semibold mb-0">
                                {rq.req_no || "—"}{" "}
                                <span className="text-[#8c9097] dark:text-white/50 font-normal">
                                    • {rq.title || "—"}
                                </span>
                            </p>
                            <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                Dept: {deptName}
                            </p>
                        </div>
                    );
                },
            },

            {
                Header: "Selected By",
                id: "selected_by",
                accessor: (r) => r?.selected_by || null,
                filterable: false,
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => renderUserCell(value),
            },

            {
                Header: "Selected At",
                id: "selected_at",
                accessor: (r) => r?.selected_at || null,
                filterable: false,
                Cell: ({ value }) => (value ? new Date(value).toLocaleString() : "—"),
            },

            {
                Header: "Remarks",
                id: "selected_remarks",
                accessor: (r) => r?.selected_remarks || "",
                filterable: false,
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => <span title={value || ""}>{truncate(value, 70)}</span>,
            },

            {
                Header: "Status",
                accessor: "status",
                filterable: false,
                headerClassName: "!text-center",
                Cell: ({ value }) => (
                    <span className="inline-flex items-center gap-1">
                        <BadgeCheck size={14} />
                        {value ? toTitleCase(String(value).replaceAll("_", " ")) : "—"}
                    </span>
                ),
                getCellProps: (cellInfo) => {
                    const v = cellInfo.value;
                    const cls = getBadgeClasses?.(v, "", false);
                    return {
                        className: `${cls || "badge !rounded-full bg-primary/10 text-primary"} !text-center`,
                    };
                },
            },

            {
                Header: "Rating",
                accessor: "rating",
                filterType: "text",
                filterable: true,
                Cell: ({ value }) => (value ?? value === 0 ? Number(value).toFixed(2) : "—"),
            },

            {
                Header: "AI Score",
                accessor: "ai_score",
                filterType: "text",
                filterable: true,
                Cell: ({ value }) => (value ?? value === 0 ? `${Number(value).toFixed(2)}%` : "—"),
            },
        ],
        [openApproveModal, openRejectModal, submitting]
    );

    const modalTitle = modalAction === "offer-approve" ? "Approve Offer" : "Reject Offer";
    const modalBtn = modalAction === "offer-approve" ? "Approve" : "Reject";
    const modalType = modalAction === "offer-approve" ? "success" : "danger";

    const candidateName =
        activeRow?.full_name ||
        [activeRow?.first_name, activeRow?.last_name].filter(Boolean).join(" ") ||
        "this candidate";

    const modalMessage =
        modalAction === "offer-approve"
            ? `Are you sure you want to APPROVE the offer for ${candidateName}?`
            : `Are you sure you want to REJECT the offer for ${candidateName}?`;

    return (
        <>
            <IconPageHeader
                heading="Offer Approval Inbox"
                description="Applications awaiting offer approval (assigned to you)."
                icon={BadgeCheck}
            />

            <DataTable
                ref={tableRef}
                columns={columns}
                needHeader={false}
                enableAdvancedFilters={true}
                apiUrl={`/requisition/applicants/offer-approval-inbox/datatable/`}
            />

            <AlertModal
                id="offer-approval-inbox-action"
                type={modalType}
                title={modalTitle}
                message={modalMessage}
                btnTxt={modalBtn}
                isOpen={modalOpen}
                needInput={true}
                inputLabel="Remarks"
                inputType="textarea"
                isSubmitting={submitting}
                onConfirm={onConfirm}
                onClose={closeModal}
            />
        </>
    );
}
