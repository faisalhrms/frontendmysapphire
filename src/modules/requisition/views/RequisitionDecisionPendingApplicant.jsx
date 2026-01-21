// src/modules/requisition/views/RequisitionDecisionPendingApplicant.jsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import DataTable from "@components/datatable/DataTable.jsx";
import Avatar from "@components/Avatar.jsx";
import api from "@config/axiosConfig.js";
import AlertModal from "../../../components/AlertModal.jsx";

import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";

// ✅ Handshake removed, Decision icons added
import { History, Star, FileText, Check, X, Pause } from "lucide-react";

const RequisitionDecisionPendingApplicant = ({ requisitionId, isActive }) => {
    const navigate = useNavigate();
    const tableRef = useRef(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // ✅ Decision Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalDecision, setModalDecision] = useState(null); // "select" | "reject" | "on_hold"
    const [activeRow, setActiveRow] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const refreshTable = useCallback(() => {
        const ref = tableRef.current;

        if (ref?.reload) return ref.reload();
        if (ref?.refresh) return ref.refresh();
        if (ref?.fetchData) return ref.fetchData();
        if (ref?.refetch) return ref.refetch();

        setRefreshKey((k) => k + 1);
    }, []);

    const openDecisionModal = useCallback((row, decision) => {
        setActiveRow(row);
        setModalDecision(decision);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setModalDecision(null);
        setActiveRow(null);
    }, []);

    const onConfirm = useCallback(
        async (remarks) => {
            if (!activeRow?.id || !modalDecision) return;

            setSubmitting(true);
            try {
                await api.post(`/requisition/${requisitionId}/applicants/${activeRow.id}/decision/`, {
                    decision: modalDecision,
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
        [activeRow?.id, modalDecision, requisitionId, closeModal, refreshTable]
    );

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
                    <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                        {userObj.email || "—"}
                    </p>
                </div>
            </div>
        );
    };

    const renderInterviewLink = (value) => {
        if (!value) return "—";
        const match = String(value).match(/https?:\/\/\S+/i);
        const url = match?.[0];
        if (url) {
            return (
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    Open Link
                </a>
            );
        }
        return (
            <span title={value} className="truncate inline-block max-w-[240px] align-middle">
                {value}
            </span>
        );
    };

    const modalTitle =
        modalDecision === "select"
            ? "Select Candidate"
            : modalDecision === "reject"
                ? "Reject Candidate"
                : "Put Candidate On Hold";

    const modalBtn =
        modalDecision === "select" ? "Select" : modalDecision === "reject" ? "Reject" : "On Hold";

    const modalType =
        modalDecision === "reject" ? "danger" : modalDecision === "on_hold" ? "warning" : "success";

    const candidateName =
        activeRow?.full_name ||
        [activeRow?.first_name, activeRow?.last_name].filter(Boolean).join(" ") ||
        "this candidate";

    const modalMessage =
        modalDecision === "select"
            ? `Are you sure you want to SELECT ${candidateName}? This will move the candidate to Offer Approval flow.`
            : modalDecision === "reject"
                ? `Are you sure you want to REJECT ${candidateName}?`
                : `Are you sure you want to put ${candidateName} ON HOLD?`;

    const columns = useMemo(
        () => [
            {
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    const appId = row?.original?.id;

                    return (
                        <div className="flex justify-center gap-2">
                            <Link to={`/module/requisition/${requisitionId}/applicants/${appId}`}>
                                <button className="ti-btn ti-btn-secondary ti-btn-sm" title="View Applicant">
                                    <i className="ri-eye-line" />
                                </button>
                            </Link>

                            {/* ✅ Decision Summary */}
                            <button
                                type="button"
                                className="ti-btn ti-btn-primary ti-btn-sm"
                                title="Decision Summary"
                                onClick={() =>
                                    navigate(`/module/requisition/${requisitionId}/applicants/${appId}/decision-summary`)
                                }
                            >
                                <span className="inline-flex items-center gap-1">
                                    <FileText size={16} />
                                </span>
                            </button>

                            {/* Interview History */}
                            <button
                                type="button"
                                className="ti-btn ti-btn-light ti-btn-sm"
                                title="Interview History"
                                onClick={() =>
                                    navigate(`/module/requisition/${requisitionId}/applicants/${appId}/interviews`)
                                }
                            >
                                <span className="inline-flex items-center gap-1">
                                    <History size={16} />
                                </span>
                            </button>

                            {/* ❌ Handshake / Offer Section REMOVED */}
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
            { Header: "City", accessor: "city", filterType: "text", filterable: true },

            {
                Header: "Last Interview At",
                id: "last_interview_scheduled_at",
                accessor: (r) => r?.next_interview?.scheduled_at || null,
                filterable: false,
                Cell: ({ value }) => (value ? new Date(value).toLocaleString() : "—"),
            },
            {
                Header: "Last Round",
                id: "last_interview_round",
                accessor: (r) => r?.next_interview?.round || "",
                filterable: false,
                Cell: ({ value }) => (value ? toTitleCase(value.replaceAll("_", " ")) : "—"),
            },
            {
                Header: "Type",
                id: "last_interview_type",
                accessor: (r) => r?.next_interview?.interview_type || "",
                filterable: false,
                Cell: ({ value }) => (value ? toTitleCase(value) : "—"),
            },

            {
                Header: "Rating",
                accessor: "rating",
                filterType: "text",
                filterable: true,
                Cell: ({ value }) => {
                    if (value === null || value === undefined) return "—";

                    const rating = Math.max(0, Math.min(5, Number(value) || 0));
                    const full = Math.floor(rating);
                    const hasHalf = rating - full >= 0.5;

                    return (
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((i) => {
                                    const filled = i <= full;
                                    const half = !filled && hasHalf && i === full + 1;

                                    return (
                                        <span key={i} className="relative inline-flex">
                                            <Star size={16} className="text-gray-300" />
                                            {(filled || half) && (
                                                <Star
                                                    size={16}
                                                    className="absolute left-0 top-0 text-warning"
                                                    fill="currentColor"
                                                    style={{
                                                        clipPath: half
                                                            ? "polygon(0 0, 50% 0, 50% 100%, 0 100%)"
                                                            : "none",
                                                    }}
                                                />
                                            )}
                                        </span>
                                    );
                                })}
                            </div>

                            <span className="text-xs font-semibold text-[#8c9097] dark:text-white/50">
                                {rating.toFixed(2)}
                            </span>
                        </div>
                    );
                },
            },

            {
                Header: "Scheduled By",
                id: "last_interview_scheduled_by",
                accessor: (r) => r?.next_interview?.scheduled_by || null,
                filterable: false,
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => renderUserCell(value),
            },
            {
                Header: "Interview Status",
                id: "last_interview_status",
                accessor: (r) => r?.next_interview?.status || "",
                filterable: false,
                headerClassName: "!text-center",
                Cell: ({ value }) => (value ? toTitleCase(value.replaceAll("_", " ")) : "—"),
                getCellProps: (cellInfo) => {
                    const v = cellInfo.value;
                    const cls = getBadgeClasses?.(v, "", false);
                    const fallback = {
                        scheduled: "bg-primary/10 text-primary",
                        rescheduled: "bg-warning/10 text-warning",
                        cancelled: "bg-danger/10 text-danger",
                        completed: "bg-success/10 text-success",
                        no_show: "bg-gray-200 text-gray-700",
                    };
                    return {
                        className: `${cls || `badge !rounded-full ${fallback[v] || "bg-light text-default"}`} !text-center`,
                    };
                },
            },
            {
                Header: "Location / Link",
                id: "last_interview_link",
                accessor: (r) => r?.next_interview?.link_or_location || "",
                filterable: false,
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => renderInterviewLink(value),
            },

            {
                Header: "Applicant Status",
                accessor: "status",
                filterable: false,
                headerClassName: "!text-center",
                Cell: ({ cell }) => toTitleCase(cell.value || ""),
                getCellProps: (cellInfo) => {
                    const v = cellInfo.value;
                    const cls = getBadgeClasses?.(v, "", false);
                    return { className: `${cls || "badge !rounded-full bg-light text-default"} !text-center` };
                },
            },

            {
                Header: "AI Score",
                accessor: "ai_score",
                filterType: "text",
                filterable: true,
                Cell: ({ value }) => (value ?? value === 0 ? `${Number(value).toFixed(2)}%` : "—"),
            },

            {
                Header: "Applied At",
                accessor: "created_at",
                filterType: "datetime",
                filterable: true,
            },

            // ✅ Decision column at the end (icon buttons + wrap so no overlap)
            {
                Header: "Decision",
                id: "decision_actions",
                accessor: (r) => r?.id,
                disableSortBy: true,
                filterable: false,
                headerClassName: "!text-center",
                getCellProps: () => ({ className: "!text-center" }),
                Cell: ({ row }) => {
                    const r = row?.original || {};
                    return (
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <button
                                type="button"
                                className="ti-btn ti-btn-success ti-btn-sm !px-2 !py-1"
                                title="Select"
                                onClick={() => openDecisionModal(r, "select")}
                                disabled={submitting}
                            >
                                <Check size={16} />
                            </button>

                            <button
                                type="button"
                                className="ti-btn ti-btn-danger ti-btn-sm !px-2 !py-1"
                                title="Reject"
                                onClick={() => openDecisionModal(r, "reject")}
                                disabled={submitting}
                            >
                                <X size={16} />
                            </button>

                            <button
                                type="button"
                                className="ti-btn ti-btn-warning ti-btn-sm !px-2 !py-1"
                                title="On Hold"
                                onClick={() => openDecisionModal(r, "on_hold")}
                                disabled={submitting}
                            >
                                <Pause size={16} />
                            </button>
                        </div>
                    );
                },
            },
        ],
        [requisitionId, navigate, openDecisionModal, submitting]
    );

    if (!isActive) return null;

    return (
        <>
            <DataTable
                ref={tableRef}
                key={refreshKey}
                columns={columns}
                title="Decision Pending Applicants"
                apiUrl={`/requisitions/${requisitionId}/applicants/decision-pending/datatable`}
                enableAdvancedFilters={true}
            />

            <AlertModal
                id="requisition-decision-action"
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
};

export default RequisitionDecisionPendingApplicant;
