import { useMemo, useState } from "react";
import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";
import { getBadgeClasses } from "@helpers/badges.js";

const isUrlInText = (text) => {
    if (!text) return null;
    const match = String(text).match(/https?:\/\/\S+/i);
    return match?.[0] || null;
};

const InterviewStatusBadge = ({ value }) => {
    const v = (value || "").toLowerCase();
    const fallback = {
        scheduled: "bg-primary/10 text-primary",
        rescheduled: "bg-warning/10 text-warning",
        cancelled: "bg-danger/10 text-danger",
        completed: "bg-success/10 text-success",
        no_show: "bg-gray-200 text-gray-700",
    };
    const cls = getBadgeClasses?.(v, "", false);
    return (
        <span className={cls || `badge !rounded-full ${fallback[v] || "bg-light text-default"}`}>
            {v ? toTitleCase(v.replaceAll("_", " ")) : "—"}
        </span>
    );
};

const Field = ({ label, children }) => (
    <div className="min-w-0">
        <div className="text-[0.75rem] text-gray-500">{label}</div>
        <div className="font-medium truncate">{children}</div>
    </div>
);

/* =========================
   ✅ Dynamic Feedback UI
========================= */

const prettyLabel = (k = "") =>
    toTitleCase(String(k).replaceAll("_", " ").replaceAll("-", " "));

const isEmptyValue = (v) =>
    v === null ||
    v === undefined ||
    (typeof v === "string" && v.trim() === "") ||
    (Array.isArray(v) && v.length === 0) ||
    (typeof v === "object" && !Array.isArray(v) && Object.keys(v || {}).length === 0);

const guessScaleMax = (n) => {
    if (n <= 5) return 5;
    if (n <= 10) return 10;
    if (n <= 100) return 100;
    return n;
};

const ScoreBar = ({ value }) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return <span className="text-gray-500">—</span>;

    const max = guessScaleMax(num);
    const pct = Math.max(0, Math.min(100, (num / max) * 100));

    return (
        <div className="flex items-center gap-3 min-w-[180px]">
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <div className="text-sm font-semibold tabular-nums w-[52px] text-right">
                {max === 100 ? `${num}` : `${num}/${max}`}
            </div>
        </div>
    );
};

const FeedbackValue = ({ value }) => {
    if (isEmptyValue(value)) return <span className="text-gray-500">—</span>;

    if (typeof value === "number") return <ScoreBar value={value} />;

    if (typeof value === "boolean") {
        return value ? (
            <span className="badge !rounded-full bg-success/10 text-success">Yes</span>
        ) : (
            <span className="badge !rounded-full bg-light text-default">No</span>
        );
    }

    if (Array.isArray(value)) {
        const cleaned = value.filter((x) => !isEmptyValue(x)).map((x) => String(x));
        return <span className="whitespace-pre-wrap">{cleaned.join(", ") || "—"}</span>;
    }

    if (typeof value === "object") {
        const entries = Object.entries(value || {}).filter(([, v]) => !isEmptyValue(v));
        if (!entries.length) return <span className="text-gray-500">—</span>;

        return (
            <div className="space-y-1">
                {entries.map(([k, v]) => (
                    <div key={k} className="flex gap-2 text-sm">
                        <span className="text-gray-500">{prettyLabel(k)}:</span>
                        <span className="font-medium">
                            {typeof v === "number" ? <ScoreBar value={v} /> : String(v)}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    return <span className="whitespace-pre-wrap">{String(value)}</span>;
};

const FeedbackPanel = ({ feedback }) => {
    if (!feedback || typeof feedback !== "object" || Array.isArray(feedback)) return null;

    const entries = Object.entries(feedback).filter(([, v]) => !isEmptyValue(v));
    if (!entries.length) return null;

    const noteKeys = new Set(["notes", "note", "comment", "remarks", "summary", "observation"]);
    const notesEntry = entries.find(([k]) => noteKeys.has(String(k).toLowerCase()));
    const notes = notesEntry ? notesEntry[1] : null;

    const metrics = entries.filter(([k]) => !noteKeys.has(String(k).toLowerCase()));

    return (
        <div className="col-span-12">
            <div className="text-[0.75rem] text-gray-500">Feedback</div>

            <div className="mt-1 p-3 rounded-md bg-light space-y-3">
                {notes ? (
                    <div className="bg-white/60 rounded-md p-3">
                        <div className="text-xs text-gray-500 mb-1">Notes</div>
                        <div className="text-sm whitespace-pre-wrap">{String(notes)}</div>
                    </div>
                ) : null}

                {metrics.length ? (
                    <div className="grid grid-cols-12 gap-3">
                        {metrics.map(([k, v]) => (
                            <div key={k} className="col-span-12 md:col-span-6">
                                <div className="text-xs text-gray-500 mb-1">{prettyLabel(k)}</div>
                                <div className="font-medium">
                                    <FeedbackValue value={v} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 text-sm">No scored feedback fields.</div>
                )}
            </div>
        </div>
    );
};

/* ========================= */

const ApplicantInterviewCard = ({ applicant }) => {
    const [showHistory, setShowHistory] = useState(false);

    const interviews = Array.isArray(applicant.interviews) ? applicant.interviews : [];

    const { latest, upcoming, sorted } = useMemo(() => {
        const sorted = [...interviews].sort((a, b) => {
            const da = new Date(a?.created_at || a?.scheduled_at || 0).getTime();
            const db = new Date(b?.created_at || b?.scheduled_at || 0).getTime();
            return db - da;
        });

        const latest = sorted[0] || null;

        const now = new Date();
        const upcoming =
            interviews
                .filter((x) => ["scheduled", "rescheduled"].includes((x?.status || "").toLowerCase()))
                .filter((x) => x?.scheduled_at && new Date(x.scheduled_at) >= now)
                .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0] || null;

        return { latest, upcoming, sorted };
    }, [interviews]);

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
        return (
            <span title={value} className="truncate inline-block max-w-[420px] align-middle">
                {value}
            </span>
        );
    };

    return (
        <div className="box">
            <div className="box-header justify-between flex items-center">
                <div className="box-title">Interview</div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                        Total: <span className="font-semibold">{interviews.length}</span>
                    </span>
                    <button
                        type="button"
                        className="ti-btn ti-btn-light !py-1 !px-2 !text-[0.75rem]"
                        onClick={() => setShowHistory((s) => !s)}
                        disabled={!interviews.length}
                        title="Toggle interview history"
                    >
                        {showHistory ? "Hide History" : "View History"}
                    </button>
                </div>
            </div>

            <div className="box-body space-y-4">
                {/* ✅ Overview */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-4">
                        <Field label="Applicant Status">
                            {toTitleCase((applicant.status || "").replaceAll("_", " "))}
                        </Field>
                    </div>

                    <div className="col-span-12 md:col-span-4">
                        <Field label="Shortlisted">
                            {applicant.is_shortlisted ? (
                                <span className="badge !rounded-full bg-success/10 text-success">Yes</span>
                            ) : (
                                <span className="badge !rounded-full bg-light text-default">No</span>
                            )}
                        </Field>
                    </div>

                    <div className="col-span-12 md:col-span-4">
                        <Field label="Applicant Rating">{applicant.rating ?? "—"}</Field>
                    </div>
                </div>

                {/* ✅ Upcoming */}
                <div className="p-4 rounded-md bg-light space-y-2">
                    <div className="font-semibold">Upcoming Interview</div>
                    {upcoming ? (
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 md:col-span-3">
                                <Field label="Status">
                                    <InterviewStatusBadge value={upcoming.status} />
                                </Field>
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <Field label="Scheduled At">{formatDate(upcoming.scheduled_at) || "—"}</Field>
                            </div>
                            <div className="col-span-12 md:col-span-2">
                                <Field label="Round">
                                    {upcoming.round ? toTitleCase(upcoming.round.replaceAll("_", " ")) : "—"}
                                </Field>
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <Field label="Type">
                                    {upcoming.interview_type ? toTitleCase(upcoming.interview_type) : "—"}
                                </Field>
                            </div>

                            <div className="col-span-12 md:col-span-6">
                                <Field label="Interviewer">{upcoming.interviewer || "—"}</Field>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Field label="Scheduled By">{upcoming.scheduled_by || "—"}</Field>
                            </div>

                            <div className="col-span-12">
                                <div className="text-[0.75rem] text-gray-500">Location / Link</div>
                                <div className="mt-1">{renderLinkOrText(upcoming.link_or_location)}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500">No upcoming interview.</div>
                    )}
                </div>

                {/* ✅ Latest */}
                <div className="p-4 rounded-md border space-y-2">
                    <div className="font-semibold">Latest Interview</div>

                    {latest ? (
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 md:col-span-3">
                                <Field label="Status">
                                    <InterviewStatusBadge value={latest.status} />
                                </Field>
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <Field label="Scheduled At">{formatDate(latest.scheduled_at) || "—"}</Field>
                            </div>
                            <div className="col-span-12 md:col-span-2">
                                <Field label="Outcome">{latest.outcome ? toTitleCase(latest.outcome) : "—"}</Field>
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <Field label="Interviewer Rating">{latest.interviewer_rating ?? "—"}</Field>
                            </div>

                            <div className="col-span-12 md:col-span-6">
                                <Field label="Interviewer">{latest.interviewer || "—"}</Field>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Field label="Scheduled By">{latest.scheduled_by || "—"}</Field>
                            </div>

                            {latest.interviewer_notes ? (
                                <div className="col-span-12">
                                    <div className="text-[0.75rem] text-gray-500">Notes</div>
                                    <div className="whitespace-pre-wrap mt-1 text-sm">{latest.interviewer_notes}</div>
                                </div>
                            ) : null}

                            {/* ✅ Pretty dynamic feedback (NO JSON) */}
                            <FeedbackPanel feedback={latest.feedback} />
                        </div>
                    ) : (
                        <div className="text-gray-500">No interview history.</div>
                    )}
                </div>

                {/* ✅ Internal notes */}
                {applicant.internal_notes ? (
                    <div className="p-4 rounded-md bg-light">
                        <div className="font-semibold mb-1">Internal Notes</div>
                        <div className="whitespace-pre-wrap text-sm">{applicant.internal_notes}</div>
                    </div>
                ) : null}

                {/* ✅ Collapsible History */}
                {showHistory ? (
                    <div className="pt-2">
                        <div className="font-semibold mb-2">Interview History</div>

                        {sorted.length ? (
                            <div className="table-responsive">
                                <table className="table whitespace-nowrap min-w-full">
                                    <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Scheduled</th>
                                        <th>Round</th>
                                        <th>Type</th>
                                        <th>Interviewer</th>
                                        <th>Outcome</th>
                                        <th>Rating</th>
                                        <th>Cancelled</th>
                                        <th>Reason</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {sorted.map((iv) => (
                                        <tr key={iv.id}>
                                            <td><InterviewStatusBadge value={iv.status} /></td>
                                            <td>{formatDate(iv.scheduled_at) || "—"}</td>
                                            <td>{iv.round ? toTitleCase(iv.round.replaceAll("_", " ")) : "—"}</td>
                                            <td>{iv.interview_type ? toTitleCase(iv.interview_type) : "—"}</td>
                                            <td>{iv.interviewer || "—"}</td>
                                            <td>{iv.outcome ? toTitleCase(iv.outcome) : "—"}</td>
                                            <td>{iv.interviewer_rating ?? "—"}</td>
                                            <td>{formatDate(iv.cancelled_at) || "—"}</td>
                                            <td className="truncate max-w-[240px]" title={iv.cancel_reason || ""}>
                                                {iv.cancel_reason || "—"}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-gray-500">No interviews added yet.</div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default ApplicantInterviewCard;
