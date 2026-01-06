import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@config/axiosConfig.js";
import {
    Search,
    ArrowRight,
    MapPin,
    Clock,
    Briefcase,
    Users,
    Leaf,
    Sparkles,
    Store,
    Truck,
    MonitorSmartphone,
    ChevronDown,
    ArrowUpRight,
    ShieldCheck,
    HeartHandshake,
    Instagram,
    Facebook,
    Linkedin,
    Mail,
    Phone,
    Hash,
    PhoneCall,
    ClipboardList,
    UsersRound,
    BadgeCheck,
} from "lucide-react";

import logo from "@assets/images/brand-logos/desktop-white.svg";

function safeLower(v) {
    return String(v ?? "").toLowerCase();
}

function getApiRows(payload) {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data?.rows)) return payload.data.rows;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
}

const WORK_MODE_LABEL = { remote: "Remote", onsite: "On-site", hybrid: "Hybrid" };
const EMPLOYMENT_LABEL = {
    permanent: "Full-Time",
    contract: "Contract",
    intern: "Internship",
    consultant: "Consultant",
};

const BRAND = {
    name: "SAPPHIRE",
    heroBg: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2400",
    gallery: [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200",
    ],
};

const TABS = [
    { id: "all", label: "All roles" },
    { id: "permanent", label: "Full-Time" },
    { id: "contract", label: "Contract" },
    { id: "intern", label: "Internships" },
    { id: "consultant", label: "Consultancy" },
];

const WORKMODE_PILLS = [
    { id: "all", label: "All modes" },
    { id: "remote", label: "Remote" },
    { id: "onsite", label: "On-site" },
    { id: "hybrid", label: "Hybrid" },
];

function formatDeadline(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function StatPill({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-md">
            <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
                <div className="text-white text-xl font-bold">{value}</div>
                <div className="text-white/70 text-sm font-medium">{label}</div>
            </div>
        </div>
    );
}

function HiringProcess() {
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
        <section className="mx-auto max-w-7xl px-6 pb-4">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-700">
                            Hiring process
                        </div>
                        <h3 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                            Clear. Simple. Respectful of your time.
                        </h3>
                        <p className="mt-2 text-gray-600 max-w-2xl">
                            Our process is designed to be transparent and quick — focused on skills and real-world fit.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-700">
                        <div className="font-bold text-gray-900">Typical timeline</div>
                        <div className="mt-1 text-gray-600">3–7 working days (role dependent)</div>
                    </div>
                </div>

                <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {steps.map((s) => (
                        <div key={s.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                            <div className="h-11 w-11 rounded-2xl border border-gray-200 bg-white flex items-center justify-center">
                                <s.icon className="h-5 w-5 text-gray-900" />
                            </div>
                            <div className="mt-4 font-extrabold text-gray-900">{s.title}</div>
                            <div className="mt-1 text-sm text-gray-600 leading-relaxed">{s.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/**
 * ✅ Listing payload does NOT include department.
 * So for "teams hiring" count we use unique job titles.
 * Also: req_type (new/replacement/additional) is removed from cards as requested.
 */
function JobCard({ job, onClick }) {
    const companyName = job?.company?.name || "SAPPHIRE";
    const loc = job?.location?.name || "—";

    const workModeRaw = safeLower(job?.work_mode);
    const empRaw = safeLower(job?.employment_type);

    const workMode = WORK_MODE_LABEL[workModeRaw] || job?.work_mode || "—";
    const emp = EMPLOYMENT_LABEL[empRaw] || job?.employment_type || "—";

    return (
        <button
            onClick={onClick}
            className="group text-left w-full rounded-3xl border border-gray-200 bg-white p-6 hover:border-black/40 hover:shadow-xl hover:shadow-black/5 transition-all"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
                            {companyName}
                        </span>

                        <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                            <Clock className="mr-1.5 h-3.5 w-3.5" />
                            {workMode}
                        </span>
                    </div>

                    <div>
                        <div className="text-lg font-bold text-gray-900 group-hover:text-black">
                            {job?.title || "Untitled Role"}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {loc}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="h-4 w-4" />
                                {emp}
                            </span>

                            {job?.req_no ? (
                                <span className="inline-flex items-center gap-1.5 text-gray-500">
                                    <Hash className="h-4 w-4" />
                                    <span className="font-medium">{job.req_no}</span>
                                </span>
                            ) : null}

                            {job?.application_deadline ? (
                                <span className="inline-flex items-center gap-1.5 text-gray-500">
                                    Deadline: <span className="font-medium">{formatDeadline(job.application_deadline)}</span>
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="shrink-0">
                    <div className="h-11 w-11 rounded-2xl border border-gray-200 bg-white flex items-center justify-center group-hover:border-black/30 group-hover:shadow-sm transition-all">
                        <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-black transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {job?.openings ? `${job.openings} opening${job.openings > 1 ? "s" : ""}` : "Open role"}
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-black opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    View role <ArrowRight className="h-4 w-4" />
                </span>
            </div>
        </button>
    );
}

function Footer({ onNav }) {
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
                            <button onClick={() => onNav("about")} className="hover:text-white transition-colors block">
                                About
                            </button>
                            <button onClick={() => onNav("openings")} className="hover:text-white transition-colors block">
                                Careers
                            </button>
                            <button onClick={() => onNav("teams")} className="hover:text-white transition-colors block">
                                Teams
                            </button>
                            <button onClick={() => onNav("sustainability")} className="hover:text-white transition-colors block">
                                Sustainability
                            </button>
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

export default function Careers() {
    const navigate = useNavigate();
    const openingsRef = useRef(null);
    const aboutRef = useRef(null);
    const teamsRef = useRef(null);
    const sustainabilityRef = useRef(null);

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState("");

    const [activeTab, setActiveTab] = useState("all");
    const [activeWorkMode, setActiveWorkMode] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        let mounted = true;

        const fetchAllPages = async () => {
            setLoading(true);
            setErrorText("");

            try {
                // ✅ page 1
                const res1 = await api.get("/careers/jobs/");
                const payload1 = res1?.data;
                const rows1 = getApiRows(payload1);

                const d1 = payload1?.data || {};
                const totalPages = Number(d1?.total_pages || 1);
                const currentPage = Number(d1?.current_page || 1);

                let allRows = [...rows1];

                // ✅ if backend supports page param, pull remaining pages
                if (totalPages > 1) {
                    for (let p = currentPage + 1; p <= totalPages; p++) {
                        try {
                            const resp = await api.get("/careers/jobs/", { params: { page: p } });
                            allRows = allRows.concat(getApiRows(resp?.data));
                        } catch (e) {
                            // If page param not supported, silently stop (still works with page 1)
                            break;
                        }
                    }
                }

                // ✅ dedupe by id + sort by created_at desc
                const byId = new Map();
                for (const j of allRows) {
                    if (j?.id != null) byId.set(j.id, j);
                }
                const merged = Array.from(byId.values()).sort((a, b) => {
                    const ta = new Date(a?.created_at || 0).getTime();
                    const tb = new Date(b?.created_at || 0).getTime();
                    return tb - ta;
                });

                if (mounted) setJobs(merged);
            } catch (e) {
                console.error("Failed to fetch jobs", e);
                if (mounted) {
                    setJobs([]);
                    setErrorText(e?.response?.data?.message || "Failed to fetch jobs");
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchAllPages();
        return () => {
            mounted = false;
        };
    }, []);

    const stats = useMemo(() => {
        const openRoles = jobs.length;
        const remoteRoles = jobs.filter((j) => safeLower(j?.work_mode) === "remote").length;

        // ✅ Listing doesn't give department => use unique titles as “teams”
        const teamCount = new Set(jobs.map((j) => safeLower(j?.title)).filter(Boolean)).size;

        return { openRoles, remoteRoles, teams: teamCount };
    }, [jobs]);

    const tabCounts = useMemo(() => {
        const counts = { all: jobs.length };
        for (const t of TABS) {
            if (t.id === "all") continue;
            counts[t.id] = jobs.filter((j) => safeLower(j?.employment_type) === t.id).length;
        }
        return counts;
    }, [jobs]);

    const filteredJobs = useMemo(() => {
        const q = safeLower(searchQuery).trim();

        return jobs.filter((job) => {
            const matchesType = activeTab === "all" || safeLower(job?.employment_type) === activeTab;
            const matchesWorkMode = activeWorkMode === "all" || safeLower(job?.work_mode) === activeWorkMode;

            const haystack = [
                job?.title,
                job?.req_no,
                job?.company?.name,
                job?.location?.name,
                job?.work_mode,
                job?.employment_type,
                job?.req_type, // kept in search matching (not shown on cards)
            ]
                .map((x) => safeLower(x))
                .join(" ");

            const matchesSearch = !q || haystack.includes(q);
            return matchesType && matchesWorkMode && matchesSearch;
        });
    }, [jobs, activeTab, activeWorkMode, searchQuery]);

    const scrollToOpenings = () => openingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    const teamCards = [
        { icon: Store, title: "Retail Operations", hint: "Stores, customer experience, VM" },
        { icon: Truck, title: "Supply Chain", hint: "Planning, warehousing, logistics" },
        { icon: MonitorSmartphone, title: "E-commerce", hint: "Digital store, growth, merchandising" },
        { icon: Sparkles, title: "Design Studio", hint: "Product, styling, innovation" },
        { icon: Users, title: "People", hint: "HR, culture, learning" },
        { icon: ShieldCheck, title: "Finance & Ops", hint: "Controls, audit, process" },
    ];

    const navTo = (key) => {
        const map = {
            about: aboutRef,
            openings: openingsRef,
            teams: teamsRef,
            sustainability: sustainabilityRef,
        };
        map[key]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: "'Gotham', 'Inter', sans-serif" }}>
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
                <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-black/70" />

                <div className="relative">
                    <div className="mx-auto max-w-7xl px-6 pt-16 pb-16 md:pt-24 md:pb-20">
                        {/* Logo (NO background) */}
                        <div className="flex justify-center">
                            <img
                                src={logo}
                                alt={`${BRAND.name} logo`}
                                className="h-10 md:h-12 w-auto object-contain"
                                style={{ filter: "drop-shadow(0 14px 30px rgba(0,0,0,.65))" }}
                            />
                        </div>

                        <div className="mt-10 text-center">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-md">
                                Retail • Fashion • Lifestyle
                            </div>

                            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                                Join the team behind a
                                <span className="block text-white/70">complete lifestyle experience.</span>
                            </h1>

                            <p className="mt-6 text-base md:text-lg text-white/75 max-w-3xl mx-auto leading-relaxed">
                                From store floors to digital shelves — we build customer experiences shaped by textile craft, modern
                                design, and a focus on quality.
                            </p>

                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                                <button
                                    onClick={scrollToOpenings}
                                    className="w-full sm:w-auto rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-black hover:bg-white/90 transition-all shadow-lg shadow-black/20"
                                >
                                    View open roles
                                </button>

                                <button
                                    onClick={() => navTo("about")}
                                    className="w-full sm:w-auto rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/15 transition-all backdrop-blur-md"
                                >
                                    About Sapphire
                                </button>
                            </div>

                            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                                <StatPill icon={Briefcase} label="Open roles" value={stats.openRoles} />
                                <StatPill icon={Sparkles} label="Remote roles" value={stats.remoteRoles} />
                                <StatPill icon={Users} label="Teams hiring" value={stats.teams} />
                            </div>

                            <div className="mt-14 flex justify-center">
                                <button
                                    onClick={scrollToOpenings}
                                    className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                                >
                                    <span className="text-sm font-semibold">Explore openings</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section ref={aboutRef} id="about" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
                <div className="grid lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-7">
                        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-700">
                            Our story
                        </div>

                        <h2 className="mt-6 text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                            Built on textile craft. Evolved into modern retail.
                        </h2>

                        <p className="mt-5 text-gray-600 leading-relaxed text-lg">
                            Sapphire began as a textile business and later launched the retail brand — bringing fabric expertise,
                            design focus, and customer experience together under one name.
                        </p>

                        <div className="mt-10 rounded-3xl border border-gray-200 bg-gray-50 p-7">
                            <div className="flex items-start gap-3">
                                <div className="h-11 w-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-gray-900" />
                                </div>
                                <div>
                                    <div className="font-extrabold text-gray-900">What we build</div>
                                    <p className="mt-1 text-gray-600 leading-relaxed">
                                        A lifestyle portfolio across apparel — plus home, accessories, and more — delivered through stores
                                        and digital experiences.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sustainability */}
                    <div ref={sustainabilityRef} className="lg:col-span-5">
                        <div className="rounded-3xl border border-gray-200 bg-white p-7">
                            <div className="flex items-center gap-3">
                                <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                    <Leaf className="h-5 w-5 text-emerald-700" />
                                </div>
                                <div>
                                    <div className="text-sm font-extrabold text-gray-900">Sustainability focus</div>
                                    <div className="text-sm text-gray-600">Responsible retail, practical steps.</div>
                                </div>
                            </div>

                            <ul className="mt-6 space-y-3 text-sm text-gray-700">
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
                                    Reducing plastic usage across stores and operations
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
                                    Sustainable collections using recycled materials
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
                                    Powering stores with solar energy where possible
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
                                    Fair pay and equal opportunities across teams
                                </li>
                            </ul>

                            <div className="mt-7 grid grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                                    <HeartHandshake className="h-5 w-5 text-gray-900" />
                                    <div className="mt-2 font-bold text-gray-900">Community</div>
                                    <div className="mt-1 text-sm text-gray-600">Local impact matters.</div>
                                </div>
                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                                    <ShieldCheck className="h-5 w-5 text-gray-900" />
                                    <div className="mt-2 font-bold text-gray-900">Quality</div>
                                    <div className="mt-1 text-sm text-gray-600">Craft, consistency, care.</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            {BRAND.gallery.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt="Sapphire culture"
                                    className={`w-full h-44 object-cover rounded-3xl border border-gray-200 ${i === 1 ? "mt-6" : ""}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* TEAMS */}
            <section ref={teamsRef} className="bg-black text-white">
                <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/90">
                            Where you can join
                        </div>
                        <h2 className="mt-6 text-3xl md:text-5xl font-extrabold tracking-tight">Retail runs on great teams.</h2>
                        <p className="mt-5 text-white/70 text-lg leading-relaxed">
                            Whether you’re building store experiences, running supply chain, or scaling e-commerce — your work shows
                            up in every customer moment.
                        </p>
                    </div>

                    <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamCards.map((t) => (
                            <button
                                key={t.title}
                                onClick={() => {
                                    setSearchQuery(t.title);
                                    scrollToOpenings();
                                }}
                                className="text-left rounded-3xl border border-white/10 bg-white/5 p-7 hover:bg-white/10 transition-all"
                            >
                                <t.icon className="h-6 w-6 text-white" />
                                <div className="mt-4 text-lg font-extrabold">{t.title}</div>
                                <div className="mt-2 text-white/70 leading-relaxed">{t.hint}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ✅ HIRING PROCESS (new section above openings) */}
            <HiringProcess />

            {/* OPENINGS */}
            <section ref={openingsRef} className="mx-auto max-w-7xl px-6 py-16 md:py-20">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">Open positions</h2>
                        <p className="mt-2 text-gray-600 max-w-2xl">
                            Search by role, req no, company, or location. Filter by employment type and work mode.
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search roles, req no, locations..."
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-black/30 focus:ring-2 focus:ring-black/5 transition-all"
                        />
                    </div>
                </div>

                <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {TABS.map((t) => {
                            const active = activeTab === t.id;
                            const count = tabCounts[t.id] ?? 0;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all border ${
                                        active
                                            ? "bg-black text-white border-black shadow-sm"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-black/30 hover:bg-gray-50"
                                    }`}
                                >
                                    {t.label}{" "}
                                    <span className={`${active ? "text-white/80" : "text-gray-400"}`}>({count})</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {WORKMODE_PILLS.map((p) => {
                            const active = activeWorkMode === p.id;
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => setActiveWorkMode(p.id)}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all border ${
                                        active
                                            ? "bg-gray-900 text-white border-gray-900"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-black/30 hover:bg-gray-50"
                                    }`}
                                >
                                    {p.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* error */}
                {!loading && errorText ? (
                    <div className="mt-10 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800">
                        <div className="font-extrabold">Couldn’t load jobs</div>
                        <div className="mt-1 text-sm">{errorText}</div>
                    </div>
                ) : null}

                <div className="mt-10">
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="rounded-3xl border border-gray-200 bg-white p-6">
                                    <div className="h-5 w-24 bg-gray-100 rounded mb-4" />
                                    <div className="h-6 w-3/4 bg-gray-100 rounded mb-3" />
                                    <div className="h-4 w-full bg-gray-100 rounded mb-2" />
                                    <div className="h-4 w-2/3 bg-gray-100 rounded" />
                                    <div className="mt-6 h-10 w-full bg-gray-100 rounded-2xl" />
                                </div>
                            ))}
                        </div>
                    ) : filteredJobs.length ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredJobs.map((job) => (
                                <JobCard key={job.id} job={job} onClick={() => navigate(`/careers/jobs/${job.id}`)} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-gray-200">
                                <Search className="h-5 w-5 text-gray-500" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-gray-900">No roles found</h3>
                            <p className="mt-1 text-gray-600">Try a different keyword or change filters.</p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setActiveTab("all");
                                    setActiveWorkMode("all");
                                }}
                                className="mt-6 rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white hover:bg-black/90 transition-all"
                            >
                                Reset filters
                            </button>
                        </div>
                    )}
                </div>

                <p className="mt-10 text-sm text-gray-500">
                    Equal opportunity employer. Hiring decisions are based on skills, experience, and business needs.
                </p>
            </section>

            <Footer onNav={navTo} />
        </div>
    );
}
