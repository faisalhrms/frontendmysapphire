import { Fragment, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import Avatar from "@components/Avatar.jsx";
import { useRequisitionApplicant } from "@modules/requisition/hooks/requisitionHooks.js";
import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";
import { getBadgeClasses } from "@helpers/badges.js";

// --- Internal Helper Components ---
const StatusBadge = ({ status, isShortlisted }) => (
    <div className="flex items-center gap-2">
        <span className={`${getBadgeClasses(status)} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm`}>
            {toTitleCase((status || "").replaceAll("_", " "))}
        </span>
        {isShortlisted && (
            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Shortlisted
            </span>
        )}
    </div>
);

const DetailRow = ({ label, value, icon, colorClass = "text-slate-600" }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
        <div className={`mt-1 ${colorClass}`}>
            <i className={`${icon} text-lg`} />
        </div>
        <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
            <span className={`text-sm font-semibold truncate ${colorClass === 'text-slate-600' ? 'text-slate-700' : colorClass}`}>
                {value || "—"}
            </span>
        </div>
    </div>
);

const RequisitionApplicantDetail = () => {
    const { requisitionId, applicationId } = useParams();
    const { applicant, loading, error } = useRequisitionApplicant(requisitionId, applicationId);

    // Sort interviews by round DESC (4->1) then by scheduled_at DESC
    const interviews = useMemo(() => {
        const list = Array.isArray(applicant?.interviews) ? [...applicant.interviews] : [];

        const roundNum = (r) => {
            const m = String(r || "").match(/round_(\d+)/i);
            return m ? Number(m[1]) : 0;
        };

        return list.sort((a, b) => {
            const ra = roundNum(a.round);
            const rb = roundNum(b.round);

            // 1) Round DESC
            if (rb !== ra) return rb - ra;

            // 2) scheduled_at DESC
            const da = new Date(a.scheduled_at || 0).getTime();
            const db = new Date(b.scheduled_at || 0).getTime();
            if (db !== da) return db - da;

            // 3) fallback by id DESC
            return (b.id || 0) - (a.id || 0);
        });
    }, [applicant]);

    if (loading) return <LoadingSpinner />;
    if (error || !applicant) return <div className="p-10 text-center font-bold bg-white m-6 rounded-lg border text-danger">Data Unavailable</div>;

    const req = applicant.requisition;

    return (
        <Fragment>
            <PageHeader currentpage="Profile Detail" title="Candidate Management" activepage="ATS" mainpage="Recruitment" />

            {/* --- HEADER --- */}
            <div className="bg-white border border-slate-200 rounded-xl px-6 py-5 mb-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <Avatar
                            full_name={applicant.full_name}
                            size="xl"
                            parentClasses="bg-primary/10 !text-primary border-2 border-primary/20 shadow-md"
                        />
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-black text-slate-800 tracking-tight">{applicant.full_name}</h1>
                                <StatusBadge status={applicant.status} isShortlisted={applicant.is_shortlisted} />
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">{req?.req_no}</span>
                                <span className="truncate max-w-[300px]">{req?.title}</span>
                                <span className="text-slate-300">|</span>
                                <span className="italic text-slate-400">Applied {formatDate(applicant.created_at)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to={`/module/requisition/${requisitionId}/applicants/`} className="ti-btn ti-btn-outline-light">
                            <i className="ri-arrow-go-back-line me-1" /> Back
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- CONTENT GRID --- */}
            <div className="grid grid-cols-12 gap-6 pb-24"> {/* pb-24 ensures no footer overlap */}

                {/* LEFT: Contact & Personal Info */}
                <div className="xl:col-span-3 col-span-12 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Candidate Data</h3>
                        </div>
                        <div className="p-2">
                            <DetailRow label="Expected Salary" value={`${applicant.expected_salary?.toLocaleString()} PKR`} icon="ri-money-dollar-circle-line" colorClass="text-emerald-600" />
                            <DetailRow label="Experience" value={`${applicant.total_experience_years} Years`} icon="ri-briefcase-line" />
                            <DetailRow label="Notice Period" value={`${applicant.notice_period_days} Days`} icon="ri-timer-line" />
                            <DetailRow label="CNIC" value={applicant.cnic_number} icon="ri-id-card-line" />
                            <DetailRow label="Email" value={applicant.email} icon="ri-mail-line" />
                            <DetailRow label="Phone" value={applicant.mobile_number} icon="ri-phone-line" />
                            <DetailRow label="Location" value={`${applicant.city}, ${applicant.home_address}`} icon="ri-map-pin-line" />
                        </div>
                    </div>

                    {/* Resume & Portfolio Assets */}
                    <div className="bg-slate-900 rounded-xl p-5 text-white shadow-xl">
                        <h3 className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-4">Assets & Links</h3>
                        <div className="space-y-3">
                            {applicant.resume_file_url && (
                                <a href={applicant.resume_file_url} target="_blank" className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all group">
                                    <div className="flex items-center gap-3">
                                        <i className="ri-file-pdf-fill text-rose-400 text-xl" />
                                        <span className="text-sm font-bold">Resume / CV</span>
                                    </div>
                                    <i className="ri-external-link-line opacity-40 group-hover:opacity-100" />
                                </a>
                            )}
                            {applicant.portfolio_url && (
                                <a href={applicant.portfolio_url} target="_blank" className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all group">
                                    <div className="flex items-center gap-3">
                                        <i className="ri-linkedin-box-fill text-blue-400 text-xl" />
                                        <span className="text-sm font-bold">Portfolio / LinkedIn</span>
                                    </div>
                                    <i className="ri-external-link-line opacity-40 group-hover:opacity-100" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* CENTER: Experience & Education */}
                <div className="xl:col-span-6 col-span-12 space-y-6">
                    {/* Work Experience */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <span className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><i className="ri-building-line" /></span>
                            Work Experience
                        </h3>
                        <div className="relative pl-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                            {applicant.experiences?.length > 0 ? applicant.experiences.map((exp, idx) => (
                                <div key={exp.id} className={`${idx !== applicant.experiences.length - 1 ? 'mb-8' : ''} relative`}>
                                    <div className="absolute -left-[24px] top-1 w-4 h-4 rounded-full bg-white border-4 border-indigo-500 shadow-sm" />
                                    <h4 className="text-sm font-bold text-slate-800 leading-none">{exp.designation}</h4>
                                    <p className="text-xs font-semibold text-slate-500 mt-2">{exp.company}</p>
                                    <p className="text-[11px] font-bold text-indigo-500 uppercase mt-1">{exp.years_in_role} Years</p>
                                </div>
                            )) : <p className="text-slate-400 text-sm italic">No experience details provided.</p>}
                        </div>
                    </div>

                    {/* Education / Qualifications */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <span className="p-2 bg-amber-50 rounded-lg text-amber-600"><i className="ri-graduation-cap-line" /></span>
                            Education
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {applicant.qualifications?.length > 0 ? applicant.qualifications.map((edu) => (
                                <div key={edu.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                                    <div className="bg-white p-2 rounded-lg shadow-sm text-slate-400">
                                        <i className="ri-award-line text-lg" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">{edu.degree}</h4>
                                        <p className="text-xs text-slate-500 font-medium">{edu.institution}</p>
                                        <span className="inline-block mt-2 px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-black text-slate-400 uppercase">
                                            Completed {edu.year_completed}
                                        </span>
                                    </div>
                                </div>
                            )) : <p className="text-slate-400 text-sm italic">No education records found.</p>}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Interview Activity */}
                <div className="xl:col-span-3 col-span-12 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                            <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">Interview Activity</h3>
                            <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{interviews.length}</span>
                        </div>

                        <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {interviews.length > 0 ? interviews.map((iv) => (
                                <div key={iv.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:border-primary/30 hover:shadow-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                            {toTitleCase(iv.round?.replaceAll("_", " "))}
                                        </span>
                                        <div className={`h-2.5 w-2.5 rounded-full ring-4 ring-white shadow-sm ${iv.status === 'completed' ? 'bg-emerald-500' : iv.status === 'cancelled' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                                    </div>
                                    <div className="text-sm font-bold text-slate-700 mb-1">{toTitleCase(iv.interview_type)}</div>
                                    <div className="text-[11px] text-slate-400 font-medium mb-3">
                                        <i className="ri-calendar-line me-1" /> {formatDate(iv.scheduled_at)}
                                    </div>

                                    {/* Feedback Status Logic */}
                                    {iv.status === 'completed' ? (
                                        iv.all_feedback_submitted ? (
                                            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                                                <i className="ri-checkbox-circle-fill text-sm" /> FEEDBACK FILLED BY ALL
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold bg-amber-50 p-2 rounded-lg border border-amber-100">
                                                <i className="ri-time-line text-sm" /> FEEDBACK PENDING ({iv.pending_feedback_count})
                                            </div>
                                        )
                                    ) : iv.status === 'cancelled' ? (
                                        <div className="text-[10px] text-rose-500 font-bold bg-rose-50 p-2 rounded-lg border border-rose-100 truncate" title={iv.cancel_reason}>
                                            CANCELLED: {iv.cancel_reason || "N/A"}
                                        </div>
                                    ) : (
                                        <div className="text-[10px] text-primary font-bold bg-primary/5 p-2 rounded-lg border border-primary/10">
                                            SCHEDULED
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="py-10 text-center text-slate-300 text-xs italic">No activity recorded.</div>
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                            <Link to={`/module/requisition/${requisitionId}/applicants/${applicationId}/interviews`} className="flex items-center justify-center gap-2 text-xs font-black text-primary hover:text-indigo-700 transition-all group uppercase tracking-widest">
                                View Detailed History
                                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* System Audit - Don't skip these fields from JSON */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">System Audit</div>
                        <div className="space-y-2">

                            <div className="flex justify-between">
                                <span className="text-[10px] text-slate-400">IP Address:</span>
                                <span className="text-[10px] font-mono text-slate-700">{applicant.ip_address}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400">Device/Agent:</span>
                                <span className="text-[10px] font-medium text-slate-600 truncate mt-1" title={applicant.user_agent}>
                                    {applicant.user_agent}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default RequisitionApplicantDetail;