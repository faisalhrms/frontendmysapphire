// src/modules/requisition/views/RequisitionMyPendingFeedbackList.jsx
import React, { useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import DataTable from "@components/datatable/DataTable.jsx";
import Avatar from "@components/Avatar.jsx";
import Notify from "@helpers/toastNotifications.js";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import {Eye, ClipboardCheck, Sparkles, BadgeCheck, XCircle, MessagesSquare} from "lucide-react";

import RequisitionInterviewCompleteWrapper from "../models/components/RequisitionInterviewCompleteWrapper.jsx";
import IconPageHeader from "../../layouts/includes/IconPageHeader.jsx";

// ✅ best-effort: try to resolve logged in user id from common storage keys
const tryGetCurrentUserId = () => {
    try {
        const candidates = ["user", "auth_user", "profile", "current_user", "me", "user_info"];
        for (const k of candidates) {
            const raw = localStorage.getItem(k);
            if (!raw) continue;

            if (/^\d+$/.test(raw)) return Number(raw);

            let obj = null;
            try {
                obj = JSON.parse(raw);
            } catch {
                obj = null;
            }

            const id =
                obj?.id ??
                obj?.user?.id ??
                obj?.data?.id ??
                obj?.data?.user?.id ??
                obj?.employee?.user_id ??
                obj?.employee?.user?.id;

            if (id) return Number(id);
        }
    } catch {
        // ignore
    }
    return null;
};

const formatRound = (value) => {
    if (!value) return "—";
    const v = String(value).toLowerCase();
    const m = v.match(/^round_(\d+)$/);
    if (m) return `Round ${m[1]}`;
    return toTitleCase(String(value).replaceAll("_", " "));
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

// ✅ compact inline panel
const renderPanelCell = (panel, interview) => {
    const list = Array.isArray(panel) ? panel : [];
    if (!list.length) return "—";

    const total = typeof interview?.total_interviewers === "number" ? interview.total_interviewers : list.length;
    const pending =
        typeof interview?.pending_feedback_count === "number"
            ? interview.pending_feedback_count
            : list.filter((p) => String(p?.status || "pending").toLowerCase() !== "submitted").length;

    const allDone =
        typeof interview?.all_feedback_submitted === "boolean"
            ? interview.all_feedback_submitted
            : total > 0 && pending === 0;

    const topBadgeCls = allDone ? "bg-success/10 text-success" : "bg-warning/10 text-warning";
    const topBadgeText = allDone ? "ALL SUBMITTED" : "IN PROGRESS";

    const maxAvatars = 5;
    const shown = list.slice(0, maxAvatars);
    const extra = list.length - shown.length;

    return (
        <div className="flex items-center justify-between gap-3 w-full">
            <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold">
                        Panel: {total} • Pending: {pending}
                    </span>
                    <span className={`badge !rounded-full ${topBadgeCls}`}>{topBadgeText}</span>
                </div>
            </div>

            <div className="flex items-center shrink-0">
                <div className="flex -space-x-2">
                    {shown.map((p, idx) => {
                        const u = p?.interviewer || null;
                        const name = u?.full_name || "—";
                        const st = String(p?.status || "pending").toLowerCase();
                        const ringCls =
                            st === "submitted"
                                ? "ring-success/40"
                                : st === "pending"
                                    ? "ring-warning/40"
                                    : "ring-gray-200";

                        return (
                            <div
                                key={`${p?.interviewer_id || idx}`}
                                className={`rounded-full ring-2 ${ringCls} dark:ring-white/10`}
                                title={`${name} • ${st.toUpperCase()}`}
                            >
                                <Avatar
                                    avatar={u?.avatar || null}
                                    full_name={name}
                                    size="sm"
                                    parentClasses="bg-primary/10 !fill-primary"
                                />
                            </div>
                        );
                    })}
                </div>

                {extra > 0 && <span className="ms-2 text-xs font-semibold text-[#8c9097] dark:text-white/50">+{extra}</span>}
            </div>
        </div>
    );
};

export default function RequisitionMyPendingFeedbackList() {
    const [refreshKey, setRefreshKey] = useState(0);

    // ✅ Prefer redux user id if available, fallback to localStorage
    const authUser = useSelector((state) => state?.auth?.user);
    const myUserId = useMemo(() => authUser?.id ?? tryGetCurrentUserId(), [authUser?.id]);

    // ✅ Complete modal state
    const [isCompleteOpen, setIsCompleteOpen] = useState(false);
    const [selectedRequisitionId, setSelectedRequisitionId] = useState(null);
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);

    const openFeedbackModal = (requisitionId, applicationId, interview) => {
        setSelectedRequisitionId(requisitionId);
        setSelectedApplicationId(applicationId);
        setSelectedInterview(interview || null);
        setIsCompleteOpen(true);
    };

    const closeModal = () => {
        setIsCompleteOpen(false);
        setSelectedRequisitionId(null);
        setSelectedApplicationId(null);
        setSelectedInterview(null);
    };

    const isInterviewTimePassed = (interview) => {
        const raw = interview?.scheduled_at;
        if (!raw) return false;
        const t = new Date(raw).getTime();
        if (Number.isNaN(t)) return false;
        return t <= Date.now();
    };

    const getMyPanelMember = (interview) => {
        if (!interview || !myUserId) return null;
        const panel = Array.isArray(interview?.panel) ? interview.panel : [];
        return (
            panel.find((p) => {
                const pid = p?.interviewer_id ?? p?.interviewer?.id;
                return pid != null && Number(pid) === Number(myUserId);
            }) || null
        );
    };

    const getFeedbackAvailability = useCallback(
        (interview) => {
            if (!interview?.id) return { ok: false, reason: "No interview found" };
            if (!myUserId) return { ok: false, reason: "Cannot detect current user" };

            const status = String(interview?.status || "").toLowerCase();
            if (status === "cancelled") return { ok: false, reason: "Interview is cancelled" };

            if (interview?.all_feedback_submitted === true) {
                return { ok: false, reason: "All feedback already submitted" };
            }

            const me = getMyPanelMember(interview);
            if (!me) return { ok: false, reason: "You are not in the interview panel" };

            const myStatus = String(me?.status || "").toLowerCase();
            if (myStatus === "submitted") return { ok: false, reason: "Feedback already submitted" };

            if (!isInterviewTimePassed(interview)) {
                return { ok: false, reason: "Feedback is allowed after interview time" };
            }

            return { ok: true, reason: "Submit feedback" };
        },
        [myUserId]
    );

    const columns = useMemo(
        () => [
            {
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    const r = row?.original || {};
                    const requisitionId = r?.requisition_id;
                    const appId = r?.id;
                    const interview = r?.next_interview || null;

                    const availability = getFeedbackAvailability(interview);
                    const disableFeedback = !availability.ok;

                    const feedbackBtnCls = disableFeedback
                        ? "ti-btn ti-btn-light ti-btn-sm !opacity-60 !cursor-not-allowed grayscale blur-[0.4px]"
                        : "ti-btn ti-btn-success ti-btn-sm";

                    return (
                        <div className="flex justify-center gap-2">
                            <Link to={`/module/requisition/${requisitionId}/applicants/${appId}`}>
                                <button className="ti-btn ti-btn-secondary ti-btn-sm" title="View Applicant">
                                    <span className="inline-flex items-center gap-1">
                                        <Eye size={16} />
                                    </span>
                                </button>
                            </Link>

                            <button
                                type="button"
                                className={feedbackBtnCls}
                                title={availability.reason}
                                disabled={disableFeedback}
                                onClick={() => {
                                    if (disableFeedback) return;
                                    openFeedbackModal(requisitionId, appId, interview);
                                }}
                            >
                                <span className="inline-flex items-center gap-1">
                                    <ClipboardCheck size={16} />
                                </span>
                            </button>
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
                Header: "Interview At",
                id: "next_interview_scheduled_at",
                accessor: (r) => r?.next_interview?.scheduled_at || null,
                filterable: false,
                Cell: ({ value }) => (value ? new Date(value).toLocaleString() : "—"),
            },
            {
                Header: "Round",
                id: "next_interview_round",
                accessor: (r) => r?.next_interview?.round || "",
                filterable: false,
                Cell: ({ value }) => formatRound(value),
            },
            {
                Header: "Type",
                id: "next_interview_type",
                accessor: (r) => r?.next_interview?.interview_type || "",
                filterable: false,
                Cell: ({ value }) => (value ? toTitleCase(value) : "—"),
            },

            {
                Header: "Panel",
                id: "next_interview_panel",
                accessor: (r) => r?.next_interview?.panel || [],
                filterable: false,
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ row, value }) => {
                    const interview = row?.original?.next_interview || null;
                    return renderPanelCell(value, interview);
                },
            },

            {
                Header: "Scheduled By",
                id: "next_interview_scheduled_by",
                accessor: (r) => r?.next_interview?.scheduled_by || null,
                filterable: false,
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => renderUserCell(value),
            },

            {
                Header: "Interview Status",
                id: "next_interview_status",
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
                    };
                    return {
                        className: `${cls || `badge !rounded-full ${fallback[v] || "bg-light text-default"}`} !text-center`,
                    };
                },
            },

            {
                Header: "Location / Link",
                id: "next_interview_link",
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
                    const fallback = { interview_scheduled: "bg-primary/10 text-primary" };
                    const v = cellInfo.value;
                    const cls = getBadgeClasses?.(v, "", false);
                    return {
                        className: `${cls || `badge !rounded-full ${fallback[v] || "bg-light text-default"}`} !text-center`,
                    };
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
                Header: "AI Recommended",
                accessor: "ai_shortlisted",
                filterType: "boolean",
                filterable: true,
                Cell: ({ value }) =>
                    value ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
                            <Sparkles size={14} /> AI Recommended <BadgeCheck size={14} />
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-light text-default">
                            <XCircle size={14} /> Not Recommended
                        </span>
                    ),
            },
            {
                Header: "Resume",
                accessor: "resume_file_url",
                disableSortBy: true,
                filterable: false,
                Cell: ({ value }) =>
                    value ? (
                        <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                            View
                        </a>
                    ) : (
                        "—"
                    ),
            },
            {
                Header: "Applied At",
                accessor: "created_at",
                filterType: "datetime",
                filterable: true,
            },
        ],
        [getFeedbackAvailability]
    );

    return (
        <>
            <IconPageHeader
                heading="Pending Interview Feedback"
                description="Review assigned applicants and submit your pending interview feedback."
                icon={MessagesSquare}
            />
            <DataTable
                key={refreshKey}
                columns={columns}
                needHeader={false}
                apiUrl={`/requisitions/applicants/my-pending-feedback/datatable/`}
                enableAdvancedFilters={true}
            />

            <RequisitionInterviewCompleteWrapper
                requisitionId={selectedRequisitionId}
                applicationId={selectedApplicationId}
                interviewData={selectedInterview}
                isOpen={isCompleteOpen}
                onClose={closeModal}
                onSuccess={() => {
                    closeModal();
                    Notify.success("Feedback submitted.");
                    setRefreshKey((k) => k + 1);
                }}
            />
        </>
    );
}
