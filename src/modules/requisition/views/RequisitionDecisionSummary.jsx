import { Fragment, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import Avatar from "@components/Avatar.jsx";

import { useRequisitionDecisionSummary } from "@modules/requisition/hooks/requisitionHooks.js";
import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";
import { getBadgeClasses } from "@helpers/badges.js";

// -------------------------
// Helpers
// -------------------------
const StatusBadge = ({ status, extra = null }) => (
    <div className="flex items-center gap-2 flex-wrap">
    <span
        className={`${getBadgeClasses(
            status
        )} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm`}
    >
      {toTitleCase(String(status || "").replaceAll("_", " "))}
    </span>
        {extra}
    </div>
);

const MetricCard = ({ label, value, icon, hint, tone = "slate" }) => {
    const toneMap = {
        slate: "bg-slate-50 text-slate-700 border-slate-100",
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
        amber: "bg-amber-50 text-amber-700 border-amber-100",
        rose: "bg-rose-50 text-rose-700 border-rose-100",
    };

    const toneCls = toneMap[tone] || toneMap.slate;

    return (
        <div className={`p-4 rounded-xl border ${toneCls}`}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-70">
                        {label}
                    </div>
                    <div className="mt-1 text-xl font-black tracking-tight">
                        {value ?? "—"}
                    </div>
                    {hint ? (
                        <div className="mt-1 text-[11px] font-semibold opacity-70">{hint}</div>
                    ) : null}
                </div>
                {icon ? (
                    <div className="p-2 rounded-lg bg-white/60 border border-white/80">
                        <i className={`${icon} text-lg`} />
                    </div>
                ) : null}
            </div>
        </div>
    );
};

const CompetencyBar = ({ label, value }) => {
    const pct = value != null ? Math.max(0, Math.min(100, (Number(value) / 5) * 100)) : 0;

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </span>
                <span className="text-[10px] font-black text-slate-700">
          {value != null ? Number(value).toFixed(1) : "—"} / 5
        </span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary/70 rounded-full"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

const RoundRow = ({ r }) => {
    const recommended = r?.recommendations?.recommended ?? 0;
    const notRecommended = r?.recommendations?.not_recommended ?? 0;

    return (
        <tr className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
            <td className="py-3 px-3">
                <div className="font-black text-slate-800 text-sm">{r?.label}</div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest">
                    {String(r?.round || "").replaceAll("_", " ")}
                </div>
            </td>

            <td className="py-3 px-3 text-[12px] text-slate-600 font-semibold">
                {r?.scheduled_at ? formatDate(r.scheduled_at) : "—"}
            </td>

            <td className="py-3 px-3 text-[12px] text-slate-600 font-semibold">
                {r?.completed_at ? formatDate(r.completed_at) : "—"}
            </td>

            <td className="py-3 px-3">
        <span className="text-[12px] font-black text-slate-800">
          {r?.avg_rating != null ? Number(r.avg_rating).toFixed(2) : "—"}
        </span>
            </td>

            <td className="py-3 px-3">
                <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-[10px] font-black">
            REC {recommended}
          </span>
                    <span className="bg-rose-50 border border-rose-100 text-rose-700 px-2 py-1 rounded-lg text-[10px] font-black">
            NOT {notRecommended}
          </span>
                </div>
            </td>

            <td className="py-3 px-3">
                {r?.pending_feedback > 0 ? (
                    <span className="bg-amber-50 border border-amber-100 text-amber-700 px-2 py-1 rounded-lg text-[10px] font-black">
            PENDING {r.pending_feedback}
          </span>
                ) : (
                    <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-[10px] font-black">
            ALL DONE
          </span>
                )}
            </td>

            <td className="py-3 px-3">
        <span
            className={`${getBadgeClasses(
                r?.status
            )} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider`}
        >
          {toTitleCase(String(r?.status || "").replaceAll("_", " "))}
        </span>
            </td>
        </tr>
    );
};

// -------------------------
// Main Component
// -------------------------
const RequisitionDecisionSummary = () => {
    const { requisitionId, applicationId } = useParams();
    const navigate = useNavigate();

    const { summary, loading, error } = useRequisitionDecisionSummary(
        requisitionId,
        applicationId
    );



    const app = summary?.application;
    const req = summary?.requisition;
    const rounds = Array.isArray(summary?.interview_rounds) ? summary.interview_rounds : [];
    const metrics = summary?.metrics || {};
    const ready = Boolean(summary?.ready_for_decision);

    const sortedRounds = useMemo(() => {
        const roundNum = (r) => {
            const m = String(r?.round || "").match(/round_(\d+)/i);
            return m ? Number(m[1]) : 0;
        };
        return [...rounds].sort((a, b) => roundNum(a) - roundNum(b));
    }, [rounds]);

    if (loading) return <LoadingSpinner />;

    if (error || !summary || !app || !req) {
        return (
            <div className="p-20 text-center bg-white m-6 rounded-xl border border-dashed border-slate-300">
                <i className="ri-error-warning-line text-4xl text-slate-300 mb-4 block" />
                <h3 className="text-lg font-bold text-slate-700">Decision Summary Unavailable</h3>
                <p className="text-slate-500 text-sm mb-6">
                    {error || "The requested summary could not be retrieved from the server."}
                </p>
                <button onClick={() => navigate(-1)} className="ti-btn ti-btn-primary" type="button">
                    Go Back
                </button>
            </div>
        );
    }

    const rec = metrics?.recommendations || {};
    const avgBy = metrics?.avg_by_competency || {};

    return (
        <Fragment>
            <PageHeader
                currentpage="Decision Summary"
                title="Talent Acquisition"
                activepage="ATS"
                mainpage="Recruitment"
            />

            {/* TOP HEADER */}
            <div className="bg-white border border-slate-200 rounded-xl px-6 py-5 mb-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <Avatar
                            full_name={app.full_name}
                            size="xl"
                            parentClasses="bg-primary/10 !text-primary border-2 border-primary/20 shadow-md ring-4 ring-white"
                        />
                        <div>
                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                                    {app.full_name}
                                </h1>

                                <StatusBadge
                                    status={app.status}
                                    extra={
                                        ready ? (
                                            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        Ready For Decision
                      </span>
                                        ) : (
                                            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        Feedback Pending
                      </span>
                                        )
                                    }
                                />
                            </div>

                            <div className="flex items-center gap-3 text-sm font-medium text-slate-500 flex-wrap">
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold text-[11px]">
                  {req?.req_no}
                </span>
                                <span className="truncate max-w-[380px] text-slate-700 font-bold">
                  {req?.position_title}
                </span>
                                <span className="text-slate-300">|</span>
                                <span className="italic text-slate-400">
                  Applied on {formatDate(app.created_at)}
                </span>
                            </div>

                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-[10px] font-black text-slate-700 uppercase tracking-widest">
                  {toTitleCase(req?.employment_type)}
                </span>
                                <span className="bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-[10px] font-black text-slate-700 uppercase tracking-widest">
                  {toTitleCase(req?.work_mode)}
                </span>
                                <span className="bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-[10px] font-black text-slate-700 uppercase tracking-widest">
                  {toTitleCase(req?.designation)}
                </span>
                                <span className="bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-[10px] font-black text-slate-700 uppercase tracking-widest">
                  {toTitleCase(req?.location)}
                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="ti-btn ti-btn-outline-light !text-slate-500 hover:!bg-slate-100 transition-all"
                            type="button"
                        >
                            <i className="ri-arrow-left-line me-1" /> Back
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/module/requisition/${requisitionId}/applicants/${applicationId}/interviews`
                                )
                            }
                            className="ti-btn ti-btn-primary"
                        >
                            <i className="ri-history-line me-1" /> View Detailed History
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 pb-24">
                {/* LEFT: Applicant quick info + resume */}
                <div className="xl:col-span-3 col-span-12 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                Applicant Info
                            </h3>
                        </div>

                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <i className="ri-mail-line text-slate-400" />
                                <span className="text-xs font-bold text-slate-700 truncate">{app.email}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <i className="ri-smartphone-line text-slate-400" />
                                <span className="text-xs font-bold text-slate-700">{app.mobile_number}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <i className="ri-map-pin-2-line text-slate-400" />
                                <span className="text-xs font-bold text-slate-700">{app.city || "—"}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <i className="ri-fingerprint-line text-slate-400" />
                                <span className="text-xs font-bold text-slate-700">{app.cnic_number || "—"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-5 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10">
                            <i className="ri-file-pdf-fill text-8xl" />
                        </div>

                        <h3 className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-4">
                            Candidate Assets
                        </h3>

                        <div className="space-y-3 relative z-10">
                            {app.resume_url ? (
                                <a
                                    href={app.resume_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <i className="ri-file-pdf-fill text-rose-400 text-xl" />
                                        <span className="text-sm font-bold">Resume / CV</span>
                                    </div>
                                    <i className="ri-external-link-line opacity-40 group-hover:opacity-100" />
                                </a>
                            ) : (
                                <div className="p-3 bg-white/10 border border-white/10 rounded-lg text-xs opacity-70">
                                    No resume uploaded.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* CENTER: Metrics + rounds table */}
                <div className="xl:col-span-6 col-span-12 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <MetricCard
                            label="Avg Overall Rating"
                            value={metrics?.avg_overall_rating != null ? Number(metrics.avg_overall_rating).toFixed(2) : "—"}
                            icon="ri-star-line"
                            tone="indigo"
                            hint={`${metrics?.completed_rounds || 0}/4 rounds completed`}
                        />
                        <MetricCard
                            label="AI Score"
                            value={app?.ai_score != null ? `${Number(app.ai_score).toFixed(2)}` : "—"}
                            icon="ri-ai-generate"
                            tone="emerald"
                            hint={app?.ai_shortlisted ? "AI Shortlisted" : "AI Not Shortlisted"}
                        />
                        <MetricCard
                            label="Pending Feedback"
                            value={metrics?.pending_feedback_total ?? 0}
                            icon="ri-chat-check-line"
                            tone={(metrics?.pending_feedback_total ?? 0) > 0 ? "amber" : "emerald"}
                            hint={ready ? "Decision can be taken" : "Collect remaining feedback"}
                        />
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <span className="p-2 bg-slate-50 rounded-lg text-slate-700 border border-slate-100">
                  <i className="ri-bar-chart-line" />
                </span>
                                Decision Snapshot
                            </h3>

                            <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Recommended {rec?.recommended ?? 0}
                </span>
                                <span className="bg-rose-50 border border-rose-100 text-rose-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Not Recommended {rec?.not_recommended ?? 0}
                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <MetricCard
                                label="Openings"
                                value={req?.openings ?? "—"}
                                icon="ri-group-line"
                                tone="slate"
                                hint={`${toTitleCase(req?.location)} • ${toTitleCase(req?.work_mode)}`}
                            />
                            <MetricCard
                                label="Applicant Rating"
                                value={app?.rating != null ? Number(app.rating).toFixed(2) : "—"}
                                icon="ri-award-line"
                                tone="slate"
                                hint={app?.is_shortlisted ? "Shortlisted" : "Not shortlisted"}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <i className="ri-stack-line text-primary" /> Interview Rounds Summary
                            </h3>
                            <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {sortedRounds.length}
              </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                <tr className="text-left text-[10px] uppercase tracking-widest font-black text-slate-400 border-b border-slate-100">
                                    <th className="py-3 px-3">Round</th>
                                    <th className="py-3 px-3">Scheduled</th>
                                    <th className="py-3 px-3">Completed</th>
                                    <th className="py-3 px-3">Avg</th>
                                    <th className="py-3 px-3">Recommendation</th>
                                    <th className="py-3 px-3">Feedback</th>
                                    <th className="py-3 px-3">Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {sortedRounds.map((r) => (
                                    <RoundRow key={r?.interview_id || r?.round} r={r} />
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {!sortedRounds.length ? (
                            <div className="p-10 text-center text-slate-400 text-sm italic">
                                No round summary available.
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* RIGHT: Competency bars */}
                <div className="xl:col-span-3 col-span-12 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-white">
                            <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
                                <i className="ri-pulse-line text-primary" /> Competency Averages
                            </h3>
                            <div className="text-[11px] text-slate-400 font-semibold mt-1">
                                Based on submitted feedback
                            </div>
                        </div>

                        <div className="p-4 space-y-4">
                            <CompetencyBar label="Communication" value={avgBy?.communication} />
                            <CompetencyBar label="Cultural Fit" value={avgBy?.cultural_fit} />
                            <CompetencyBar label="Technical Expertise" value={avgBy?.technical_expertise} />
                            <CompetencyBar label="Functional Expertise" value={avgBy?.functional_expertise} />
                            <CompetencyBar label="Leadership" value={avgBy?.leadership} />
                        </div>
                    </div>

                    {/* Next actions placeholder (optional) */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                            Next Step
                        </div>
                        {ready ? (
                            <div className="text-sm font-bold text-slate-700">
                                Candidate is ready for final decision.
                                <div className="text-xs text-slate-500 mt-1">
                                    Next: Select / Reject / Hold (and move to Offer Pipeline on Select).
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm font-bold text-slate-700">
                                Feedback is pending.
                                <div className="text-xs text-slate-500 mt-1">
                                    Collect remaining feedback before decision.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default RequisitionDecisionSummary;
