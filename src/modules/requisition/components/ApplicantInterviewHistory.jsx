import { Fragment, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import Notify from "@helpers/toastNotifications.js";
import api from "../../../config/axiosConfig.js";
import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";

// --- Utility: Avatar Generator ---
const Avatar = ({ user, size = "md" }) => {
    const name = user?.full_name || user?.interviewer?.full_name || "?";
    const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
    const sizeClasses = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";

    // Using your palette colors for random avatar backgrounds
    const colors = [
        "bg-sky-100 text-sky-600",
        "bg-violet-100 text-violet-600",
        "bg-emerald-100 text-emerald-600",
        "bg-amber-100 text-amber-600",
        "bg-rose-100 text-rose-600",
    ];
    const colorClass = colors[name.length % colors.length];

    return (
        <div className={`${sizeClasses} ${colorClass} rounded-full flex items-center justify-center font-bold shadow-sm border border-white shrink-0`} title={name}>
            {initials}
        </div>
    );
};

// --- Utility: Star Rating Visualizer ---
const StarRating = ({ score, max = 5 }) => {
    if (score === null || score === undefined) return <span className="text-slate-300 text-xs">N/A</span>;

    return (
        <div className="flex items-center gap-0.5">
            {[...Array(max)].map((_, i) => {
                const full = i + 1 <= score;
                const half = i < score && i + 1 > score;

                return (
                    <i key={i} className={
                        full
                            ? "ri-star-fill text-amber-400 text-sm"
                            : half
                                ? "ri-star-half-line text-amber-400 text-sm"
                                : "ri-star-line text-slate-200 text-sm"
                    } />
                );
            })}
            <span className="ml-1 text-xs font-semibold text-slate-600">({Number(score).toFixed(1)})</span>
        </div>
    );
};

// --- Utility: Recommendation Badge ---
const RecommendationBadge = ({ value }) => {
    if (!value) return null;
    const v = String(value).toLowerCase();

    if (v.includes("recommended") && !v.includes("not")) {
        return <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 tracking-wider">Recommended</span>;
    }
    if (v.includes("not") || v.includes("reject")) {
        return <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-50 text-rose-600 border border-rose-200 tracking-wider">Not Recommended</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-600 border border-slate-200 tracking-wider">{value}</span>;
};

// --- Utility: Status Badge (Updated Colors) ---
const StatusBadge = ({ status }) => {
    const s = String(status || "").toLowerCase();

    if (s === "submitted" || s === "completed") return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>;
    if (s === "cancelled") return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 line-through">Cancelled</span>;
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">In Progress</span>;
};

const InfoItem = ({ icon, label, value, isLink = false }) => {
    if (!value) return null;
    return (
        <div className="flex flex-col">
            <dt className="text-xs text-slate-500 font-medium flex items-center gap-1 mb-0.5">
                {icon && <i className={`${icon} text-slate-400`}></i>} {label}
            </dt>
            <dd className="text-sm text-slate-800 font-medium break-words">
                {isLink ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline decoration-sky-300 flex items-center gap-1">
                        Open Link <i className="ri-external-link-line text-xs"></i>
                    </a>
                ) : value}
            </dd>
        </div>
    );
};

// --- Sub-Component: Score Row ---
const ScoreRow = ({ label, score }) => (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        <StarRating score={score} />
    </div>
);

// --- Sub-Component: Interview Card ---
const InterviewTimelineCard = ({ interview, isLast }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const panel = Array.isArray(interview?.panel) ? interview.panel : [];
    const feedbackCount = panel.filter(p => p.submitted_at).length;
    const totalPanel = panel.length || interview.total_interviewers || 0;

    // Link Logic
    const linkMatch = String(interview.link_or_location || "").match(/https?:\/\/\S+/i);
    const linkUrl = linkMatch ? linkMatch[0] : null;
    const locationText = interview.link_or_location ? interview.link_or_location.replace(linkUrl || "", "").trim() : "";

    return (
        <div className="relative pl-8 pb-10">
            {/* Timeline Line */}
            {!isLast && <div className="absolute top-8 left-[11px] h-full w-0.5 bg-slate-200" aria-hidden="true" />}

            {/* Timeline Dot */}
            <div className={`absolute top-2 left-0 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10 
                ${interview.status === 'completed' ? 'border-emerald-500 text-emerald-500' : 'border-slate-300 text-slate-400'}`}>
                {interview.status === 'completed' ? <i className="ri-check-line text-xs font-bold"></i> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
            </div>

            {/* Card Container */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md overflow-hidden">

                {/* Header */}
                <div className="p-5 border-b border-slate-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-sky-50 p-2.5 rounded-lg text-sky-600">
                            <i className="ri-calendar-event-line text-xl"></i>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-base font-bold text-slate-800">{toTitleCase(interview.interview_type || "Interview")}</h3>
                                <span className="text-xs text-slate-500 font-medium px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200">
                                    {toTitleCase(String(interview.round || "").replace("round_", "Round "))}
                                </span>
                            </div>
                            <div className="text-sm text-slate-500 flex items-center gap-3">
                                <span>{formatDate(interview.scheduled_at, "MMM DD, YYYY • hh:mm A")}</span>
                                {interview.duration_minutes && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span>{interview.duration_minutes} mins</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 self-end md:self-center">
                        <StatusBadge status={interview.status} />
                    </div>
                </div>

                {/* Meta Data */}
                <div className="p-5 bg-white grid grid-cols-2 md:grid-cols-4 gap-6">
                    <InfoItem label="Scheduled By" icon="ri-user-add-line" value={interview?.scheduled_by?.full_name} />
                    <InfoItem label="Timezone" icon="ri-global-line" value={interview?.timezone} />
                    {linkUrl && <InfoItem label="Link" icon="ri-link" value={linkUrl} isLink={true} />}
                    {locationText && !linkUrl && <InfoItem label="Location" icon="ri-map-pin-line" value={locationText} />}

                    {interview.cancelled_at && (
                        <div className="col-span-2 text-rose-600 bg-rose-50 p-2 rounded text-xs border border-rose-100 flex items-start gap-2">
                            <i className="ri-error-warning-fill mt-0.5"></i>
                            <div>
                                <strong>Cancelled on {formatDate(interview.cancelled_at)}</strong>
                                <div className="text-rose-500">{interview.cancel_reason || "No reason provided"}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Feedback Accordion */}
                <div className="bg-slate-50 border-t border-slate-100">
                    <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {panel.slice(0, 4).map((p, idx) => <Avatar key={idx} user={p.interviewer || p} size="sm" />)}
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                                {feedbackCount} of {totalPanel} feedback submitted
                            </span>
                        </div>
                        <div className="flex items-center text-sky-600 text-sm font-medium">
                            {isExpanded ? "Hide Feedback" : "View Feedback"}
                            <i className={`ri-arrow-down-s-line ml-1 text-lg transition-transform ${isExpanded ? "rotate-180" : ""}`}></i>
                        </div>
                    </button>

                    {isExpanded && (
                        <div className="px-5 pb-5 pt-2 space-y-4 animate-fade-in-down">
                            {panel.length === 0 ? (
                                <div className="text-center py-4 text-slate-400 italic text-sm">No panel members assigned yet.</div>
                            ) : (
                                panel.map((p) => (
                                    <div key={p.id} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                                        {/* Interviewer Header */}
                                        <div className="p-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                                            <div className="flex items-center gap-3">
                                                <Avatar user={p.interviewer} />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-sm font-bold text-slate-800">{p.interviewer?.full_name || "Unknown"}</div>
                                                        <RecommendationBadge value={p.recommendation} />
                                                    </div>
                                                    <div className="text-xs text-slate-500">{p.interviewer?.email}</div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <StatusBadge status={p.status} />
                                                {p.submitted_at && <span className="text-[10px] text-slate-400">Submitted {formatDate(p.submitted_at)}</span>}
                                            </div>
                                        </div>

                                        {p.status === 'submitted' ? (
                                            <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-6">
                                                {/* Left Column: Numeric Scores */}
                                                <div className="md:col-span-5 bg-slate-50 rounded-lg p-3 border border-slate-100 h-fit">
                                                    <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Scorecard</div>

                                                    <ScoreRow label="Communication" score={p.communication} />
                                                    <ScoreRow label="Technical Expertise" score={p.technical_expertise} />
                                                    <ScoreRow label="Functional Expertise" score={p.functional_expertise} />
                                                    <ScoreRow label="Cultural Fit" score={p.cultural_fit} />
                                                    <ScoreRow label="Leadership" score={p.leadership} />

                                                    <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center">
                                                        <span className="font-bold text-slate-700 text-sm">Overall Rating</span>
                                                        <div className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-bold text-sm border border-amber-200">
                                                            {Number(p.overall_rating || 0).toFixed(1)} / 5.0
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Column: Remarks */}
                                                <div className="md:col-span-7">
                                                    <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Remarks & Observations</div>
                                                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-white">
                                                        {p.remarks ? p.remarks : <span className="text-slate-400 italic">No written remarks provided.</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-sm text-slate-400 italic">
                                                Feedback pending submission.
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const ApplicantInterviewHistory = () => {
    const { requisitionId, applicationId } = useParams();
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setError("");
                const { data } = await api.get(`/requisitions/${requisitionId}/applicants/${applicationId}/interviews/`);
                if (!mounted) return;
                setItems(Array.isArray(data?.data) ? data.data : []);
            } catch (e) {
                if (!mounted) return;
                const msg = e?.response?.data?.message || e?.message || "Unable to load interview history.";
                setError(msg);
                Notify.error(msg);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [requisitionId, applicationId]);

    const sorted = useMemo(() => {
        return [...items].sort((a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0));
    }, [items]);

    if (loading) return <LoadingSpinner />;

    return (
        <Fragment>
            <PageHeader currentpage="Interview History" title="Interview History" activepage="Requisitions"
                        mainpage="Applicants"/>

            <div className="mb-6 flex items-center justify-between">
                <div className="flex gap-3">
                    {/* ✅ Back to Applicant Detail */}
                    <Link
                        to={`/module/requisition/${requisitionId}/applicants/${applicationId}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                    >
                        <i className="ri-arrow-left-line"></i> Back to Applicant
                    </Link>

                    {/* ✅ Back to Listing */}
                    <Link
                        to={`/module/requisition/${requisitionId}/applicants/`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                    >
                        <i className="ri-list-check-2"></i> Back to Listing
                    </Link>
                </div>

                {!error && (
                    <div
                        className="hidden md:flex items-center gap-4 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-sm text-slate-600">
            <span>
                Total: <strong className="text-slate-900">{sorted.length}</strong>
            </span>
                        <span className="w-px h-3 bg-slate-300"></span>
                        <span>
                Completed: <strong
                            className="text-slate-900">{sorted.filter(i => i.status === "completed").length}</strong>
            </span>
                    </div>
                )}
            </div>


            {error ? (
                <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3">
                    <i className="ri-error-warning-line text-xl"></i> {error}
                </div>
            ) : (
                <div className="max-w-5xl mx-auto mt-8">
                    {sorted.length > 0 ? (
                        sorted.map((iv, index) => <InterviewTimelineCard key={iv.id} interview={iv}
                                                                         isLast={index === sorted.length - 1}/>)
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                            <div
                                className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="ri-calendar-line text-3xl text-slate-300"></i>
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No interviews found</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mt-1">This applicant hasn't been scheduled for
                                any interviews yet.</p>
                        </div>
                    )}
                </div>
            )}
        </Fragment>
    );
};

export default ApplicantInterviewHistory;