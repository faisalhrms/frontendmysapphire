import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import {
    BarChart3,
    Grid,
    Users,
    Activity,
    CheckCircle2,
    Timer,
    UserPlus,
    UserX,
    Briefcase,
    Calendar,
    Eye,
    ChevronDown,
    ChevronUp,
    Filter,
} from "lucide-react";

import useFilters from "@hooks/useFilters.js";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";

import FilterButton from "@components/form/FilterButton.jsx";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import ReChart from "@components/charts/ReChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";

const badgeTone = (status) => {
    const v = String(status || "").toLowerCase();
    if (["hired", "selected", "offer_accepted", "completed"].includes(v))
        return "bg-success/10 text-success ring-success";
    if (["interview_scheduled", "scheduled", "rescheduled", "in_progress"].includes(v))
        return "bg-info/10 text-info ring-info";
    if (["shortlisted", "decision_pending"].includes(v))
        return "bg-warning/10 text-warning ring-warning";
    if (["rejected", "cancelled", "no_show", "offer_declined"].includes(v))
        return "bg-danger/10 text-danger ring-danger";
    return "bg-light/60 text-defaulttextcolor ring-defaultborder";
};

const fmt = (v) => (v == null || v === "" ? "—" : String(v));

const triStateOptions = [
    { value: "", label: "All" },
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
];

const Chip = ({ children }) => (
    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border border-defaultborder bg-light/40 dark:bg-bodybg2 text-defaulttextcolor">
    {children}
  </span>
);

const StarSvg = ({ filled }) => (
    <svg
        viewBox="0 0 20 20"
        className={`w-4 h-4 ${filled ? "text-warning" : "text-gray-300 dark:text-gray-700"}`}
        fill="currentColor"
        aria-hidden="true"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.964a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.374 2.452a1 1 0 00-.364 1.118l1.286 3.964c.3.921-.755 1.688-1.538 1.118l-3.374-2.452a1 1 0 00-1.175 0l-3.374 2.452c-.783.57-1.838-.197-1.538-1.118l1.286-3.964a1 1 0 00-.364-1.118L2.05 9.391c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.964z" />
    </svg>
);

const RatingStars = ({ value, showValue = true }) => {
    const v = value == null ? null : Number(value);
    if (v == null || Number.isNaN(v)) return <span className="text-textmuted text-sm">—</span>;

    const rounded1 = Math.round(v * 10) / 10; // 1 decimal
    const filled = Math.max(0, Math.min(5, Math.round(rounded1)));
    const stars = Array.from({ length: 5 }, (_, i) => i < filled);

    return (
        <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="flex items-center gap-0.5">
                {stars.map((f, i) => (
                    <StarSvg key={i} filled={f} />
                ))}
            </div>
            {showValue && <span className="text-xs font-semibold text-defaulttextcolor">{rounded1}/5</span>}
        </div>
    );
};

const avgFromPanel = (panel = []) => {
    const vals = (panel || [])
        .map((p) => (p?.overall_rating == null ? null : Number(p.overall_rating)))
        .filter((x) => x != null && !Number.isNaN(x));
    if (!vals.length) return null;
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
};

const ApplicantInterviewHistory = ({ requisitionId, applicationId }) => {
    const { data, isLoading } = useFetchWithFilters(
        `/requisitions/${Number(requisitionId)}/applicants/${Number(applicationId)}/interviews/`,
        {}
    );

    const interviews = useMemo(() => data ?? [], [data]);

    if (isLoading) {
        return (
            <div className="p-5">
         <LoadingSpinner/>
            </div>
        );
    }

    if (!interviews?.length) {
        return (
            <div className="p-5">
                <div className="text-sm text-textmuted">No interviews found for this applicant.</div>
            </div>
        );
    }

    return (
        <div className="p-5 space-y-4">
            {interviews.map((iv) => {
                const avg = avgFromPanel(iv.panel);
                return (
                    <div
                        key={iv.id}
                        className="rounded-xl border border-defaultborder bg-light/30 dark:bg-bodybg2 p-4"
                    >
                        <div className="flex items-start justify-between flex-wrap gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="text-sm font-bold text-defaulttextcolor">
                                        {toTitleCase(String(iv.round || "").replaceAll("_", " "))}
                                    </div>
                                    <span
                                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${badgeTone(
                                            iv.status
                                        )}`}
                                    >
                    {toTitleCase(iv.status)}
                  </span>
                                </div>

                                <div className="mt-1 text-xs text-textmuted">
                                    Scheduled: {iv.scheduled_at ? formatDate(iv.scheduled_at) : "—"}{" "}
                                    {iv.timezone ? `(${iv.timezone})` : ""}
                                </div>

                                <div className="mt-1 text-xs text-textmuted">
                                    Type: {toTitleCase(iv.interview_type)} · Duration: {iv.duration_minutes ?? "—"} mins
                                </div>

                                {iv.link_or_location ? (
                                    <div className="mt-1 text-xs text-textmuted">
                                        Link/Location: <span className="text-defaulttextcolor">{iv.link_or_location}</span>
                                    </div>
                                ) : null}
                            </div>

                            <div className="text-right">
                                <div className="text-xs text-textmuted">
                                    Interviewers: <span className="font-bold text-defaulttextcolor">{iv.total_interviewers ?? 0}</span>
                                </div>
                                <div className="text-xs text-textmuted">
                                    Pending Feedback:{" "}
                                    <span className="font-bold text-defaulttextcolor">{iv.pending_feedback_count ?? 0}</span>
                                </div>
                                <div className="mt-2">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-textmuted">
                                        Avg Submitted Rating
                                    </div>
                                    <div className="mt-1">
                                        <RatingStars value={avg} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Panel members */}
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-max">
                                <thead className="bg-defaultbackground dark:bg-bodybg border border-defaultborder">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        Panel Member
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        Rating
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        Recommendation
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        Remarks
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        Submitted
                                    </th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-defaultborder">
                                {(iv.panel || []).map((p) => (
                                    <tr key={p.id} className="hover:bg-listhoverfocusbg transition-colors">
                                        <td className="px-4 py-3 text-sm font-semibold text-defaulttextcolor">
                                            {p?.interviewer?.full_name || p?.interviewer?.name || "—"}
                                            <div className="text-xs text-textmuted">{p?.interviewer?.email || ""}</div>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-defaulttextcolor">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${badgeTone(p.status)}`}>
                          {toTitleCase(p.status)}
                        </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            <RatingStars value={p.overall_rating} />
                                        </td>

                                        <td className="px-4 py-3 text-sm text-defaulttextcolor">
                                            {p.recommendation ? toTitleCase(String(p.recommendation).replaceAll("_", " ")) : "—"}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-textmuted">
                                            {p.remarks ? String(p.remarks) : "—"}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-textmuted">
                                            {p.submitted_at ? formatDate(p.submitted_at) : "—"}
                                        </td>
                                    </tr>
                                ))}

                                {(iv.panel || []).length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-6 text-center text-sm text-textmuted">
                                            No panel members.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const RequisitionDetailedDashboard = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    // deep link support (only important filters)
    const initialFilters = useMemo(() => {
        const p = Object.fromEntries(searchParams.entries());
        return {
            shortlisted: p.shortlisted || "",
            ai_shortlisted: p.ai_shortlisted || "",
            has_interviews: p.has_interviews || "",
            has_upcoming_interview: p.has_upcoming_interview || "",

            applied_from: p.applied_from || "",
            applied_to: p.applied_to || "",

            interview_from: p.interview_from || "",
            interview_to: p.interview_to || "",

            ai_score_min: p.ai_score_min || "",
            ai_score_max: p.ai_score_max || "",

            rating_min: p.rating_min || "",
            rating_max: p.rating_max || "",

            applicants_limit: p.applicants_limit || "10",
            interviews_limit: p.interviews_limit || "10",
        };
    }, [searchParams]);

    const { control, handleSubmit, errors, getFilters, resetFilters } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: "shortlisted", defaultValue: initialFilters.shortlisted },
                    { name: "ai_shortlisted", defaultValue: initialFilters.ai_shortlisted },
                    { name: "has_interviews", defaultValue: initialFilters.has_interviews },
                    { name: "has_upcoming_interview", defaultValue: initialFilters.has_upcoming_interview },

                    { name: "applied_from", defaultValue: initialFilters.applied_from },
                    { name: "applied_to", defaultValue: initialFilters.applied_to },

                    { name: "interview_from", defaultValue: initialFilters.interview_from },
                    { name: "interview_to", defaultValue: initialFilters.interview_to },

                    { name: "ai_score_min", defaultValue: initialFilters.ai_score_min },
                    { name: "ai_score_max", defaultValue: initialFilters.ai_score_max },

                    { name: "rating_min", defaultValue: initialFilters.rating_min },
                    { name: "rating_max", defaultValue: initialFilters.rating_max },

                    { name: "applicants_limit", defaultValue: initialFilters.applicants_limit },
                    { name: "interviews_limit", defaultValue: initialFilters.interviews_limit },
                ],
            }),
            [initialFilters]
        )
    );

    const [filters, setFilters] = useState(getFilters());
    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        resetFilters(initialFilters);
        setFilters(initialFilters);
    }, [initialFilters, resetFilters]);

    const onSubmit = useCallback((formData) => {
        setFilters(formData);
    }, []);

    const onReset = useCallback(() => {
        resetFilters(initialFilters);
        setFilters(initialFilters);
    }, [resetFilters, initialFilters]);

    // tabs
    const tabs = [
        { id: "overview", label: "Overview", icon: Grid },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "applicants", label: "Applicants", icon: Users },
        { id: "interviews", label: "Interviews", icon: Calendar },
        { id: "approval", label: "Approval", icon: Eye },
    ];
    const [activeTab, setActiveTab] = useState("overview");

    // build API filters (include only non-empty)
    const apiFilters = useMemo(() => {
        const out = {};
        const setIf = (k, v) => {
            if (v == null) return;
            const s = String(v).trim();
            if (s === "") return;
            out[k] = s;
        };

        setIf("shortlisted", filters.shortlisted);
        setIf("ai_shortlisted", filters.ai_shortlisted);
        setIf("has_interviews", filters.has_interviews);
        setIf("has_upcoming_interview", filters.has_upcoming_interview);

        setIf("applied_from", filters.applied_from);
        setIf("applied_to", filters.applied_to);

        setIf("interview_from", filters.interview_from);
        setIf("interview_to", filters.interview_to);

        setIf("ai_score_min", filters.ai_score_min);
        setIf("ai_score_max", filters.ai_score_max);

        setIf("rating_min", filters.rating_min);
        setIf("rating_max", filters.rating_max);

        // limits always set
        setIf("applicants_limit", filters.applicants_limit || "10");
        setIf("interviews_limit", filters.interviews_limit || "10");

        return out;
    }, [filters]);

    // filter chips + count
    const activeFilters = useMemo(() => {
        const pairs = [];
        const add = (k, v, label) => {
            const s = String(v ?? "").trim();
            if (!s) return;
            pairs.push({ key: k, label: label || k, value: s });
        };

        add("shortlisted", filters.shortlisted, "Shortlisted");
        add("ai_shortlisted", filters.ai_shortlisted, "AI Shortlisted");
        add("has_interviews", filters.has_interviews, "Has Interviews");
        add("has_upcoming_interview", filters.has_upcoming_interview, "Has Upcoming");

        add("applied_from", filters.applied_from, "Applied From");
        add("applied_to", filters.applied_to, "Applied To");

        add("interview_from", filters.interview_from, "Interview From");
        add("interview_to", filters.interview_to, "Interview To");

        add("ai_score_min", filters.ai_score_min, "AI Min");
        add("ai_score_max", filters.ai_score_max, "AI Max");

        add("rating_min", filters.rating_min, "Rating Min");
        add("rating_max", filters.rating_max, "Rating Max");

        return pairs;
    }, [filters]);

    const { data: dashboardData, isLoading } = useFetchWithFilters(
        `/requisition/${Number(id)}/dashboard/`,
        apiFilters
    );

    const requisition = useMemo(() => dashboardData?.requisition ?? null, [dashboardData]);
    const approval = useMemo(() => dashboardData?.approval ?? null, [dashboardData]);

    const appsSummary = useMemo(() => dashboardData?.applications_summary ?? null, [dashboardData]);
    const funnel = useMemo(() => dashboardData?.funnel ?? null, [dashboardData]);

    const interviewsSummary = useMemo(() => dashboardData?.interviews_summary ?? null, [dashboardData]);
    const upcomingInterviews = useMemo(() => dashboardData?.upcoming_interviews ?? [], [dashboardData]);

    const recentApplicants = useMemo(() => dashboardData?.recent_applicants ?? [], [dashboardData]);
    const topCandidates = useMemo(() => dashboardData?.top_candidates ?? [], [dashboardData]);

    const aiMetrics = useMemo(() => dashboardData?.ai_metrics ?? null, [dashboardData]);
    const timeMetrics = useMemo(() => dashboardData?.time_metrics ?? null, [dashboardData]);

    // charts
    const statusDist = useMemo(() => {
        const by = appsSummary?.by_status || {};
        return Object.keys(by).map((k) => ({
            name: toTitleCase(k.replaceAll("_", " ")),
            value: Number(by[k] || 0),
        }));
    }, [appsSummary]);

    const funnelDist = useMemo(() => {
        const s = funnel?.stages || {};
        const order = ["submitted", "shortlisted", "interview_scheduled", "interviewed", "selected", "hired", "rejected"];
        return order.map((k) => ({
            name: toTitleCase(k.replaceAll("_", " ")),
            value: Number(s[k] || 0),
        }));
    }, [funnel]);

    const roundDist = useMemo(() => {
        const by = interviewsSummary?.by_round || {};
        return Object.keys(by).map((k) => ({
            name: toTitleCase(k.replaceAll("_", " ")),
            value: Number(by[k] || 0),
        }));
    }, [interviewsSummary]);

    // approval expand
    const [openActionId, setOpenActionId] = useState(null);
    const toggleAction = useCallback((actionId) => {
        setOpenActionId((prev) => (prev === actionId ? null : actionId));
    }, []);

    // applicant expand -> interview history
    const [openApplicantId, setOpenApplicantId] = useState(null);
    const toggleApplicant = useCallback((appId) => {
        setOpenApplicantId((prev) => (prev === appId ? null : appId));
    }, []);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 pb-8 pt-8">
            {/* Header */}
            <div className="bg-defaultbackground dark:bg-bodybg rounded-lg shadow-defaultshadow border border-defaultborder p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                            <Briefcase size={26} />
                        </div>

                        <div>
                            <h1 className="font-bold text-2xl text-defaulttextcolor">Requisition Dashboard</h1>
                            <p className="text-sm text-textmuted">Applicant funnel, interviews, approval and KPIs</p>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Chip>
                                    Req: <span className="font-bold">{fmt(requisition?.req_no || requisition?.id)}</span>
                                </Chip>
                                <Chip>
                                    Title: <span className="font-bold">{fmt(requisition?.position_title)}</span>
                                </Chip>
                                <Chip>
                                    Status:{" "}
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${badgeTone(requisition?.status)}`}>
                    {toTitleCase(requisition?.status)}
                  </span>
                                </Chip>
                                {activeFilters.length > 0 && (
                                    <Chip>
                                        <Filter size={14} /> Active Filters: <span className="font-bold">{activeFilters.length}</span>
                                    </Chip>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Toggle Filters ONLY */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setFiltersOpen((v) => !v)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-defaultborder bg-defaultbackground hover:bg-listhoverfocusbg dark:bg-bodybg shadow-sm transition"
                        >
                            <Filter size={18} />
                            {filtersOpen ? "Hide Filters" : "Show Filters"}
                            {filtersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                    </div>
                </div>

                {/* Filter chips preview when collapsed */}
                {!filtersOpen && activeFilters.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {activeFilters.slice(0, 10).map((f) => (
                            <Chip key={f.key}>
                                {f.label}: <span className="font-bold">{f.value}</span>
                            </Chip>
                        ))}
                        {activeFilters.length > 10 && <Chip>+{activeFilters.length - 10} more</Chip>}
                    </div>
                )}

                {/* Filters Panel */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div
                        className={`mt-6 border-t border-defaultborder pt-4 transition-all duration-300 ${
                            filtersOpen ? "opacity-100" : "opacity-0 pointer-events-none h-0 overflow-hidden"
                        }`}
                    >
                        {/* Panel header with correct button placement */}
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-defaulttextcolor">Filters</h3>
                                <p className="text-xs text-textmuted">Only important filters shown</p>
                            </div>

                            {/* ✅ Correct position */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={onReset}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-defaultborder bg-defaultbackground hover:bg-listhoverfocusbg dark:bg-bodybg shadow-sm transition"
                                >
                                    Reset
                                </button>
                                <FilterButton />
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-4">
                            {/* Shortlisted */}
                            <div className="col-span-12 md:col-span-4 lg:col-span-3">
                                <label className="text-xs font-semibold text-textmuted">Shortlisted</label>
                                <select
                                    className="mt-1 w-full rounded-lg border border-inputborder bg-defaultbackground px-3 py-2 text-sm dark:bg-bodybg"
                                    {...control.register("shortlisted")}
                                >
                                    {triStateOptions.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* AI Shortlisted */}
                            <div className="col-span-12 md:col-span-4 lg:col-span-3">
                                <label className="text-xs font-semibold text-textmuted">AI Shortlisted</label>
                                <select
                                    className="mt-1 w-full rounded-lg border border-inputborder bg-defaultbackground px-3 py-2 text-sm dark:bg-bodybg"
                                    {...control.register("ai_shortlisted")}
                                >
                                    {triStateOptions.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Has Interviews */}
                            <div className="col-span-12 md:col-span-4 lg:col-span-3">
                                <label className="text-xs font-semibold text-textmuted">Has Interviews</label>
                                <select
                                    className="mt-1 w-full rounded-lg border border-inputborder bg-defaultbackground px-3 py-2 text-sm dark:bg-bodybg"
                                    {...control.register("has_interviews")}
                                >
                                    {triStateOptions.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Has Upcoming Interview */}
                            <div className="col-span-12 md:col-span-4 lg:col-span-3">
                                <label className="text-xs font-semibold text-textmuted">Has Upcoming Interview</label>
                                <select
                                    className="mt-1 w-full rounded-lg border border-inputborder bg-defaultbackground px-3 py-2 text-sm dark:bg-bodybg"
                                    {...control.register("has_upcoming_interview")}
                                >
                                    {triStateOptions.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Applied From */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <label className="text-xs font-semibold text-textmuted">Applied From</label>
                                <input
                                    type="date"
                                    className="mt-1 w-full rounded-lg border border-inputborder bg-defaultbackground px-3 py-2 text-sm dark:bg-bodybg"
                                    {...control.register("applied_from")}
                                />
                            </div>

                            {/* Applied To */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <label className="text-xs font-semibold text-textmuted">Applied To</label>
                                <input
                                    type="date"
                                    className="mt-1 w-full rounded-lg border border-inputborder bg-defaultbackground px-3 py-2 text-sm dark:bg-bodybg"
                                    {...control.register("applied_to")}
                                />
                            </div>

                            {/* Interview From */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <label className="text-xs font-semibold text-textmuted">Interview From</label>
                                <input
                                    type="date"
                                    className="mt-1 w-full rounded-lg border border-inputborder bg-defaultbackground px-3 py-2 text-sm dark:bg-bodybg"
                                    {...control.register("interview_from")}
                                />
                            </div>

                            {/* Interview To */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <label className="text-xs font-semibold text-textmuted">Interview To</label>
                                <input
                                    type="date"
                                    className="mt-1 w-full rounded-lg border border-inputborder bg-defaultbackground px-3 py-2 text-sm dark:bg-bodybg"
                                    {...control.register("interview_to")}
                                />
                            </div>

                            {/* AI Score Min */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <label className="text-xs font-semibold text-textmuted">AI Score Min</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="mt-1 w-full rounded-lg border border-inputborder bg-defaultbackground px-3 py-2 text-sm dark:bg-bodybg"
                                    placeholder="0.00"
                                    {...control.register("ai_score_min")}
                                />
                            </div>

                            {/* AI Score Max */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <label className="text-xs font-semibold text-textmuted">AI Score Max</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="mt-1 w-full rounded-lg border border-inputborder bg-defaultbackground px-3 py-2 text-sm dark:bg-bodybg"
                                    placeholder="100.00"
                                    {...control.register("ai_score_max")}
                                />
                            </div>

                            {/* Rating Min */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <label className="text-xs font-semibold text-textmuted">Rating Min</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="mt-1 w-full rounded-lg border border-inputborder bg-defaultbackground px-3 py-2 text-sm dark:bg-bodybg"
                                    placeholder="0.00"
                                    {...control.register("rating_min")}
                                />
                            </div>

                            {/* Rating Max */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <label className="text-xs font-semibold text-textmuted">Rating Max</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="mt-1 w-full rounded-lg border border-inputborder bg-defaultbackground px-3 py-2 text-sm dark:bg-bodybg"
                                    placeholder="5.00"
                                    {...control.register("rating_max")}
                                />
                            </div>

                            {/* Applicants Limit */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <label className="text-xs font-semibold text-textmuted">Applicants Limit</label>
                                <select
                                    className="mt-1 w-full rounded-lg border border-inputborder bg-defaultbackground px-3 py-2 text-sm dark:bg-bodybg"
                                    {...control.register("applicants_limit")}
                                >
                                    {[10, 15, 25, 50].map((n) => (
                                        <option key={n} value={String(n)}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Interviews Limit */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <label className="text-xs font-semibold text-textmuted">Interviews Limit</label>
                                <select
                                    className="mt-1 w-full rounded-lg border border-inputborder bg-defaultbackground px-3 py-2 text-sm dark:bg-bodybg"
                                    {...control.register("interviews_limit")}
                                >
                                    {[10, 15, 25, 50].map((n) => (
                                        <option key={n} value={String(n)}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Tabs */}
                <div className="mt-4 flex gap-2 border-t border-defaultborder pt-4 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all border ${
                                    activeTab === tab.id
                                        ? "bg-primary/10 text-primary border-primary/30 shadow-md"
                                        : "bg-defaultbackground text-defaulttextcolor border-defaultborder shadow-sm hover:shadow-md hover:border-headerbordercolor dark:bg-bodybg"
                                }`}
                            >
                                <Icon size={18} />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* OVERVIEW */}
            {activeTab === "overview" && requisition && appsSummary && interviewsSummary && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard icon={Users} title="Applications" value={appsSummary.total_applications || 0} />
                        <StatCard icon={UserPlus} title="Shortlisted" value={appsSummary.shortlisted_count || 0} />
                        <StatCard icon={Calendar} title="Upcoming Interviews" value={interviewsSummary.upcoming_count || 0} />
                        <StatCard icon={CheckCircle2} title="Completed Interviews" value={interviewsSummary.completed_count || 0} />

                        <StatCard icon={Activity} title="AI Processed" value={aiMetrics?.processed_count || 0} />
                        <StatCard icon={UserX} title="AI Pending" value={aiMetrics?.pending_processing_count || 0} />
                        <StatCard
                            icon={Activity}
                            title="Avg AI Score"
                            value={aiMetrics?.avg_ai_score == null ? "—" : Number(aiMetrics.avg_ai_score).toFixed(2)}
                        />
                        <StatCard icon={Timer} title="Days Open" value={timeMetrics?.days_open ?? "—"} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-defaultbackground dark:bg-bodybg rounded-lg shadow-defaultshadow border border-defaultborder">
                            <div className="px-6 py-4 border-b border-defaultborder">
                                <h3 className="text-lg font-semibold text-defaulttextcolor">Funnel</h3>
                            </div>
                            <div className="p-6">
                                <ReChart data={funnelDist} dimensions={{ height: 320 }} />
                            </div>
                        </div>

                        <div className="bg-defaultbackground dark:bg-bodybg rounded-lg shadow-defaultshadow border border-defaultborder">
                            <div className="px-6 py-4 border-b border-defaultborder">
                                <h3 className="text-lg font-semibold text-defaulttextcolor">Applications by Status</h3>
                            </div>
                            <div className="p-6">
                                <ReChart data={statusDist} dimensions={{ height: 320 }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ANALYTICS */}
            {activeTab === "analytics" && (
                <div className="space-y-6">
                    <div className="bg-defaultbackground dark:bg-bodybg rounded-lg shadow-defaultshadow border border-defaultborder">
                        <div className="px-6 py-4 border-b border-defaultborder">
                            <h3 className="text-lg font-semibold text-defaulttextcolor">Interviews by Round</h3>
                        </div>
                        <div className="p-6">
                            <ReChart data={roundDist} dimensions={{ height: 320 }} />
                        </div>
                    </div>
                </div>
            )}

            {/* APPLICANTS */}
            {activeTab === "applicants" && (
                <div className="space-y-6">
                    {/* Recent Applicants */}
                    <div className="bg-defaultbackground dark:bg-bodybg rounded-lg shadow-defaultshadow border border-defaultborder p-6">
                        <h3 className="text-lg font-semibold text-defaulttextcolor mb-4">
                            Recent Applicants ({recentApplicants.length})
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max">
                                <thead className="bg-light/30 dark:bg-bodybg2 border border-defaultborder">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        Rating
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        AI
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        Interviews
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        Applied
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted"></th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-defaultborder">
                                {recentApplicants.map((a) => {
                                    const isOpen = openApplicantId === a.id;

                                    return (
                                        <React.Fragment key={a.id}>
                                            <tr className="hover:bg-listhoverfocusbg transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-defaulttextcolor">{a.full_name || "—"}</div>
                                                    <div className="text-xs text-textmuted">{a.email || "—"}</div>
                                                </td>

                                                <td className="px-6 py-4">
                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${badgeTone(
                                    a.status
                                )}`}
                            >
                              {toTitleCase(a.status)}
                            </span>

                                                    {a.has_upcoming_interview ? (
                                                        <div className="mt-1 text-[11px] font-semibold text-info">
                                                            Upcoming Interview
                                                        </div>
                                                    ) : null}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <RatingStars value={a.rating} />
                                                </td>

                                                <td className="px-6 py-4 text-sm text-defaulttextcolor">
                                                    {a.ai_score == null ? "—" : Number(a.ai_score).toFixed(2)}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-defaulttextcolor">
                                                    {a.interviews_count ?? 0}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-textmuted">
                                                    {a.created_at ? formatDate(a.created_at) : "—"}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleApplicant(a.id)}
                                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border bg-defaultbackground hover:bg-listhoverfocusbg border-defaultborder text-defaulttextcolor shadow-sm"
                                                    >
                                                        <Eye size={16} />
                                                        {isOpen ? "Hide" : "View"}
                                                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                    </button>
                                                </td>
                                            </tr>

                                            {isOpen && (
                                                <tr className="bg-defaultbackground dark:bg-bodybg">
                                                    <td colSpan={7} className="px-0">
                                                        <ApplicantInterviewHistory requisitionId={id} applicationId={a.id} />
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}

                                {recentApplicants.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-sm text-textmuted">
                                            No applicants found for current filters.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Candidates */}
                    <div className="bg-defaultbackground dark:bg-bodybg rounded-lg shadow-defaultshadow border border-defaultborder p-6">
                        <h3 className="text-lg font-semibold text-defaulttextcolor mb-4">
                            Top Candidates ({topCandidates.length})
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max">
                                <thead className="bg-light/30 dark:bg-bodybg2 border border-defaultborder">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        Rating
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        AI
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                        Interviews
                                    </th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-defaultborder">
                                {topCandidates.map((a) => (
                                    <tr key={a.id} className="hover:bg-listhoverfocusbg transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-defaulttextcolor">{a.full_name || "—"}</div>
                                            <div className="text-xs text-textmuted">{a.email || "—"}</div>
                                        </td>

                                        <td className="px-6 py-4">
                        <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${badgeTone(
                                a.status
                            )}`}
                        >
                          {toTitleCase(a.status)}
                        </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <RatingStars value={a.rating} />
                                        </td>

                                        <td className="px-6 py-4 text-sm text-defaulttextcolor">
                                            {a.ai_score == null ? "—" : Number(a.ai_score).toFixed(2)}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-defaulttextcolor">
                                            {a.interviews_count ?? 0}
                                        </td>
                                    </tr>
                                ))}

                                {topCandidates.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-sm text-textmuted">
                                            No candidates found for current filters.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* INTERVIEWS */}
            {activeTab === "interviews" && (
                <div className="bg-defaultbackground dark:bg-bodybg rounded-lg shadow-defaultshadow border border-defaultborder p-6">
                    <h3 className="text-lg font-semibold text-defaulttextcolor mb-4">
                        Upcoming Interviews ({upcomingInterviews.length})
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max">
                            <thead className="bg-light/30 dark:bg-bodybg2 border border-defaultborder">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                    Candidate
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                    Round
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                    Scheduled
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                    Rating
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">
                                    Panel
                                </th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-defaultborder">
                            {upcomingInterviews.map((iv) => (
                                <tr key={iv.id} className="hover:bg-listhoverfocusbg transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-defaulttextcolor">{iv?.candidate?.full_name || "—"}</div>
                                        <div className="text-xs text-textmuted">{iv?.candidate?.email || ""}</div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-defaulttextcolor">
                                        {toTitleCase(String(iv.round || "").replaceAll("_", " "))}
                                    </td>

                                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${badgeTone(iv.status)}`}>
                        {toTitleCase(iv.status)}
                      </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-defaulttextcolor">
                                        {iv.scheduled_at ? formatDate(iv.scheduled_at) : "—"}
                                        {iv.timezone ? <div className="text-xs text-textmuted">{iv.timezone}</div> : null}
                                    </td>

                                    <td className="px-6 py-4">
                                        <RatingStars value={iv?.candidate?.rating} />
                                    </td>

                                    <td className="px-6 py-4 text-sm text-defaulttextcolor">
                                        <div className="text-xs text-textmuted">
                                            Total: {iv?.panel?.total_interviewers ?? 0} · Submitted: {iv?.panel?.submitted_feedback_count ?? 0} · Pending:{" "}
                                            {iv?.panel?.pending_feedback_count ?? 0}
                                        </div>
                                        <div className="text-xs text-textmuted">
                                            Avg Rating: {iv?.panel?.avg_overall_rating_submitted ?? "—"}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {upcomingInterviews.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-sm text-textmuted">
                                        No interviews found for current filters.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* APPROVAL */}
            {activeTab === "approval" && (
                <div className="bg-defaultbackground dark:bg-bodybg rounded-lg shadow-defaultshadow border border-defaultborder p-6">
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                        <h3 className="text-lg font-semibold text-defaulttextcolor">Approval Timeline</h3>

                        <div className="text-xs text-textmuted">
                            Current Approver:{" "}
                            <span className="font-semibold text-defaulttextcolor">
                {approval?.current_approver?.full_name || approval?.current_approver?.name || "—"}
              </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max">
                            <thead className="bg-light/30 dark:bg-bodybg2 border border-defaultborder">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">Action</th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">Actor</th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">Time</th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted">Remarks</th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-textmuted"></th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-defaultborder">
                            {(approval?.actions || []).map((a) => {
                                const isOpen = openActionId === a.id;
                                return (
                                    <React.Fragment key={a.id}>
                                        <tr className="hover:bg-listhoverfocusbg transition-colors">
                                            <td className="px-6 py-4 text-sm font-semibold text-defaulttextcolor">
                                                {toTitleCase(String(a.action || "").replaceAll("_", " "))}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-textmuted">{a?.actor?.full_name || a?.actor?.name || "—"}</td>
                                            <td className="px-6 py-4 text-sm text-textmuted">{a.created_at ? formatDate(a.created_at) : "—"}</td>
                                            <td className="px-6 py-4 text-sm text-textmuted">{a.remarks ? String(a.remarks).slice(0, 60) : "—"}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleAction(a.id)}
                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border bg-defaultbackground hover:bg-listhoverfocusbg border-defaultborder text-defaulttextcolor shadow-sm"
                                                >
                                                    <Eye size={16} />
                                                    {isOpen ? "Hide" : "View"}
                                                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                            </td>
                                        </tr>

                                        {isOpen && (
                                            <tr className="bg-defaultbackground dark:bg-bodybg">
                                                <td colSpan={5} className="px-6 py-5">
                                                    <div className="rounded-xl border border-defaultborder bg-light/30 dark:bg-bodybg2 p-5">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-textmuted">
                                                                    From → To
                                                                </div>
                                                                <div className="mt-1 text-defaulttextcolor">
                                                                    {fmt(a.from_status)} → {fmt(a.to_status)}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-textmuted">
                                                                    Remarks
                                                                </div>
                                                                <div className="mt-1 text-defaulttextcolor whitespace-pre-wrap">
                                                                    {a.remarks || "—"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}

                            {(approval?.actions || []).length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-sm text-textmuted">
                                        No approval actions found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequisitionDetailedDashboard;
