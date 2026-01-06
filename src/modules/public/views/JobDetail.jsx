import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@config/axiosConfig.js";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    DollarSign,
    Clock,
    Share2,
    Link2,
    CheckCircle2,
    ArrowUpRight,
    Instagram,
    Facebook,
    Linkedin,
    Mail,
    Phone,
    BadgeCheck,
    Building2,
    PhoneCall,
    ClipboardList,
    UsersRound,
} from "lucide-react";

import logo from "@assets/images/brand-logos/desktop-white.svg";

const BRAND = {
    name: "SAPPHIRE",
    heroBg: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2400",
};

const WORK_MODE_LABEL = { remote: "Remote", onsite: "On-site", hybrid: "Hybrid" };
const EMPLOYMENT_LABEL = {
    permanent: "Full-Time",
    contract: "Contract",
    intern: "Internship",
    consultant: "Consultant",
};

function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function safeLower(v) {
    return String(v ?? "").toLowerCase();
}

const htmlStyles = `
  .job-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; color: #4b5563; }
  .job-content li { margin-bottom: 0.5rem; }
  .job-content p { margin-bottom: 1rem; color: #4b5563; line-height: 1.8; }
  .job-content a { color: #111827; text-decoration: underline; }
`;

function Pill({ children }) {
    return (
        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {children}
        </span>
    );
}

function HiringProcessInline() {
    const steps = [
        {
            icon: PhoneCall,
            title: "Screening call",
            desc: "A quick chat to confirm alignment on the role, availability, and expectations.",
        },
        {
            icon: ClipboardList,
            title: "Interview(s)",
            desc: "Role-based discussion focused on real work, collaboration, and problem solving.",
        },
        {
            icon: UsersRound,
            title: "Final round",
            desc: "Meet the hiring manager/team to validate fit and clarify any open questions.",
        },
        {
            icon: BadgeCheck,
            title: "Offer",
            desc: "If selected, we’ll share the offer and onboard you smoothly.",
        },
    ];

    return (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s) => (
                <div key={s.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <div className="h-11 w-11 rounded-2xl border border-gray-200 bg-white flex items-center justify-center">
                        <s.icon className="h-5 w-5 text-gray-900" />
                    </div>
                    <div className="mt-4 font-extrabold text-gray-900">{s.title}</div>
                    <div className="mt-1 text-sm text-gray-600 leading-relaxed">{s.desc}</div>
                </div>
            ))}
        </div>
    );
}

function Footer({ onCareers }) {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-black text-white">
            <div className="mx-auto max-w-7xl px-6 py-14">
                <div className="grid gap-10 md:grid-cols-12">
                    <div className="md:col-span-4">
                        <img
                            src={logo}
                            alt="SAPPHIRE"
                            className="h-9 w-auto object-contain"
                            style={{ filter: "drop-shadow(0 10px 18px rgba(0,0,0,.45))" }}
                        />
                        <p className="mt-4 text-white/70 leading-relaxed max-w-sm">
                            A retail lifestyle brand built on textile heritage, quality, and modern design — delivered through stores
                            and digital experiences.
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                            <a
                                href="#"
                                className="h-10 w-10 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5 text-white/80" />
                            </a>
                            <a
                                href="#"
                                className="h-10 w-10 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5 text-white/80" />
                            </a>
                            <a
                                href="#"
                                className="h-10 w-10 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5 text-white/80" />
                            </a>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="text-sm font-extrabold tracking-wide">Company</div>
                        <div className="mt-4 space-y-3 text-sm text-white/70">
                            <button onClick={onCareers} className="hover:text-white transition-colors block">
                                Careers
                            </button>
                            <a href="#" className="hover:text-white transition-colors block">
                                About
                            </a>
                            <a href="#" className="hover:text-white transition-colors block">
                                Sustainability
                            </a>
                            <a href="#" className="hover:text-white transition-colors block">
                                Contact
                            </a>
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <div className="text-sm font-extrabold tracking-wide">Retail Categories</div>
                        <div className="mt-4 space-y-3 text-sm text-white/70">
                            <span className="block">Women</span>
                            <span className="block">Men</span>
                            <span className="block">Kids</span>
                            <span className="block">Home & Accessories</span>
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <div className="text-sm font-extrabold tracking-wide">Contact</div>
                        <div className="mt-4 space-y-3 text-sm text-white/70">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-white/70" />
                                <span>careers@sapphire.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-white/70" />
                                <span>+92 (xxx) xxx xxxx</span>
                            </div>

                            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">Hiring</div>
                                <div className="mt-1 text-sm text-white/80">
                                    We review applications daily. Shortlisted candidates are contacted within a few working days.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="text-xs text-white/50">
                        © {year} {BRAND.name}. All rights reserved.
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/60">
                        <a href="#" className="hover:text-white transition-colors">
                            Privacy
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            Terms
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            Cookie Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default function JobDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let mounted = true;

        const fetchJob = async () => {
            setLoading(true);
            setCopied(false);

            try {
                const res = await api.get(`/careers/jobs/${id}/`);
                const data = res?.data?.data ?? res?.data;
                if (mounted) setJob(data);
            } catch (e) {
                console.error("Failed to fetch job", e);
                if (mounted) setJob(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchJob();
        return () => {
            mounted = false;
        };
    }, [id]);

    const employmentLabel = useMemo(() => {
        const raw = safeLower(job?.employment_type);
        return EMPLOYMENT_LABEL[raw] || job?.employment_type || "—";
    }, [job]);

    const workModeLabel = useMemo(() => {
        const raw = safeLower(job?.work_mode);
        return WORK_MODE_LABEL[raw] || job?.work_mode || "—";
    }, [job]);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        } catch {
            // ignore
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="w-9 h-9 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="max-w-md w-full rounded-3xl border border-gray-200 p-8 text-center">
                    <div className="text-xl font-extrabold text-gray-900">Role not found</div>
                    <p className="mt-2 text-gray-600">The job you’re looking for may have been removed.</p>
                    <button
                        onClick={() => navigate("/careers")}
                        className="mt-6 rounded-2xl bg-black px-6 py-3 text-sm font-bold text-white hover:bg-black/90 transition-all"
                    >
                        Back to careers
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: "'Gotham', 'Inter', sans-serif" }}>
            <style>{htmlStyles}</style>

            {/* HERO */}
            <section className="relative overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${BRAND.heroBg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/75" />

                <div className="relative">
                    <div className="mx-auto max-w-7xl px-6 pt-6">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => navigate("/careers")}
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition-all backdrop-blur-md"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </button>

                            {/* ✅ removed brand logo from top right */}
                            <div />
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl px-6 pt-10 pb-14 md:pt-14 md:pb-16">
                        <div className="max-w-3xl">
                            <div className="flex flex-wrap gap-2 mb-5">
                                {/* ✅ removed sub_department pill */}
                                <Pill>{job?.department?.name || "General"}</Pill>
                                <Pill>{employmentLabel}</Pill>
                                <Pill>{workModeLabel}</Pill>
                                <Pill>{job?.openings ? `${job.openings} opening${job.openings > 1 ? "s" : ""}` : "Open role"}</Pill>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                                {job.title}
                            </h1>

                            {/* ✅ removed brief_role_overview from hero */}

                            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-white/80 text-sm font-semibold">
                                <span className="inline-flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {job?.location?.name || "—"}
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Deadline: {formatDate(job.application_deadline)}
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Job ID: {job.req_no}
                                </span>
                                {job?.company?.name ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        {job.company.name}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BODY */}
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8">
                        <div className="rounded-3xl border border-gray-200 bg-white p-7 md:p-9">
                            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">About the role</h2>

                            <p className="mt-4 text-gray-600 leading-relaxed text-base md:text-lg">
                                {job.brief_role_overview || "—"}
                            </p>

                            <div className="mt-10 border-t border-gray-100 pt-10">
                                <h3 className="text-lg font-extrabold text-gray-900">Requirements</h3>
                                <div
                                    className="job-content mt-4 text-base md:text-lg"
                                    dangerouslySetInnerHTML={{ __html: job.education_relevant_experience || "<p>—</p>" }}
                                />
                            </div>

                            <div className="mt-10 border-t border-gray-100 pt-10">
                                <h3 className="text-lg font-extrabold text-gray-900">Technical skills</h3>
                                <div
                                    className="job-content mt-4 text-base md:text-lg"
                                    dangerouslySetInnerHTML={{ __html: job.knowledge_technical_skills || "<p>—</p>" }}
                                />
                            </div>

                            <div className="mt-10 border-t border-gray-100 pt-10">
                                <h3 className="text-lg font-extrabold text-gray-900">What to expect</h3>

                                {/* ✅ replaced simple cards with same hiring process */}
                                <HiringProcessInline />
                            </div>
                        </div>

                        <p className="mt-6 text-xs text-gray-500">
                            We are an equal opportunity employer. Hiring decisions are based on skills, experience, and team needs.
                        </p>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-6 space-y-4">
                            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-extrabold text-gray-900">Apply</h3>
                                    <div
                                        className="h-10 w-10 rounded-2xl border border-gray-200 bg-white flex items-center justify-center">
                                        <ArrowUpRight className="h-5 w-5 text-gray-700"/>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                        <span className="text-sm font-semibold text-gray-500">Experience</span>
                                        <span className="text-sm font-extrabold text-gray-900">
                                            {job?.min_total_experience_years ?? "—"} yrs
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                        <span className="text-sm font-semibold text-gray-500">Work mode</span>
                                        <span className="text-sm font-extrabold text-gray-900">{workModeLabel}</span>
                                    </div>

                                    {job?.employment_type === "contract" && job?.contract_duration_months ? (
                                        <div
                                            className="flex items-center justify-between border-b border-gray-100 pb-4">
                                            <span className="text-sm font-semibold text-gray-500">Contract</span>
                                            <span className="text-sm font-extrabold text-gray-900">
                                                {job.contract_duration_months} months
                                            </span>
                                        </div>
                                    ) : null}

                                    {!!job?.target_salary_min && (
                                        <div
                                            className="flex items-center justify-between border-b border-gray-100 pb-4">
                                            <span
                                                className="text-sm font-semibold text-gray-500 inline-flex items-center gap-2">
                                                <DollarSign className="h-4 w-4"/>
                                                Salary
                                            </span>
                                            <span className="text-sm font-extrabold text-gray-900">
                                                {job.target_salary_currency} {Number(job.target_salary_min).toLocaleString()} -{" "}
                                                {Number(job.target_salary_max).toLocaleString()}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span
                                            className="text-sm font-semibold text-gray-500 inline-flex items-center gap-2">
                                            <Clock className="h-4 w-4"/>
                                            Deadline
                                        </span>
                                        <span className="text-sm font-extrabold text-gray-900">
                                            {formatDate(job.application_deadline)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        // Preferred: internal SPA route (uses apply_slug from your job detail response)
                                        if (job?.apply_slug) {
                                            navigate(`/careers/apply/${job.apply_slug}`);
                                            return;
                                        }

                                        // Fallback: use apply_url if slug is missing
                                        if (job?.apply_url) {
                                            window.location.href = job.apply_url;
                                        }
                                    }}
                                    className="mt-7 block w-full rounded-2xl bg-black px-6 py-4 text-center text-sm font-extrabold text-white hover:bg-black/90 transition-all shadow-lg shadow-black/10"
                                >
                                    Apply now
                                </button>


                                <div className="mt-4 text-center text-xs text-gray-500">Usually responds within 3
                                    working days.
                                </div>
                            </div>

                            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-extrabold text-gray-900">Share this role</div>
                                    <Share2 className="h-4 w-4 text-gray-500"/>
                                </div>

                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={copyLink}
                                        className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-900 hover:border-black/30 transition-all inline-flex items-center justify-center gap-2"
                                    >
                                        <Link2 className="h-4 w-4" />
                                        {copied ? "Copied!" : "Copy link"}
                                    </button>

                                    <button
                                        onClick={() => {
                                            const text = `${job.title} — ${job.req_no}`;
                                            if (navigator.share) {
                                                navigator
                                                    .share({ title: job.title, text, url: window.location.href })
                                                    .catch(() => {});
                                            } else {
                                                copyLink();
                                            }
                                        }}
                                        className="flex-1 rounded-2xl bg-black px-4 py-3 text-sm font-bold text-white hover:bg-black/90 transition-all"
                                    >
                                        Share
                                    </button>
                                </div>

                                <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                                    <BadgeCheck className="h-4 w-4" />
                                    Share with your network for referrals.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-14 rounded-3xl border border-gray-200 bg-white p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <div className="text-xl font-extrabold text-gray-900">Not the right fit?</div>
                        <p className="mt-1 text-gray-600">Browse other openings and find a role that matches your strengths.</p>
                    </div>
                    <button
                        onClick={() => navigate("/careers")}
                        className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-3.5 text-sm font-extrabold text-gray-900 hover:bg-gray-100 hover:border-black/20 transition-all"
                    >
                        View all roles
                    </button>
                </div>
            </div>

            <Footer onCareers={() => navigate("/careers")} />
        </div>
    );
}
