import { Fragment, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import Avatar from "@components/Avatar.jsx";
import { useRequisitionApplicant } from "@modules/requisition/hooks/requisitionHooks.js";
import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";
import { getBadgeClasses } from "@helpers/badges.js";

// --- Helper: Status Badge ---
const StatusBadge = ({ status, isShortlisted }) => (
    <div className="flex items-center gap-2">
    <span
        className={`${getBadgeClasses(
            status
        )} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm`}
    >
      {toTitleCase((status || "").replaceAll("_", " "))}
    </span>

        {isShortlisted && (
            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
        Shortlisted
      </span>
        )}
    </div>
);

// --- Helper: Detail Row ---
const DetailRow = ({ label, value, icon, colorClass = "text-slate-600" }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
        <div className={`mt-1 ${colorClass}`}>
            <i className={`${icon} text-lg`} />
        </div>
        <div className="flex flex-col min-w-0">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </span>
            <span
                className={`text-sm font-semibold truncate ${
                    colorClass === "text-slate-600" ? "text-slate-700" : colorClass
                }`}
            >
        {value || "—"}
      </span>
        </div>
    </div>
);

const RequisitionApplicantDetail = () => {
    const { requisitionId, applicationId } = useParams();
    const navigate = useNavigate();

    const { applicant, loading, error } = useRequisitionApplicant(
        requisitionId,
        applicationId
    );

    // Sorting Logic
    const interviews = useMemo(() => {
        const list = Array.isArray(applicant?.interviews)
            ? [...applicant.interviews]
            : [];

        const roundNum = (r) => {
            const m = String(r || "").match(/round_(\d+)/i);
            return m ? Number(m[1]) : 0;
        };

        return list.sort((a, b) => {
            const ra = roundNum(a.round);
            const rb = roundNum(b.round);
            if (rb !== ra) return rb - ra; // Round DESC
            return new Date(b.scheduled_at || 0) - new Date(a.scheduled_at || 0); // Date DESC
        });
    }, [applicant]);

    if (loading) return <LoadingSpinner />;

    if (error || !applicant) {
        return (
            <div className="p-20 text-center bg-white m-6 rounded-xl border border-dashed border-slate-300">
                <i className="ri-error-warning-line text-4xl text-slate-300 mb-4 block" />
                <h3 className="text-lg font-bold text-slate-700">
                    Applicant Details Unavailable
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                    The requested applicant data could not be retrieved from the server.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="ti-btn ti-btn-primary"
                    type="button"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const req = applicant.requisition;

    return (
        <Fragment>
            <PageHeader
                currentpage="Applicant Profile"
                title="Talent Acquisition"
                activepage="ATS"
                mainpage="Recruitment"
            />

            {/* --- TOP HEADER CARD --- */}
            <div className="bg-white border border-slate-200 rounded-xl px-6 py-5 mb-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <Avatar
                            full_name={applicant.full_name}
                            size="xl"
                            parentClasses="bg-primary/10 !text-primary border-2 border-primary/20 shadow-md ring-4 ring-white"
                        />
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                                    {applicant.full_name}
                                </h1>
                                <StatusBadge
                                    status={applicant.status}
                                    isShortlisted={applicant.is_shortlisted}
                                />
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold text-[11px]">
                  {req?.req_no}
                </span>
                                <span className="truncate max-w-[300px] text-slate-700 font-bold">
                  {req?.title}
                </span>
                                <span className="text-slate-300">|</span>
                                <span className="italic text-slate-400">
                  Applied on {formatDate(applicant.created_at)}
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
                            <i className="ri-arrow-left-line me-1" /> Back to Pipeline
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 pb-24">
                {/* --- LEFT: ASSETS & DATA --- */}
                <div className="xl:col-span-3 col-span-12 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                Key Metrics
                            </h3>
                        </div>
                        <div className="p-2">
                            <DetailRow
                                label="Expected Salary"
                                value={
                                    applicant.expected_salary != null
                                        ? `${Number(applicant.expected_salary).toLocaleString()} PKR`
                                        : "—"
                                }
                                icon="ri-wallet-3-line"
                                colorClass="text-emerald-600"
                            />
                            <DetailRow
                                label="Total Experience"
                                value={
                                    applicant.total_experience_years != null
                                        ? `${applicant.total_experience_years} Years`
                                        : "—"
                                }
                                icon="ri-history-line"
                            />
                            <DetailRow
                                label="Notice Period"
                                value={
                                    applicant.notice_period_days != null
                                        ? `${applicant.notice_period_days} Days`
                                        : "—"
                                }
                                icon="ri-time-line"
                            />
                            <DetailRow label="City" value={applicant.city} icon="ri-map-pin-2-line" />
                            <DetailRow label="CNIC" value={applicant.cnic_number} icon="ri-fingerprint-line" />
                            <DetailRow label="Contact" value={applicant.mobile_number} icon="ri-smartphone-line" />
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-5 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10">
                            <i className="ri-file-pdf-fill text-8xl" />
                        </div>

                        <h3 className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-4">
                            Verification Assets
                        </h3>

                        <div className="space-y-3 relative z-10">
                            {applicant.resume_file_url && (
                                <a
                                    href={applicant.resume_file_url}
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
                            )}

                            {applicant.portfolio_url && (
                                <a
                                    href={applicant.portfolio_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <i className="ri-global-line text-blue-400 text-xl" />
                                        <span className="text-sm font-bold">Portfolio Link</span>
                                    </div>
                                    <i className="ri-external-link-line opacity-40 group-hover:opacity-100" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- CENTER: EXPERIENCE --- */}
                <div className="xl:col-span-6 col-span-12 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-base font-bold text-slate-800 mb-8 flex items-center gap-3">
              <span className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <i className="ri-briefcase-4-line" />
              </span>
                            Professional Journey
                        </h3>

                        <div className="relative pl-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                            {applicant.experiences?.length > 0 ? (
                                applicant.experiences.map((exp, idx) => (
                                    <div
                                        key={exp.id}
                                        className={`${
                                            idx !== applicant.experiences.length - 1 ? "mb-10" : ""
                                        } relative`}
                                    >
                                        <div className="absolute -left-[24px] top-1 w-4 h-4 rounded-full bg-white border-4 border-indigo-500 shadow-sm" />
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800 tracking-tight">
                                                    {exp.designation}
                                                </h4>
                                                <p className="text-xs font-semibold text-slate-500 mt-1">
                                                    {exp.company}
                                                </p>
                                            </div>
                                            <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[10px] font-black">
                        {exp.years_in_role}Y IN ROLE
                      </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm italic">
                                    No professional history recorded.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <i className="ri-graduation-cap-line" />
              </span>
                            Education Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {applicant.qualifications?.length > 0 ? (
                                applicant.qualifications.map((edu) => (
                                    <div
                                        key={edu.id}
                                        className="p-4 rounded-xl border border-slate-100 bg-slate-50/30"
                                    >
                                        <h4 className="text-sm font-bold text-slate-800 leading-snug">
                                            {edu.degree}
                                        </h4>
                                        <p className="text-xs text-slate-500 font-medium mt-1">
                                            {edu.institution}
                                        </p>
                                        <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Graduated {edu.year_completed}
                      </span>
                                            <i className="ri-verified-badge-line text-slate-200 text-lg" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm italic">
                                    No academic history found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- RIGHT: INTERVIEW TIMELINE --- */}
                <div className="xl:col-span-3 col-span-12 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                            <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
                                <i className="ri-history-line text-primary" /> Interview Activity
                            </h3>
                            <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {interviews.length}
              </span>
                        </div>

                        <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                            {interviews.map((iv) => (
                                <div
                                    key={iv.id}
                                    className="p-4 rounded-xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:border-primary/30 hover:shadow-lg"
                                >
                                    <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      {iv.round?.replaceAll("_", " ")}
                    </span>
                                        <div
                                            className={`h-2.5 w-2.5 rounded-full ring-4 ring-white shadow-sm ${
                                                iv.status === "completed" ? "bg-emerald-500" : "bg-amber-400"
                                            }`}
                                        />
                                    </div>

                                    <div className="text-sm font-bold text-slate-700 mb-1 capitalize">
                                        {iv.interview_type} Interview
                                    </div>

                                    <div className="text-[11px] text-slate-400 font-medium mb-3">
                                        <i className="ri-calendar-event-line me-1" />{" "}
                                        {formatDate(iv.scheduled_at)}
                                    </div>

                                    {iv.status === "completed" ? (
                                        iv.all_feedback_submitted ? (
                                            <div className="flex items-center gap-1.5 text-[9px] text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                                                <i className="ri-checkbox-circle-fill" /> ALL FEEDBACK
                                                COLLECTED
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-[9px] text-amber-600 font-bold bg-amber-50 p-2 rounded-lg border border-amber-100">
                                                <i className="ri-error-warning-fill" /> PENDING FEEDBACK (
                                                {iv.pending_feedback_count})
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-[9px] text-primary font-bold bg-primary/5 p-2 rounded-lg border border-primary/10">
                                            INTERVIEW SCHEDULED
                                        </div>
                                    )}
                                </div>
                            ))}

                            {!interviews.length ? (
                                <div className="py-10 text-center text-slate-300 text-xs italic">
                                    No activity recorded.
                                </div>
                            ) : null}
                        </div>

                        {/* ✅ REDIRECT BUTTON (no modal) */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/module/requisition/${requisitionId}/applicants/${applicationId}/interviews`
                                    )
                                }
                                className="w-full flex items-center justify-center gap-2 text-xs font-black text-primary hover:text-indigo-700 transition-all group uppercase tracking-widest"
                            >
                                View Detailed History
                                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Audit Info */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                            Application Trace
                        </div>
                        <div className="space-y-3">
                            <div>
                <span className="text-[9px] text-slate-400 block mb-0.5">
                  IP Address
                </span>
                                <span className="text-[10px] font-mono font-bold text-slate-700">
                  {applicant.ip_address}
                </span>
                            </div>

                            <div>
                <span className="text-[9px] text-slate-400 block mb-0.5">
                  Rating
                </span>
                                <div className="flex items-center gap-1">
                                    <i className="ri-star-fill text-warning text-xs" />
                                    <span className="text-xs font-bold text-slate-800">
                    {applicant.rating} / 5
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default RequisitionApplicantDetail;
