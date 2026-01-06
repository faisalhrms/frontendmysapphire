import { useMemo, useState } from "react";
import Avatar from "@components/Avatar.jsx";
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

const renderUserMini = (userObj) => {
    if (!userObj) return <span className="text-gray-500">—</span>;
    return (
        <div className="flex items-center gap-2 min-w-0">
            <Avatar
                avatar={userObj.avatar || null}
                full_name={userObj.full_name || "—"}
                size="sm"
                parentClasses="bg-primary/10 !fill-primary"
            />
            <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{userObj.full_name || "—"}</div>
                <div className="text-xs text-[#8c9097] dark:text-white/50 truncate">{userObj.email || "—"}</div>
            </div>
        </div>
    );
};

const PanelStatusBadge = ({ value }) => {
    const v = String(value || "").toLowerCase();
    const map = {
        submitted: "bg-success/10 text-success",
        pending: "bg-warning/10 text-warning",
    };
    return <span className={`badge !rounded-full ${map[v] || "bg-light text-default"}`}>{v ? v.toUpperCase() : "—"}</span>;
};

const PanelTable = ({ interview }) => {
    const panel = Array.isArray(interview?.panel) ? interview.panel : [];
    if (!panel.length) return <div className="text-gray-500">No panel assigned.</div>;

    const total = interview?.total_interviewers ?? panel.length;
    const pending = interview?.pending_feedback_count ?? panel.filter((p) => String(p?.status || "pending").toLowerCase() !== "submitted").length;

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold">Panel: {total} • Pending: {pending}</span>
                {interview?.all_feedback_submitted ? (
                    <span className="badge !rounded-full bg-success/10 text-success">ALL SUBMITTED</span>
                ) : (
                    <span className="badge !rounded-full bg-warning/10 text-warning">IN PROGRESS</span>
                )}
            </div>

            <div className="table-responsive">
                <table className="table whitespace-nowrap min-w-full">
                    <thead>
                    <tr>
                        <th>Interviewer</th>
                        <th>Status</th>
                        <th>Submitted At</th>
                    </tr>
                    </thead>
                    <tbody>
                    {panel.map((p, idx) => (
                        <tr key={`${p?.interviewer_id || idx}`}>
                            <td className="!ps-4">{renderUserMini(p?.interviewer)}</td>
                            <td><PanelStatusBadge value={p?.status} /></td>
                            <td>{p?.submitted_at ? formatDate(p.submitted_at) : "—"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ===== Optional: your dynamic feedback UI stays compatible ===== */
const prettyLabel = (k = "") => toTitleCase(String(k).replaceAll("_", " ").replaceAll("-", " "));
const isEmptyValue = (v) =>
    v === null ||
    v === undefined ||
    (typeof v === "string" && v.trim() === "") ||
    (Array.isArray(v) && v.length === 0) ||
    (typeof v === "object" && !Array.isArray(v) && Object.keys(v || {}).length === 0);

const FeedbackPanel = ({ feedback }) => {
    if (!feedback || typeof feedback !== "object" || Array.isArray(feedback)) return null;
    const entries = Object.entries(feedback).filter(([, v]) => !isEmptyValue(v));
    if (!entries.length) return null;

    return (
        <div className="col-span-12">
            <div className="text-[0.75rem] text-gray-500">Feedback</div>
            <div className="mt-1 p-3 rounded-md bg-light space-y-2">
                {entries.map(([k, v]) => (
                    <div key={k} className="flex gap-2 text-sm">
                        <span className="text-gray-500">{prettyLabel(k)}:</span>
                        <span className="font-medium whitespace-pre-wrap">{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
/* =============================================== */

const ApplicantInterviewCard = ({ applicant }) => {
    const [showHistory, setShowHistory] = useState(false);

    const interviews = Array.isArray(applicant.interviews) ? applicant.interviews : [];

    const { active, upcoming, latestCompleted, sorted } = useMemo(() => {
        const sorted = [...interviews].sort((a, b) => {
            const da = new Date(a?.created_at || a?.scheduled_at || 0).getTime();
            const db = new Date(b?.created_at || b?.scheduled_at || 0).getTime();
            return db - da;
        });

        const now = new Date();

        // ✅ Active interview = scheduled/rescheduled (even if time passed) - prioritize ones with pending feedback
        const activeCandidates = interviews
            .filter((x) => ["scheduled", "rescheduled"].includes(String(x?.status || "").toLowerCase()))
            .sort((a, b) => {
                const ap = (a?.pending_feedback_count ?? 0) > 0 ? 0 : 1;
                const bp = (b?.pending_feedback_count ?? 0) > 0 ? 0 : 1;
                if (ap !== bp) return ap - bp;

                const da = new Date(a?.created_at || a?.scheduled_at || 0).getTime();
                const db = new Date(b?.created_at || b?.scheduled_at || 0).getTime();
                return db - da;
            });

        const active = activeCandidates[0] || null;

        // ✅ Upcoming = future scheduled/rescheduled (nearest)
        const upcoming =
            interviews
                .filter((x) => ["scheduled", "rescheduled"].includes(String(x?.status || "").toLowerCase()))
                .filter((x) => x?.scheduled_at && new Date(x.scheduled_at) >= now)
                .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0] || null;

        // ✅ Latest Completed = most recent completed
        const latestCompleted =
            interviews
                .filter((x) => String(x?.status || "").toLowerCase() === "completed")
                .sort((a, b) => {
                    const da = new Date(a?.completed_at || a?.created_at || a?.scheduled_at || 0).getTime();
                    const db = new Date(b?.completed_at || b?.created_at || b?.scheduled_at || 0).getTime();
                    return db - da;
                })[0] || null;

        return { active, upcoming, latestCompleted, sorted };
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

    const RoundText = (round) => (round ? toTitleCase(String(round).replaceAll("_", " ")) : "—");

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

                {/* ✅ Active Interview (important for your case like id=66 pending feedback) */}
                <div className="p-4 rounded-md bg-light space-y-2">
                    <div className="font-semibold">Active Interview</div>
                    {active ? (
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 md:col-span-3">
                                <Field label="Status"><InterviewStatusBadge value={active.status} /></Field>
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <Field label="Scheduled At">{formatDate(active.scheduled_at) || "—"}</Field>
                            </div>
                            <div className="col-span-12 md:col-span-2">
                                <Field label="Round">{RoundText(active.round)}</Field>
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <Field label="Type">{active.interview_type ? toTitleCase(active.interview_type) : "—"}</Field>
                            </div>

                            <div className="col-span-12 md:col-span-6">
                                <Field label="Scheduled By">{renderUserMini(active.scheduled_by)}</Field>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Field label="Feedback">{active.all_feedback_submitted ? "All Submitted" : `Pending: ${active.pending_feedback_count ?? "—"}`}</Field>
                            </div>

                            <div className="col-span-12">
                                <div className="text-[0.75rem] text-gray-500">Location / Link</div>
                                <div className="mt-1">{renderLinkOrText(active.link_or_location)}</div>
                            </div>

                            <div className="col-span-12">
                                <PanelTable interview={active} />
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500">No active interview.</div>
                    )}
                </div>

                {/* ✅ Upcoming (future) */}
                <div className="p-4 rounded-md border space-y-2">
                    <div className="font-semibold">Next Upcoming Interview</div>
                    {upcoming ? (
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 md:col-span-3">
                                <Field label="Status"><InterviewStatusBadge value={upcoming.status} /></Field>
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <Field label="Scheduled At">{formatDate(upcoming.scheduled_at) || "—"}</Field>
                            </div>
                            <div className="col-span-12 md:col-span-2">
                                <Field label="Round">{RoundText(upcoming.round)}</Field>
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <Field label="Type">{upcoming.interview_type ? toTitleCase(upcoming.interview_type) : "—"}</Field>
                            </div>

                            <div className="col-span-12 md:col-span-6">
                                <Field label="Scheduled By">{renderUserMini(upcoming.scheduled_by)}</Field>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Field label="Feedback">{upcoming.all_feedback_submitted ? "All Submitted" : `Pending: ${upcoming.pending_feedback_count ?? "—"}`}</Field>
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

                {/* ✅ Latest Completed (your feedback/outcome/rating can show here if serializer returns them) */}
                <div className="p-4 rounded-md border space-y-2">
                    <div className="font-semibold">Latest Completed Interview</div>

                    {latestCompleted ? (
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 md:col-span-3">
                                <Field label="Status"><InterviewStatusBadge value={latestCompleted.status} /></Field>
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <Field label="Completed At">{latestCompleted.completed_at ? formatDate(latestCompleted.completed_at) : "—"}</Field>
                            </div>
                            <div className="col-span-12 md:col-span-2">
                                <Field label="Round">{RoundText(latestCompleted.round)}</Field>
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <Field label="Type">{latestCompleted.interview_type ? toTitleCase(latestCompleted.interview_type) : "—"}</Field>
                            </div>

                            <div className="col-span-12 md:col-span-6">
                                <Field label="Scheduled By">{renderUserMini(latestCompleted.scheduled_by)}</Field>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Field label="Feedback">{latestCompleted.all_feedback_submitted ? "All Submitted" : `Pending: ${latestCompleted.pending_feedback_count ?? "—"}`}</Field>
                            </div>

                            {/* Optional fields if your API returns them */}
                            {latestCompleted.outcome ? (
                                <div className="col-span-12 md:col-span-4">
                                    <Field label="Outcome">{toTitleCase(latestCompleted.outcome)}</Field>
                                </div>
                            ) : null}
                            {latestCompleted.interviewer_rating != null ? (
                                <div className="col-span-12 md:col-span-4">
                                    <Field label="Interviewer Rating">{latestCompleted.interviewer_rating}</Field>
                                </div>
                            ) : null}

                            {latestCompleted.interviewer_notes ? (
                                <div className="col-span-12">
                                    <div className="text-[0.75rem] text-gray-500">Notes</div>
                                    <div className="whitespace-pre-wrap mt-1 text-sm">{latestCompleted.interviewer_notes}</div>
                                </div>
                            ) : null}

                            {/* Optional feedback object if serializer returns it */}
                            <FeedbackPanel feedback={latestCompleted.feedback} />

                            <div className="col-span-12">
                                <PanelTable interview={latestCompleted} />
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500">No completed interview yet.</div>
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
                                        <th>Scheduled By</th>
                                        <th>Pending</th>
                                        <th>Completed</th>
                                        <th>Cancelled</th>
                                        <th>Reason</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {sorted.map((iv) => (
                                        <tr key={iv.id}>
                                            <td><InterviewStatusBadge value={iv.status} /></td>
                                            <td>{formatDate(iv.scheduled_at) || "—"}</td>
                                            <td>{RoundText(iv.round)}</td>
                                            <td>{iv.interview_type ? toTitleCase(iv.interview_type) : "—"}</td>
                                            <td className="!ps-4">{renderUserMini(iv.scheduled_by)}</td>
                                            <td>{iv.all_feedback_submitted ? "0" : (iv.pending_feedback_count ?? "—")}</td>
                                            <td>{iv.completed_at ? formatDate(iv.completed_at) : "—"}</td>
                                            <td>{iv.cancelled_at ? formatDate(iv.cancelled_at) : "—"}</td>
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
