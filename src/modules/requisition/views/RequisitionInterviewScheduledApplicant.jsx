import React, { useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DataTable from "@components/datatable/DataTable.jsx";
import Avatar from "@components/Avatar.jsx";
import Notify from "@helpers/toastNotifications.js";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import { Sparkles, BadgeCheck, XCircle, CalendarClock, ClipboardCheck, CalendarX } from "lucide-react";

import RequisitionInterviewFormWrapper from "../models/components/RequisitionInterviewFormWrapper.jsx";
import RequisitionInterviewCompleteWrapper from "../models/components/RequisitionInterviewCompleteWrapper.jsx";
import RequisitionInterviewCancelWrapper from "../models/components/RequisitionInterviewCancelWrapper.jsx";

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

const RequisitionInterviewScheduledApplicant = ({ requisitionId, isActive, currentUserId = null }) => {
    const [refreshKey, setRefreshKey] = useState(0);

    // ✅ Reschedule modal state
    const [isInterviewFormOpen, setIsInterviewFormOpen] = useState(false);
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);

    // ✅ Complete modal state
    const [isCompleteOpen, setIsCompleteOpen] = useState(false);

    // ✅ Cancel modal state
    const [isCancelOpen, setIsCancelOpen] = useState(false);

    // ✅ Prefer redux user id if available
    const authUser = useSelector((state) => state?.auth?.user);

    const myUserId = useMemo(() => {
        return currentUserId ?? authUser?.id ?? tryGetCurrentUserId();
    }, [currentUserId, authUser?.id]);

    const openRescheduleModal = (applicationId, interview) => {
        setSelectedApplicationId(applicationId);
        setSelectedInterview(interview || null);
        setIsInterviewFormOpen(true);
    };

    const openCompleteModal = (applicationId, interview) => {
        setSelectedApplicationId(applicationId);
        setSelectedInterview(interview || null);
        setIsCompleteOpen(true);
    };

    const openCancelModal = (applicationId, interview) => {
        setSelectedApplicationId(applicationId);
        setSelectedInterview(interview || null);
        setIsCancelOpen(true);
    };

    const closeAllModals = () => {
        setIsInterviewFormOpen(false);
        setIsCompleteOpen(false);
        setIsCancelOpen(false);
        setSelectedApplicationId(null);
        setSelectedInterview(null);
    };

    const updateOneStatus = useCallback(
        async (applicationId, status, successMsg, is_shortlisted = undefined) => {
            try {
                const api = (await import("../../../config/axiosConfig.js")).default;

                const payload = {
                    status,
                    application_ids: [applicationId],
                    ...(is_shortlisted !== undefined ? { is_shortlisted } : {}),
                };

                await api.patch(`/requisitions/${requisitionId}/applicants/status/bulk/`, payload);

                Notify.success(successMsg);
                setRefreshKey((k) => k + 1);
            } catch (e) {
                Notify.error(e?.response?.data?.message || e?.message || "Update failed.");
            }
        },
        [requisitionId]
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
                    <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">{userObj.email || "—"}</p>
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

    const formatRound = (value) => {
        if (!value) return "—";
        const v = String(value).toLowerCase();
        const m = v.match(/^round_(\d+)$/);
        if (m) return `Round ${m[1]}`;
        return toTitleCase(String(value).replaceAll("_", " "));
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

                    {extra > 0 && (
                        <span className="ms-2 text-xs font-semibold text-[#8c9097] dark:text-white/50">+{extra}</span>
                    )}
                </div>
            </div>
        );
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

    const isInterviewTimePassed = (interview) => {
        const raw = interview?.scheduled_at;
        if (!raw) return false;
        const t = new Date(raw).getTime();
        if (Number.isNaN(t)) return false;
        return t <= Date.now();
    };

    // ✅ lock reschedule/cancel if ANY feedback submitted by ANY panel member
    const hasAnyFeedbackStarted = (interview) => {
        const panel = Array.isArray(interview?.panel) ? interview.panel : [];
        return panel.some((p) => String(p?.status || "").toLowerCase() === "submitted");
    };

    // ✅ can submit feedback?
    const getFeedbackAvailability = (interview) => {
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
            return { ok: false, reason: "Feedback is allowed after the interview time" };
        }

        return { ok: true, reason: "Submit feedback" };
    };

    const getRescheduleAvailability = (interview) => {
        if (!interview?.id) return { ok: false, reason: "No interview found" };

        const status = String(interview?.status || "").toLowerCase();
        if (status === "cancelled") return { ok: false, reason: "Interview is cancelled" };
        if (status === "completed") return { ok: false, reason: "Interview is completed" };

        if (hasAnyFeedbackStarted(interview)) {
            return { ok: false, reason: "Cannot reschedule: feedback already started" };
        }

        return { ok: true, reason: "Reschedule / Update Interview" };
    };

    const getCancelAvailability = (interview) => {
        if (!interview?.id) return { ok: false, reason: "No interview found" };

        const status = String(interview?.status || "").toLowerCase();
        if (status === "cancelled") return { ok: false, reason: "Already cancelled" };
        if (status === "completed") return { ok: false, reason: "Interview is completed" };

        if (hasAnyFeedbackStarted(interview)) {
            return { ok: false, reason: "Cannot cancel: feedback already started" };
        }

        return { ok: true, reason: "Cancel Interview" };
    };

    const columns = useMemo(
        () => [
            {
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    const appId = row?.original?.id;
                    const interview = row?.original?.next_interview || null;
                    const hasInterview = Boolean(interview?.id);

                    const feedbackAvailability = getFeedbackAvailability(interview);
                    const disableComplete = !feedbackAvailability.ok;

                    const completeBtnCls = disableComplete
                        ? "ti-btn ti-btn-light ti-btn-sm !opacity-60 !cursor-not-allowed grayscale blur-[0.4px]"
                        : "ti-btn ti-btn-success ti-btn-sm";

                    const rescheduleAvailability = getRescheduleAvailability(interview);
                    const disableReschedule = !hasInterview || !rescheduleAvailability.ok;

                    const rescheduleBtnCls = disableReschedule
                        ? "ti-btn ti-btn-light ti-btn-sm !opacity-60 !cursor-not-allowed grayscale blur-[0.4px]"
                        : "ti-btn ti-btn-primary ti-btn-sm";

                    const cancelAvailability = getCancelAvailability(interview);
                    const disableCancel = !hasInterview || !cancelAvailability.ok;

                    const cancelBtnCls = disableCancel
                        ? "ti-btn ti-btn-light ti-btn-sm !opacity-60 !cursor-not-allowed grayscale blur-[0.4px]"
                        : "ti-btn ti-btn-warning ti-btn-sm";

                    return (
                        <div className="flex justify-center gap-2">
                            <Link to={`/module/requisition/${requisitionId}/applicants/${appId}`}>
                                <button className="ti-btn ti-btn-secondary ti-btn-sm" title="View Applicant">
                                    <i className="ri-eye-line" />
                                </button>
                            </Link>

                            <button
                                type="button"
                                className={rescheduleBtnCls}
                                title={rescheduleAvailability.reason}
                                onClick={() => {
                                    if (disableReschedule) return;
                                    openRescheduleModal(appId, interview);
                                }}
                                disabled={disableReschedule}
                            >
                                <span className="inline-flex items-center gap-1">
                                    <CalendarClock size={16} />
                                </span>
                            </button>

                            <button
                                type="button"
                                className={completeBtnCls}
                                title={feedbackAvailability.reason}
                                onClick={() => {
                                    if (disableComplete) return;
                                    openCompleteModal(appId, interview);
                                }}
                                disabled={disableComplete}
                            >
                                <span className="inline-flex items-center gap-1">
                                    <ClipboardCheck size={16} />
                                </span>
                            </button>

                            <button
                                type="button"
                                className={cancelBtnCls}
                                title={cancelAvailability.reason}
                                onClick={() => {
                                    if (disableCancel) return;
                                    openCancelModal(appId, interview);
                                }}
                                disabled={disableCancel}
                            >
                                <span className="inline-flex items-center gap-1">
                                    <CalendarX size={16} />
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [requisitionId, updateOneStatus, myUserId]
    );

    if (!isActive) return null;

    return (
        <>
            <DataTable
                key={refreshKey}
                columns={columns}
                title="Interview Scheduled Applicants"
                apiUrl={`/requisitions/${requisitionId}/applicants/interview-scheduled/datatable`}
                enableAdvancedFilters={true}
            />

            <RequisitionInterviewFormWrapper
                requisitionId={requisitionId}
                applicationId={selectedApplicationId}
                interviewData={selectedInterview}
                isOpen={isInterviewFormOpen}
                onClose={closeAllModals}
                onSuccess={() => {
                    closeAllModals();
                    setRefreshKey((k) => k + 1);
                }}
            />

            <RequisitionInterviewCompleteWrapper
                requisitionId={requisitionId}
                applicationId={selectedApplicationId}
                interviewData={selectedInterview}
                isOpen={isCompleteOpen}
                onClose={closeAllModals}
                onSuccess={() => {
                    closeAllModals();
                    setRefreshKey((k) => k + 1);
                }}
            />

            <RequisitionInterviewCancelWrapper
                requisitionId={requisitionId}
                applicationId={selectedApplicationId}
                interviewData={selectedInterview}
                isOpen={isCancelOpen}
                onClose={closeAllModals}
                onSuccess={() => {
                    closeAllModals();
                    setRefreshKey((k) => k + 1);
                }}
            />
        </>
    );
};

export default RequisitionInterviewScheduledApplicant;
