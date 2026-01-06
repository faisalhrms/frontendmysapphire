import { Fragment, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import Notify from "@helpers/toastNotifications.js";
import api from "../../../config/axiosConfig.js";
import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";
import { getBadgeClasses } from "@helpers/badges.js";

const prettyLabel = (k = "") => toTitleCase(String(k).replaceAll("_", " ").replaceAll("-", " "));

const isEmptyValue = (v) =>
    v === null ||
    v === undefined ||
    (typeof v === "string" && v.trim() === "") ||
    (Array.isArray(v) && v.length === 0) ||
    (typeof v === "object" && !Array.isArray(v) && Object.keys(v || {}).length === 0);

const isUrlInText = (text) => {
    if (!text) return null;
    const match = String(text).match(/https?:\/\/\S+/i);
    return match?.[0] || null;
};

const formatRound = (value) => {
    if (!value) return "—";
    const v = String(value).toLowerCase();
    const m = v.match(/^round_(\d+)$/);
    if (m) return `Round ${m[1]}`;
    return toTitleCase(String(value).replaceAll("_", " "));
};

const renderLinkOrText = (value) => {
    if (!value) return "—";
    const url = isUrlInText(value);
    if (url) {
        return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                Open Link
            </a>
        );
    }
    return <span className="break-words">{value}</span>;
};

const UserLine = ({ user }) => {
    if (!user) return <span>—</span>;
    return (
        <span>
            {user?.full_name || "—"}{" "}
            <span className="text-gray-500 text-sm">({user?.email || "—"})</span>
        </span>
    );
};

const FeedbackView = ({ feedback }) => {
    if (!feedback || typeof feedback !== "object" || Array.isArray(feedback)) return null;

    const entries = Object.entries(feedback).filter(([, v]) => !isEmptyValue(v));
    if (!entries.length) return null;

    const noteKeys = new Set(["notes", "note", "comment", "remarks", "summary", "observation"]);
    const notesEntry = entries.find(([k]) => noteKeys.has(String(k).toLowerCase()));
    const notes = notesEntry ? notesEntry[1] : null;

    const metrics = entries.filter(([k]) => !noteKeys.has(String(k).toLowerCase()));

    const renderVal = (v) => {
        if (isEmptyValue(v)) return "—";
        if (typeof v === "object") {
            // pretty-ish object display (rubric etc.)
            const pairs = Object.entries(v || {});
            return pairs.length ? pairs.map(([kk, vv]) => `${prettyLabel(kk)}: ${vv}`).join(", ") : "—";
        }
        return String(v);
    };

    return (
        <div className="mt-3 rounded-md bg-light p-3 space-y-2">
            {notes ? (
                <div className="bg-white/60 rounded-md p-3">
                    <div className="text-xs text-gray-500 mb-1">Notes</div>
                    <div className="text-sm whitespace-pre-wrap">{String(notes)}</div>
                </div>
            ) : null}

            {metrics.length ? (
                <div className="grid grid-cols-12 gap-2">
                    {metrics.map(([k, v]) => (
                        <div key={k} className="col-span-12 md:col-span-6">
                            <div className="text-xs text-gray-500">{prettyLabel(k)}</div>
                            <div className="font-medium text-sm whitespace-pre-wrap">{renderVal(v)}</div>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

const PanelStatusBadge = ({ value }) => {
    const v = String(value || "").toLowerCase();
    const cls =
        v === "submitted"
            ? "badge !rounded-full bg-success/10 text-success"
            : v === "pending"
                ? "badge !rounded-full bg-warning/10 text-warning"
                : "badge !rounded-full bg-light text-default";
    return <span className={cls}>{v ? v.toUpperCase() : "—"}</span>;
};

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
                setItems([]);
                Notify.error(msg);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [requisitionId, applicationId]);

    const sorted = useMemo(() => {
        return [...items].sort((a, b) => {
            const da = new Date(a?.created_at || a?.scheduled_at || 0).getTime();
            const db = new Date(b?.created_at || b?.scheduled_at || 0).getTime();
            return db - da;
        });
    }, [items]);

    if (loading) return <LoadingSpinner />;

    return (
        <Fragment>
            <PageHeader currentpage="Interview History" title="Interview History" activepage="Requisitions" mainpage="Applicants" />

            <div className="mb-4 flex gap-2">
                <Link
                    to={`/module/requisition/${requisitionId}/applicants/${applicationId}`}
                    className="ti-btn ti-btn-secondary !py-1 !px-2 !text-[0.75rem]"
                >
                    <i className="ri-arrow-left-line align-middle me-1" /> Back
                </Link>

                <Link
                    to={`/module/requisition/${requisitionId}/applicants`}
                    className="ti-btn ti-btn-light !py-1 !px-2 !text-[0.75rem]"
                >
                    Back to Applicants
                </Link>
            </div>

            {error ? (
                <div className="box">
                    <div className="box-body">
                        <p className="text-danger">{error}</p>
                    </div>
                </div>
            ) : null}

            <div className="box">
                <div className="box-header justify-between flex items-center">
                    <div className="box-title">Interviews</div>
                    <div className="text-xs text-gray-500">
                        Total: <span className="font-semibold">{sorted.length}</span>
                    </div>
                </div>

                <div className="box-body">
                    {sorted.length ? (
                        <div className="space-y-4">
                            {sorted.map((iv) => {
                                const panel = Array.isArray(iv?.panel) ? iv.panel : [];
                                const statusText = toTitleCase(String(iv.status || "").replaceAll("_", " "));
                                const total = typeof iv?.total_interviewers === "number" ? iv.total_interviewers : panel.length;
                                const pending =
                                    typeof iv?.pending_feedback_count === "number"
                                        ? iv.pending_feedback_count
                                        : panel.filter((p) => String(p?.status || "pending").toLowerCase() !== "submitted").length;

                                return (
                                    <div key={iv.id} className="border rounded-md p-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={getBadgeClasses(iv.status)}>{statusText}</span>
                                                <span className="text-sm text-gray-500">{formatDate(iv.scheduled_at) || "—"}</span>

                                                <span className="badge !rounded-full bg-light text-default">
                                                    Panel: {total} • Pending: {pending}
                                                </span>

                                                {iv?.all_feedback_submitted ? (
                                                    <span className="badge !rounded-full bg-success/10 text-success">ALL SUBMITTED</span>
                                                ) : (
                                                    <span className="badge !rounded-full bg-warning/10 text-warning">IN PROGRESS</span>
                                                )}
                                            </div>

                                            <div className="text-sm text-gray-500">
                                                #{iv.id} • {formatRound(iv.round)} • {iv.interview_type ? toTitleCase(iv.interview_type) : "—"}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-12 gap-4 mt-3">
                                            <div className="col-span-12 md:col-span-6">
                                                <div className="text-xs text-gray-500">Scheduled By</div>
                                                <div className="font-medium">
                                                    <UserLine user={iv?.scheduled_by} />
                                                </div>
                                            </div>

                                            <div className="col-span-12 md:col-span-6">
                                                <div className="text-xs text-gray-500">Duration / Timezone</div>
                                                <div className="font-medium">
                                                    {iv?.duration_minutes ? `${iv.duration_minutes} min` : "—"} • {iv?.timezone || "—"}
                                                </div>
                                            </div>

                                            <div className="col-span-12">
                                                <div className="text-xs text-gray-500">Link / Location</div>
                                                <div className="font-medium">{renderLinkOrText(iv.link_or_location)}</div>
                                            </div>

                                            <div className="col-span-12 md:col-span-3">
                                                <div className="text-xs text-gray-500">Completed At</div>
                                                <div className="font-medium">{formatDate(iv.completed_at) || "—"}</div>
                                            </div>

                                            <div className="col-span-12 md:col-span-3">
                                                <div className="text-xs text-gray-500">Cancelled At</div>
                                                <div className="font-medium">{formatDate(iv.cancelled_at) || "—"}</div>
                                            </div>

                                            <div className="col-span-12 md:col-span-6">
                                                <div className="text-xs text-gray-500">Rescheduled From</div>
                                                <div className="font-medium">{iv?.rescheduled_from_id ? `#${iv.rescheduled_from_id}` : "—"}</div>
                                            </div>

                                            {iv.cancel_reason ? (
                                                <div className="col-span-12">
                                                    <div className="text-xs text-gray-500">Cancel Reason</div>
                                                    <div className="font-medium">{iv.cancel_reason}</div>
                                                </div>
                                            ) : null}

                                            {/* ✅ PANEL (this is where outcome/notes/rating/feedback live now) */}
                                            <div className="col-span-12">
                                                <div className="text-xs text-gray-500 mb-2">Panel Feedback</div>

                                                {panel.length ? (
                                                    <div className="space-y-3">
                                                        {panel.map((p) => (
                                                            <div key={p.id} className="rounded-md border p-3">
                                                                <div className="flex flex-wrap items-start justify-between gap-2">
                                                                    <div>
                                                                        <div className="font-semibold">
                                                                            {p?.interviewer?.full_name || "—"}{" "}
                                                                            <span className="text-gray-500 text-sm">
                                                                                ({p?.interviewer?.email || "—"})
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 mt-1">
                                                                            Submitted At: {p?.submitted_at ? formatDate(p.submitted_at) : "—"}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        <PanelStatusBadge value={p?.status} />
                                                                        {p?.outcome ? (
                                                                            <span className="badge !rounded-full bg-primary/10 text-primary">
                                                                                {toTitleCase(p.outcome)}
                                                                            </span>
                                                                        ) : null}
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-12 gap-3 mt-3">
                                                                    <div className="col-span-12 md:col-span-3">
                                                                        <div className="text-xs text-gray-500">Rating</div>
                                                                        <div className="font-medium">{p?.interviewer_rating ?? "—"}</div>
                                                                    </div>

                                                                    <div className="col-span-12 md:col-span-9">
                                                                        <div className="text-xs text-gray-500">Interviewer Notes</div>
                                                                        <div className="font-medium whitespace-pre-wrap">
                                                                            {p?.interviewer_notes ? p.interviewer_notes : "—"}
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-span-12">
                                                                        <FeedbackView feedback={p?.feedback} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-500">No panel assigned.</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-gray-500">No interviews found.</div>
                    )}
                </div>
            </div>
        </Fragment>
    );
};

export default ApplicantInterviewHistory;
