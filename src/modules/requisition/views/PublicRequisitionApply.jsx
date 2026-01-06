// src/modules/requisition/views/PublicRequisitionApply.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "@config/axiosConfig.js";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import FormInput from "@components/form/FormInput.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";

import {
    ArrowLeft,
    MapPin,
    Calendar,
    Building2,
    BadgeCheck,
    UploadCloud,
    FileText,
    User,
    Mail,
    Briefcase,
    GraduationCap,
    ClipboardList,
    CheckCircle2,
    AlertTriangle,
    Instagram,
    Facebook,
    Linkedin,
    Phone,
} from "lucide-react";

import logo from "@assets/images/brand-logos/desktop-white.svg";

const BRAND = {
    name: "SAPPHIRE",
    heroBg: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2400",
};

/** ---------------------- VALIDATION HELPERS ---------------------- */
const CNIC_REGEX = /^\d{13}$/; // e.g. 37203798844979 (14 digits)
const PK_MOBILE_REGEX = /^0\d{10}$/; // e.g. 03063167781 (11 digits, starts with 0)
const DOB_MIN = new Date("1950-01-01T00:00:00");

function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

function parseISODateOnly(v) {
    if (!v) return null;
    const s = String(v);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
    const d = new Date(`${s}T00:00:00`);
    if (Number.isNaN(d.getTime())) return null;
    return d;
}

function currentMonthIndex() {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth();
}

const monthStr = z.string().min(1, "Required").regex(/^\d{4}-\d{2}$/, "Use YYYY-MM");

const nullableNumber = (opts) =>
    z.preprocess((v) => {
        if (v === "" || v === undefined || v === null) return null;
        const n = Number(v);
        return Number.isNaN(n) ? v : n;
    }, z.number(opts).nullable());

const nullableInt = (opts) =>
    z.preprocess((v) => {
        if (v === "" || v === undefined || v === null) return null;
        const n = Number(v);
        return Number.isNaN(n) ? v : n;
    }, z.number(opts).int().nullable());

// ✅ Better optional URL ("" / spaces => null; otherwise must be valid URL)
const optionalUrl = z.preprocess(
    (v) => {
        const s = (v ?? "").toString().trim();
        return s === "" ? null : s;
    },
    z.string().url("Must be a valid URL").max(2048, "URL is too long").nullable()
);

/** ---------------------- SCHEMAS ---------------------- */
const experienceSchema = z
    .object({
        company: z.string().trim().min(1, "Company is required").max(120, "Company is too long"),
        designation: z.string().trim().min(1, "Designation is required").max(120, "Designation is too long"),
        from_month: monthStr,
        to_month: monthStr,
        order_index: z.coerce.number().int().min(1).optional(),
    })
    .superRefine((val, ctx) => {
        const f = String(val.from_month || "");
        const t = String(val.to_month || "");
        if (!/^\d{4}-\d{2}$/.test(f) || !/^\d{4}-\d{2}$/.test(t)) return;

        const [fy, fm] = f.split("-").map(Number);
        const [ty, tm] = t.split("-").map(Number);
        const start = fy * 12 + (fm - 1);
        const end = ty * 12 + (tm - 1);

        // To must be after From
        if (end < start) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["to_month"],
                message: "To must be after From",
            });
        }

        // From/To cannot be in the future
        const nowIdx = currentMonthIndex();
        if (start > nowIdx) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["from_month"],
                message: "From month cannot be in the future",
            });
        }
        if (end > nowIdx) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["to_month"],
                message: "To month cannot be in the future",
            });
        }
    });

const schema = z.object({
    first_name: z.string().trim().min(1, "First Name is required").max(80, "Too long"),
    last_name: z.string().trim().min(1, "Last Name is required").max(80, "Too long"),

    // CNIC: exactly 14 digits
    cnic_number: z.string().trim().regex(CNIC_REGEX, "CNIC must be 14 digits (e.g., 37203798844979)"),

    // DOB: not future, not before 1950 (allow empty)
    date_of_birth: z
        .string()
        .optional()
        .nullable()
        .refine((v) => {
            if (!v) return true; // allow empty string/null/undefined
            const d = parseISODateOnly(v);
            if (!d) return false;
            const today = startOfToday();
            return d >= DOB_MIN && d <= today;
        }, "Date of Birth must be between Jan 1, 1950 and today"),

    // ✅ FIX: max() must be BEFORE optional/nullable (this fixes your .max is not a function error)
    city: z.string().trim().max(80, "Too long").optional().nullable(),
    home_address: z.string().trim().max(250, "Too long").optional().nullable(),

    email: z.string().trim().email("Valid email required"),

    // Mobile: 11 digits, starts with 0
    mobile_number: z.string().trim().regex(PK_MOBILE_REGEX, "Mobile must be 11 digits (e.g., 03063167781)"),

    // Optional but sensible validations
    expected_salary: nullableNumber({ invalid_type_error: "Expected salary must be a number" })
        .refine((v) => v == null || v >= 0, "Expected salary must be ≥ 0")
        .optional()
        .nullable(),

    notice_period_days: nullableInt({ invalid_type_error: "Notice period must be a number" })
        .refine((v) => v == null || (v >= 0 && v <= 3650), "Notice period must be between 0 and 3650 days")
        .optional()
        .nullable(),

    // ✅ improved (handles "" and spaces safely)
    portfolio_url: optionalUrl,

    qualifications: z
        .array(
            z.object({
                degree: z.string().trim().min(1, "Degree is required").max(120, "Too long"),
                institution: z.string().trim().min(1, "Institution is required").max(160, "Too long"),
                year_completed: nullableInt({ invalid_type_error: "Year must be a number" })
                    .refine(
                        (v) => v == null || (v >= 1900 && v <= new Date().getFullYear()),
                        "Year cannot be in the future"
                    )
                    .optional()
                    .nullable(),
                order_index: z.coerce.number().int().min(1).optional(),
            })
        )
        .optional()
        .default([]),

    experiences: z.array(experienceSchema).optional().default([]),
});

/** ---------------------- RESUME RULES ---------------------- */
const ALLOWED_RESUME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/rtf",
    "text/plain",
    "image/png",
    "image/jpeg",
    "image/jpg",
];
const MAX_RESUME_BYTES = 10 * 1024 * 1024;

function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatYYYYMM(v) {
    const s = String(v || "");
    const m = s.match(/^(\d{4})-(\d{2})$/);
    if (!m) return "—";
    const y = Number(m[1]);
    const mo = Number(m[2]);
    if (!y || mo < 1 || mo > 12) return "—";
    const d = new Date(y, mo - 1, 1);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function parseMonthYYYYMM(v) {
    const s = String(v || "");
    const m = s.match(/^(\d{4})-(\d{2})$/);
    if (!m) return null;
    const year = Number(m[1]);
    const month = Number(m[2]);
    if (!year || month < 1 || month > 12) return null;
    return { year, month };
}

function monthIndex(yyyyMM) {
    const p = parseMonthYYYYMM(yyyyMM);
    if (!p) return Number.NEGATIVE_INFINITY;
    return p.year * 12 + (p.month - 1);
}

function monthsDiffInclusive(fromYYYYMM, toYYYYMM) {
    const f = parseMonthYYYYMM(fromYYYYMM);
    const t = parseMonthYYYYMM(toYYYYMM);
    if (!f || !t) return 0;
    const start = f.year * 12 + (f.month - 1);
    const end = t.year * 12 + (t.month - 1);
    return Math.max(0, end - start + 1);
}

function computeLatestDesignation(exps) {
    const arr = Array.isArray(exps) ? exps : [];
    let best = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (const e of arr) {
        const end = monthIndex(e?.to_month);
        const start = monthIndex(e?.from_month);
        const score = Number.isFinite(end) ? end : start;
        if (score > bestScore) {
            bestScore = score;
            best = e;
        }
    }
    const d = String(best?.designation || "").trim();
    return d ? d : null;
}

const pretty = (s) => (s ? s.replaceAll("-", " ") : "");

function Pill({ icon: Icon, children }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
            {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
            {children}
        </span>
    );
}

function Stepper({ steps, currentStep }) {
    return (
        <div className="rounded-3xl border border-gray-200 bg-white p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-extrabold text-gray-900">Application steps</div>
                <div className="text-xs font-semibold text-gray-500">
                    Step {currentStep + 1} of {steps.length}
                </div>
            </div>

            <div className="mt-4 overflow-x-auto">
                <div
                    className="min-w-[680px] grid gap-3"
                    style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
                >
                    {steps.map((s, idx) => {
                        const active = idx === currentStep;
                        const done = idx < currentStep;

                        return (
                            <div key={s.title} className="flex items-center gap-2">
                                <div
                                    className={[
                                        "h-8 w-8 rounded-2xl flex items-center justify-center text-xs font-extrabold border transition-all",
                                        done
                                            ? "bg-black text-white border-black"
                                            : active
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-gray-700 border-gray-200",
                                    ].join(" ")}
                                >
                                    {done ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                                </div>

                                <div className="leading-tight">
                                    <div className={["text-xs font-extrabold", active ? "text-gray-900" : "text-gray-600"].join(" ")}>
                                        {s.title}
                                    </div>
                                    <div className="text-[11px] text-gray-400">{active ? "In progress" : done ? "Completed" : "Pending"}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-5 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-black transition-all" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
            </div>
        </div>
    );
}

/** get nested zod/rhf error message by dotted path */
function getErrorMessage(errors, path) {
    try {
        const parts = String(path).split(".");
        let cur = errors;
        for (const p of parts) {
            if (cur == null) return "";
            const key = /^\d+$/.test(p) ? Number(p) : p;
            cur = cur[key];
        }
        return cur?.message || "";
    } catch {
        return "";
    }
}

/** Simple controlled input */
function RHFInput({ name, control, errors, placeholder, type = "text" }) {
    const msg = getErrorMessage(errors, name);
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className="w-full">
                    <input
                        {...field}
                        type={type}
                        placeholder={placeholder}
                        className={[
                            "w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition-all",
                            msg ? "border-red-300 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-black/30 focus:ring-2 focus:ring-black/5",
                        ].join(" ")}
                    />
                    {msg ? <div className="mt-2 text-xs font-semibold text-red-600">{msg}</div> : null}
                </div>
            )}
        />
    );
}

/** Footer (same style as JobDetail) */
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
                            A retail lifestyle brand built on textile heritage, quality, and modern design — delivered through stores and digital experiences.
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

const PublicRequisitionApply = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [meta, setMeta] = useState(null);
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [metaError, setMetaError] = useState("");

    const [resumeFile, setResumeFile] = useState(null);
    const [resumeError, setResumeError] = useState("");
    const fileRef = useRef(null);

    const [submitted, setSubmitted] = useState(false);
    const [serverMessage, setServerMessage] = useState("");
    const [serverTone, setServerTone] = useState("info"); // info | danger | success
    const [currentStep, setCurrentStep] = useState(0);
    const [isStepBusy, setIsStepBusy] = useState(false);

    const getDefaultValues = () => ({
        first_name: "",
        last_name: "",
        cnic_number: "",
        date_of_birth: "",
        city: "",
        home_address: "",
        email: "",
        mobile_number: "",
        expected_salary: "",
        notice_period_days: "",
        portfolio_url: "",
        qualifications: [{ degree: "", institution: "", year_completed: "", order_index: 1 }],
        experiences: [{ company: "", designation: "", from_month: "", to_month: "", order_index: 1 }],
    });

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        trigger,
        reset,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: getDefaultValues(),
        mode: "onChange",
    });

    const { fields: qualFields, append: appendQual, remove: removeQual } = useFieldArray({
        control,
        name: "qualifications",
    });

    const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
        control,
        name: "experiences",
    });

    const experiencesWatch = useWatch({ control, name: "experiences" });
    const qualificationsWatch = useWatch({ control, name: "qualifications" });

    const totalExpMonths = useMemo(() => {
        const exps = Array.isArray(experiencesWatch) ? experiencesWatch : [];
        return exps.reduce((sum, e) => sum + monthsDiffInclusive(e?.from_month, e?.to_month), 0);
    }, [experiencesWatch]);

    const totalExpYears = useMemo(() => {
        const years = totalExpMonths / 12;
        return Number.isFinite(years) ? Number(years.toFixed(2)) : 0;
    }, [totalExpMonths]);

    const latestDesignation = useMemo(() => computeLatestDesignation(experiencesWatch), [experiencesWatch]);

    const steps = [
        {
            title: "Personal",
            icon: User,
            fields: ["first_name", "last_name", "cnic_number", "date_of_birth", "city", "home_address"],
        },
        {
            title: "Contact",
            icon: Mail,
            fields: ["email", "mobile_number", "expected_salary", "notice_period_days"],
        },
        {
            title: "Portfolio & Resume",
            icon: Briefcase,
            fields: ["portfolio_url"],
        },
        { title: "Qualifications", icon: GraduationCap, fields: ["qualifications"] },
        { title: "Experiences", icon: ClipboardList, fields: ["experiences"] },
        { title: "Review", icon: BadgeCheck, fields: [] },
    ];

    const RESUME_STEP_INDEX = 2;
    const EXPERIENCES_STEP_INDEX = 4;

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoadingMeta(true);
                setMetaError("");
                const { data } = await api.get(`/employment-applications/public/requisition/${slug}/`);
                if (mounted) setMeta(data?.data || null);
            } catch (e) {
                if (mounted) setMetaError(e?.response?.data?.message || "Unable to load job details.");
            } finally {
                if (mounted) setLoadingMeta(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [slug]);

    const applicationClosed = useMemo(() => {
        if (!meta?.application_deadline) return false;
        try {
            const today = new Date();
            const deadline = new Date(meta.application_deadline);
            deadline.setHours(23, 59, 59, 999);
            return today > deadline;
        } catch {
            return false;
        }
    }, [meta]);

    const validateResume = (file) => {
        if (!file) return "Please attach your resume (PDF/DOC/DOCX/RTF/TXT/PNG/JPG).";
        if (!ALLOWED_RESUME_TYPES.includes(file.type)) return "Unsupported file type. Please upload PDF/DOC/DOCX/RTF/TXT/PNG/JPG.";
        if (file.size > MAX_RESUME_BYTES) return "File too large (max 10MB).";
        return "";
    };

    const onFileChange = (e) => {
        const f = e.target.files?.[0] || null;
        setResumeFile(f);
        setResumeError(validateResume(f));
    };

    const buildPayload = (values) => {
        const experiences = (values.experiences || [])
            .filter((e) => e.company || e.designation || e.from_month || e.to_month)
            .map((e, idx) => {
                const months = monthsDiffInclusive(e.from_month, e.to_month);
                const yearsInRole = Number((months / 12).toFixed(2));
                return {
                    company: e.company,
                    designation: e.designation,
                    from_month: e.from_month,
                    to_month: e.to_month,
                    years_in_role: Number.isFinite(yearsInRole) ? yearsInRole : 0,
                    order_index: e.order_index || idx + 1,
                };
            });

        const computedMonths = experiences.reduce((sum, e) => sum + monthsDiffInclusive(e.from_month, e.to_month), 0);
        const computedYears = Number((computedMonths / 12).toFixed(2));

        const current_job_title = computeLatestDesignation(experiences);

        return {
            first_name: values.first_name,
            last_name: values.last_name,
            cnic_number: values.cnic_number,
            date_of_birth: values.date_of_birth || null,
            city: values.city || "",
            home_address: values.home_address || "",
            email: values.email.trim().toLowerCase(),
            mobile_number: values.mobile_number,
            expected_salary: values.expected_salary === "" || values.expected_salary == null ? null : Number(values.expected_salary),
            notice_period_days: values.notice_period_days === "" || values.notice_period_days == null ? null : Number(values.notice_period_days),
            portfolio_url: values.portfolio_url || null,
            qualifications: (values.qualifications || [])
                .filter((q) => q.degree || q.institution)
                .map((q, idx) => ({
                    degree: q.degree,
                    institution: q.institution,
                    year_completed: q.year_completed === "" || q.year_completed == null ? null : Number(q.year_completed),
                    order_index: q.order_index || idx + 1,
                })),
            experiences,
            total_experience_years: Number.isFinite(computedYears) ? computedYears : 0,
            current_job_title,
        };
    };

    const scrollToFirstError = (fieldNames) => {
        const firstErrName = (fieldNames || []).find((f) => !!errors?.[f]);
        if (!firstErrName) return;
        const el = document.querySelector(`[name="${firstErrName}"]`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const handleNext = async () => {
        try {
            setIsStepBusy(true);

            const currentFields = steps[currentStep].fields || [];
            const ok = currentFields.length ? await trigger(currentFields) : true;

            if (!ok) {
                scrollToFirstError(currentFields);
                return;
            }

            if (currentStep === RESUME_STEP_INDEX) {
                const err = validateResume(resumeFile);
                if (err) {
                    setResumeError(err);
                    setServerMessage(err);
                    setServerTone("danger");
                    return;
                }
            }

            setServerMessage("");
            setServerTone("info");

            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setIsStepBusy(false);
        }
    };

    const handleClear = () => {
        reset(getDefaultValues());
        setCurrentStep(0);
        setResumeFile(null);
        setResumeError("");
        setServerMessage("");
        setServerTone("info");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onSubmit = async (values) => {
        try {
            setServerMessage("");
            setServerTone("info");

            const err = validateResume(resumeFile);
            if (err) {
                setCurrentStep(RESUME_STEP_INDEX);
                setResumeError(err);
                setServerMessage(err);
                setServerTone("danger");
                return;
            }

            const payload = buildPayload(values);
            const formData = new FormData();
            formData.append("payload", JSON.stringify(payload));
            formData.append("resume_file", resumeFile);

            const res = await api.post(`/employment-applications/public/requisition/${slug}/apply/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSubmitted(true);
            setServerMessage(res?.data?.message || "Your application has been submitted successfully.");
            setServerTone("success");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (e) {
            const msg = e?.response?.data?.message || e?.response?.data?.errors || e?.message || "Submission failed.";
            const text = typeof msg === "string" ? msg : "Submission failed.";
            setServerMessage(text);
            setServerTone("danger");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    /** ---------------------- STATES ---------------------- */
    if (loadingMeta) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-6">
                <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (metaError) {
        return (
            <div className="min-h-screen bg-white">
                <div className="mx-auto max-w-3xl px-6 py-16">
                    <div className="rounded-3xl border border-gray-200 bg-white p-8">
                        <div className="flex items-start gap-3">
                            <div className="h-11 w-11 rounded-2xl border border-red-200 bg-red-50 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-red-700" />
                            </div>
                            <div>
                                <div className="text-xl font-extrabold text-gray-900">This job is unavailable</div>
                                <div className="mt-2 text-gray-600">{metaError}</div>
                                <div className="mt-6">
                                    <Link
                                        to="/careers"
                                        className="inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-3 text-sm font-extrabold text-white hover:bg-black/90 transition-all"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to careers
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer onCareers={() => navigate("/careers")} />
            </div>
        );
    }

    if (applicationClosed) {
        return (
            <div className="min-h-screen bg-white">
                <div className="mx-auto max-w-3xl px-6 py-16">
                    <div className="rounded-3xl border border-gray-200 bg-white p-8">
                        <div className="flex items-start gap-3">
                            <div className="h-11 w-11 rounded-2xl border border-red-200 bg-red-50 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-red-700" />
                            </div>
                            <div>
                                <div className="text-xl font-extrabold text-gray-900">Applications Closed</div>
                                <div className="mt-2 text-gray-600">The deadline for this role has passed. Please check other openings.</div>
                                <div className="mt-6">
                                    <Link
                                        to="/careers"
                                        className="inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-3 text-sm font-extrabold text-white hover:bg-black/90 transition-all"
                                    >
                                        Browse careers
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer onCareers={() => navigate("/careers")} />
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-white">
                <section className="relative overflow-hidden">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url(${BRAND.heroBg})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                    <div className="absolute inset-0 bg-black/70" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

                    <div className="relative">
                        <div className="mx-auto max-w-4xl px-6 pt-10 pb-14">
                            <button
                                onClick={() => navigate("/careers")}
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition-all backdrop-blur-md"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to careers
                            </button>

                            <div className="mt-10 max-w-2xl">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-md">
                                    Application submitted
                                </div>

                                <h1 className="mt-6 text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                                    {meta?.title || pretty(slug)}
                                </h1>

                                <p className="mt-4 text-white/75 text-base md:text-lg leading-relaxed">
                                    {serverMessage || "Thank you for your submission! We have received your application."}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mx-auto max-w-4xl px-6 py-12">
                    <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-10">
                        <div className="flex items-start gap-3">
                            <div className="h-12 w-12 rounded-2xl border border-emerald-200 bg-emerald-50 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-emerald-700" />
                            </div>
                            <div>
                                <div className="text-xl font-extrabold text-gray-900">We’ve got it.</div>
                                <div className="mt-2 text-gray-600">
                                    Our team reviews applications daily. If you’re shortlisted, we’ll contact you within a few working days.
                                </div>

                                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => navigate("/careers")}
                                        className="rounded-2xl bg-black px-6 py-3.5 text-sm font-extrabold text-white hover:bg-black/90 transition-all"
                                    >
                                        View other roles
                                    </button>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-3.5 text-sm font-extrabold text-gray-900 hover:bg-gray-100 hover:border-black/20 transition-all"
                                    >
                                        Submit another response
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer onCareers={() => navigate("/careers")} />
            </div>
        );
    }

    /** ---------------------- STEP RENDERS ---------------------- */
    const renderPersonalStep = () => (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-6">
                <FormInput name="first_name" control={control} errors={errors} placeholder="First Name" is_required />
            </div>
            <div className="col-span-12 sm:col-span-6">
                <FormInput name="last_name" control={control} errors={errors} placeholder="Last Name" is_required />
            </div>
            <div className="col-span-12 sm:col-span-6">
                <FormInput name="cnic_number" control={control} errors={errors} placeholder="CNIC Number (14 digits)" is_required />
            </div>
            <div className="col-span-12 sm:col-span-6">
                <FormInput type="date" name="date_of_birth" control={control} errors={errors} placeholder="Date of Birth" />
            </div>
            <div className="col-span-12 sm:col-span-6">
                <FormInput name="city" control={control} errors={errors} placeholder="City" />
            </div>
            <div className="col-span-12">
                <FormTextarea name="home_address" control={control} errors={errors} placeholder="Home Address" rows={2} />
            </div>
        </div>
    );

    const renderContactStep = () => (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-6">
                <FormInput type="email" name="email" control={control} errors={errors} placeholder="Email Address" is_required />
            </div>
            <div className="col-span-12 sm:col-span-6">
                <FormInput name="mobile_number" control={control} errors={errors} placeholder="Mobile Number (e.g., 03063167781)" is_required />
            </div>

            <div className="col-span-12 sm:col-span-6">
                <FormInput type="number" name="expected_salary" control={control} errors={errors} placeholder="Expected Salary" />
            </div>
            <div className="col-span-12 sm:col-span-6">
                <FormInput type="number" name="notice_period_days" control={control} errors={errors} placeholder="Notice Period (days)" />
            </div>
        </div>
    );

    const renderResumeBlock = () => (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-sm font-extrabold text-gray-900">Resume / CV</div>
                    <div className="mt-1 text-sm text-gray-600">Upload a PDF/DOC/DOCX/RTF/TXT/PNG/JPG (max 10MB).</div>
                </div>
                <div className="h-11 w-11 rounded-2xl border border-gray-200 bg-white flex items-center justify-center">
                    <FileText className="h-5 w-5 text-gray-700" />
                </div>
            </div>

            <div className="mt-4">
                <label className="block text-xs font-bold text-gray-600 mb-2">Choose file *</label>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.rtf,.txt,.png,.jpg,.jpeg"
                        onChange={onFileChange}
                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5 transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-extrabold text-white hover:bg-black/90 transition-all"
                    >
                        <UploadCloud className="h-4 w-4" />
                        Upload
                    </button>
                </div>

                {resumeFile ? (
                    <div className="mt-3 text-xs text-gray-600">
                        Selected: <span className="font-semibold text-gray-900">{resumeFile.name}</span>{" "}
                        <span className="text-gray-400">•</span> {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                ) : null}

                {resumeError ? <div className="mt-2 text-xs font-semibold text-red-600">{resumeError}</div> : null}
            </div>
        </div>
    );

    const renderProfessionalStep = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                    <FormInput name="portfolio_url" control={control} errors={errors} placeholder="LinkedIn / Portfolio URL (optional)" />
                </div>
            </div>
            {renderResumeBlock()}
        </div>
    );

    const renderQualificationsStep = () => (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <div className="text-sm font-extrabold text-gray-900">Qualifications</div>
                    <div className="mt-1 text-sm text-gray-600">Add your degrees and institutions (latest first).</div>
                </div>
                <button
                    type="button"
                    onClick={() =>
                        appendQual({
                            degree: "",
                            institution: "",
                            year_completed: "",
                            order_index: (qualFields?.length || 0) + 1,
                        })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-extrabold text-white hover:bg-black/90 transition-all"
                >
                    + Add
                </button>
            </div>

            {qualFields?.length ? (
                <div className="space-y-4">
                    {qualFields.map((f, idx) => (
                        <div key={f.id} className="rounded-3xl border border-gray-200 bg-white p-5">
                            <div className="grid grid-cols-12 gap-4 items-end">
                                <div className="col-span-12 md:col-span-4">
                                    <FormInput name={`qualifications.${idx}.degree`} control={control} errors={errors} placeholder="Degree" />
                                </div>
                                <div className="col-span-12 md:col-span-5">
                                    <FormInput
                                        name={`qualifications.${idx}.institution`}
                                        control={control}
                                        errors={errors}
                                        placeholder="Institution"
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-3">
                                    <FormInput
                                        type="number"
                                        name={`qualifications.${idx}.year_completed`}
                                        control={control}
                                        errors={errors}
                                        placeholder="Year Completed"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                {idx > 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => removeQual(idx)}
                                        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-extrabold text-gray-900 hover:bg-gray-100 hover:border-black/20 transition-all"
                                    >
                                        Remove
                                    </button>
                                ) : (
                                    <div className="text-xs text-gray-400 font-semibold">Primary entry</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                    <div className="mx-auto h-11 w-11 rounded-2xl border border-gray-200 bg-white flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-gray-700" />
                    </div>
                    <div className="mt-3 text-sm font-extrabold text-gray-900">No qualifications added yet</div>
                    <div className="mt-1 text-sm text-gray-600">Click “Add” to include your education.</div>
                </div>
            )}
        </div>
    );

    const renderExperiencesStep = () => (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <div className="text-sm font-extrabold text-gray-900">Experiences</div>
                    <div className="mt-1 text-sm text-gray-600">Add relevant roles you’ve held.</div>
                </div>
                <button
                    type="button"
                    onClick={() =>
                        appendExp({
                            company: "",
                            designation: "",
                            from_month: "",
                            to_month: "",
                            order_index: (expFields?.length || 0) + 1,
                        })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-extrabold text-white hover:bg-black/90 transition-all"
                >
                    + Add
                </button>
            </div>

            {expFields?.length ? (
                <div className="space-y-4">
                    {expFields.map((f, idx) => (
                        <div key={f.id} className="rounded-3xl border border-gray-200 bg-white p-5">
                            <div className="grid grid-cols-12 gap-4 items-end">
                                <div className="col-span-12 md:col-span-6">
                                    <RHFInput name={`experiences.${idx}.company`} control={control} errors={errors} placeholder="Company" />
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <RHFInput
                                        name={`experiences.${idx}.designation`}
                                        control={control}
                                        errors={errors}
                                        placeholder="Designation"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-12 gap-4 items-end">
                                <div className="col-span-12 md:col-span-6">
                                    <FormInput
                                        type="month"
                                        name={`experiences.${idx}.from_month`}
                                        control={control}
                                        errors={errors}
                                        placeholder="From (YYYY-MM)"
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <FormInput
                                        type="month"
                                        name={`experiences.${idx}.to_month`}
                                        control={control}
                                        errors={errors}
                                        placeholder="To (YYYY-MM)"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                {idx > 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => removeExp(idx)}
                                        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-extrabold text-gray-900 hover:bg-gray-100 hover:border-black/20 transition-all"
                                    >
                                        Remove
                                    </button>
                                ) : (
                                    <div className="text-xs text-gray-400 font-semibold">Primary entry</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                    <div className="mx-auto h-11 w-11 rounded-2xl border border-gray-200 bg-white flex items-center justify-center">
                        <ClipboardList className="h-5 w-5 text-gray-700" />
                    </div>
                    <div className="mt-3 text-sm font-extrabold text-gray-900">No experiences added yet</div>
                    <div className="mt-1 text-sm text-gray-600">Click “Add” to include your work history.</div>
                </div>
            )}

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                <div className="text-sm font-extrabold text-gray-900">Total Experience (auto)</div>
                <div className="mt-2">
                    <input
                        value={`${totalExpYears} years`}
                        readOnly
                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none"
                    />
                </div>
                {latestDesignation ? (
                    <div className="mt-2 text-xs text-gray-600">
                        Current Job Title (auto): <span className="font-semibold text-gray-900">{latestDesignation}</span>
                    </div>
                ) : null}
            </div>
        </div>
    );

    const renderReviewStep = () => {
        const personal = {
            name: `${watch("first_name") || ""} ${watch("last_name") || ""}`.trim() || "—",
            cnic: watch("cnic_number") || "—",
            dob: watch("date_of_birth") || "—",
            city: watch("city") || "—",
            address: watch("home_address") || "—",
        };

        const contact = {
            email: watch("email") || "—",
            mobile: watch("mobile_number") || "—",
            salary: watch("expected_salary") || "—",
            notice: watch("notice_period_days") || "—",
        };

        const portfolio = watch("portfolio_url") || "—";
        const quals = Array.isArray(qualificationsWatch) ? qualificationsWatch : [];
        const exps = Array.isArray(experiencesWatch) ? experiencesWatch : [];

        return (
            <div className="space-y-6">
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                    <div className="text-sm font-extrabold text-gray-900">Personal</div>
                    <div className="mt-2 text-sm text-gray-600 leading-relaxed space-y-1">
                        <div>
                            <span className="font-semibold text-gray-900">{personal.name}</span>
                        </div>
                        <div>CNIC: {personal.cnic}</div>
                        <div>DOB: {personal.dob}</div>
                        <div>City: {personal.city}</div>
                        <div>Address: {personal.address}</div>
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                    <div className="text-sm font-extrabold text-gray-900">Contact & Availability</div>
                    <div className="mt-2 text-sm text-gray-600 leading-relaxed space-y-1">
                        <div>Email: {contact.email}</div>
                        <div>Mobile: {contact.mobile}</div>
                        <div>Expected Salary: {contact.salary}</div>
                        <div>Notice Period: {contact.notice} days</div>
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                    <div className="text-sm font-extrabold text-gray-900">Professional Summary</div>
                    <div className="mt-2 text-sm text-gray-600 leading-relaxed space-y-1">
                        <div>Total Experience: {totalExpYears} years</div>
                        <div>Current Job Title (auto): {latestDesignation || "—"}</div>
                        <div>Portfolio: {portfolio}</div>
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-6">
                    <div className="text-sm font-extrabold text-gray-900">Qualifications</div>
                    {quals?.length ? (
                        <div className="mt-3 space-y-2 text-sm text-gray-700">
                            {quals.map((q, idx) => (
                                <div key={idx} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                    <div className="font-extrabold text-gray-900">{q?.degree || "—"}</div>
                                    <div className="text-gray-700">{q?.institution || "—"}</div>
                                    <div className="text-xs text-gray-500 mt-1">Year: {q?.year_completed || "—"}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-2 text-sm text-gray-600">—</div>
                    )}
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-6">
                    <div className="text-sm font-extrabold text-gray-900">Experiences</div>
                    {exps?.length ? (
                        <div className="mt-3 space-y-2">
                            {exps.map((e, idx) => {
                                const months = monthsDiffInclusive(e?.from_month, e?.to_month);
                                const years = Number((months / 12).toFixed(2));
                                return (
                                    <div key={idx} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                        <div className="font-extrabold text-gray-900">{e?.company || "—"}</div>
                                        <div className="text-sm text-gray-700">{e?.designation || "—"}</div>
                                        <div className="text-xs text-gray-600 mt-2">
                                            {formatYYYYMM(e?.from_month)} → {formatYYYYMM(e?.to_month)}{" "}
                                            <span className="text-gray-400">•</span>{" "}
                                            {Number.isFinite(years) ? `${years} yrs` : "—"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-2 text-sm text-gray-600">—</div>
                    )}
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="text-sm font-extrabold text-gray-900">Resume</div>
                            <div className="mt-1 text-sm text-gray-600">
                                {resumeFile ? (
                                    <>
                                        <span className="font-semibold text-gray-900">{resumeFile.name}</span>{" "}
                                        <span className="text-gray-400">•</span>{" "}
                                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                                    </>
                                ) : (
                                    <span className="text-red-600 font-semibold">Missing</span>
                                )}
                            </div>
                        </div>
                        <div className="h-11 w-11 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-gray-700" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const CurrentStepIcon = steps[currentStep]?.icon || BadgeCheck;
    const currentTitle = steps[currentStep]?.title || "Application";

    const toneBox =
        serverTone === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
            : serverTone === "danger"
                ? "border-red-200 bg-red-50 text-red-900"
                : "border-gray-200 bg-gray-50 text-gray-900";

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
                <div className="absolute inset-0 bg-black/65" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/80" />

                <div className="relative">
                    <div className="mx-auto max-w-7xl px-6 pt-8 pb-10 md:pt-12 md:pb-14">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => navigate("/careers")}
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition-all backdrop-blur-md"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to careers
                            </button>

                            <div className="hidden sm:flex items-center gap-2 text-white/80 text-xs font-semibold">
                                <BadgeCheck className="h-4 w-4" />
                                Public application
                            </div>
                        </div>

                        <div className="mt-10 max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-md">
                                Apply for this role
                            </div>

                            <h1 className="mt-6 text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                                {meta?.title || pretty(slug)}
                            </h1>

                            <div className="mt-5 flex flex-wrap gap-2">
                                <Pill icon={BadgeCheck}>{meta?.req_no || "—"}</Pill>
                                {meta?.company?.name ? <Pill icon={Building2}>{meta.company.name}</Pill> : null}
                                {meta?.location?.name ? <Pill icon={MapPin}>{meta.location.name}</Pill> : null}
                                {meta?.application_deadline ? <Pill icon={Calendar}>Deadline: {formatDate(meta.application_deadline)}</Pill> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
                <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-6">
                        <Stepper steps={steps} currentStep={currentStep} />

                        {serverMessage ? (
                            <div className={`rounded-3xl border p-5 md:p-6 ${toneBox}`}>
                                <div className="flex items-start gap-3">
                                    <div className="h-11 w-11 rounded-2xl border border-black/10 bg-white/60 flex items-center justify-center">
                                        {serverTone === "danger" ? (
                                            <AlertTriangle className="h-5 w-5" />
                                        ) : serverTone === "success" ? (
                                            <CheckCircle2 className="h-5 w-5" />
                                        ) : (
                                            <BadgeCheck className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-sm font-extrabold">
                                            {serverTone === "danger" ? "Something needs attention" : serverTone === "success" ? "Success" : "Note"}
                                        </div>
                                        <div className="mt-1 text-sm opacity-90">{serverMessage}</div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Current step</div>
                                        <div className="mt-1 text-xl font-extrabold text-gray-900">{currentTitle}</div>
                                        <div className="mt-1 text-sm text-gray-600">
                                            Please fill the details carefully. Required fields must be completed to proceed.
                                        </div>
                                    </div>
                                    <div className="h-12 w-12 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center">
                                        <CurrentStepIcon className="h-6 w-6 text-gray-900" />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    {currentStep === 0 ? renderPersonalStep() : null}
                                    {currentStep === 1 ? renderContactStep() : null}
                                    {currentStep === 2 ? renderProfessionalStep() : null}
                                    {currentStep === 3 ? renderQualificationsStep() : null}
                                    {currentStep === EXPERIENCES_STEP_INDEX ? renderExperiencesStep() : null}
                                    {currentStep === 5 ? renderReviewStep() : null}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-gray-200 bg-white p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        {currentStep > 0 ? (
                                            <button
                                                type="button"
                                                onClick={() => setCurrentStep((p) => Math.max(p - 1, 0))}
                                                className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-3 text-sm font-extrabold text-gray-900 hover:bg-gray-100 hover:border-black/20 transition-all"
                                            >
                                                Back
                                            </button>
                                        ) : null}

                                        {currentStep < steps.length - 1 ? (
                                            <button
                                                type="button"
                                                onClick={handleNext}
                                                disabled={isStepBusy}
                                                className="rounded-2xl bg-black px-6 py-3 text-sm font-extrabold text-white hover:bg-black/90 transition-all disabled:opacity-60"
                                            >
                                                {isStepBusy ? "Validating..." : "Next"}
                                            </button>
                                        ) : (
                                            <FormButton
                                                isLoading={isSubmitting}
                                                label={isSubmitting ? "Submitting..." : "Submit application"}
                                                className="rounded-2xl bg-black px-6 py-3 text-sm font-extrabold text-white hover:bg-black/90 transition-all"
                                            />
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-extrabold text-gray-900 hover:bg-gray-50 hover:border-black/20 transition-all"
                                    >
                                        Clear
                                    </button>
                                </div>

                                {currentStep === RESUME_STEP_INDEX && !resumeFile ? (
                                    <div className="mt-4 text-xs text-gray-500">Resume is required to proceed from this step.</div>
                                ) : null}
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-6 space-y-4">
                            <div className="rounded-3xl border border-gray-200 bg-white p-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-extrabold text-gray-900">Role summary</div>
                                    <div className="h-10 w-10 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center">
                                        <BadgeCheck className="h-5 w-5 text-gray-900" />
                                    </div>
                                </div>

                                <div className="mt-4 space-y-3 text-sm">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                        <span className="text-gray-500 inline-flex items-center gap-2">
                                            <BadgeCheck className="h-4 w-4" />
                                            Req No
                                        </span>
                                        <span className="font-extrabold text-gray-900">{meta?.req_no || "—"}</span>
                                    </div>

                                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                        <span className="text-gray-500 inline-flex items-center gap-2">
                                            <Building2 className="h-4 w-4" />
                                            Company
                                        </span>
                                        <span className="font-extrabold text-gray-900">{meta?.company?.name || "—"}</span>
                                    </div>

                                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                        <span className="text-gray-500 inline-flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Location
                                        </span>
                                        <span className="font-extrabold text-gray-900">{meta?.location?.name || "—"}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500 inline-flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Deadline
                                        </span>
                                        <span className="font-extrabold text-gray-900">
                                            {meta?.application_deadline ? formatDate(meta.application_deadline) : "—"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                                <div className="text-sm font-extrabold text-gray-900">Tips</div>
                                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-2 w-2 rounded-full bg-gray-900" />
                                        Use 14-digit CNIC (no dashes).
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-2 w-2 rounded-full bg-gray-900" />
                                        Use 11-digit mobile number starting with 0.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-2 w-2 rounded-full bg-gray-900" />
                                        Experience “To” month cannot be in the future.
                                    </li>
                                </ul>

                                <button
                                    type="button"
                                    onClick={() => navigate("/careers")}
                                    className="mt-5 w-full rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-extrabold text-gray-900 hover:bg-gray-50 hover:border-black/20 transition-all"
                                >
                                    Back to careers
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-10 text-xs text-gray-500">
                    Equal opportunity employer. Hiring decisions are based on skills, experience, and business needs.
                </p>
            </div>

            {/* ✅ Footer added */}
            <Footer onCareers={() => navigate("/careers")} />
        </div>
    );
};

export default PublicRequisitionApply;
