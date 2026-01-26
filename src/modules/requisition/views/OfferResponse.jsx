// src/modules/public/views/OfferResponse.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "@config/axiosConfig.js";
import {
    ArrowLeft,
    BadgeCheck,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    Mail,
    Phone,
    Instagram,
    Facebook,
    Linkedin,
} from "lucide-react";

import logo from "@assets/images/brand-logos/desktop-white.svg";

const BRAND = {
    name: "SAPPHIRE",
    heroBg:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2400",
};

// --- Helpers ---
function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

function isISODateOnly(v) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(v || ""));
}

function todayISO() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
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
                            A retail lifestyle brand built on textile heritage, quality, and modern design — delivered
                            through stores and digital experiences.
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
                                <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                    Hiring
                                </div>
                                <div className="mt-1 text-sm text-white/80">
                                    We review applications daily. Shortlisted candidates are contacted within a few working
                                    days.
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

export default function OfferResponse() {
    const navigate = useNavigate();
    const query = useQuery();

    const token = query.get("token") || "";
    const action = (query.get("action") || "").toLowerCase(); // accept | decline

    const isAccept = action === "accept";
    const isDecline = action === "decline";

    // ✅ Change this in ONE place to match your backend route:
    // Example expected backend (public): POST /careers/offer-response/
    const API_PATH = "/careers/offer/respond/";

    const [joiningDate, setJoiningDate] = useState(todayISO());
    const [remarks, setRemarks] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [tone, setTone] = useState("info"); // info | danger | success
    const [message, setMessage] = useState("");
    const [done, setDone] = useState(false);

    // Basic URL validation
    useEffect(() => {
        if (!token) {
            setTone("danger");
            setMessage("Offer link is missing token.");
            return;
        }
        if (!isAccept && !isDecline) {
            setTone("danger");
            setMessage("Offer link has invalid action. Please use the Accept or Decline link from email.");
            return;
        }
        setTone("info");
        setMessage("");
    }, [token, isAccept, isDecline]);

    const canSubmit = useMemo(() => {
        if (!token) return false;
        if (!isAccept && !isDecline) return false;
        if (isAccept && !isISODateOnly(joiningDate)) return false;
        return true;
    }, [token, isAccept, isDecline, joiningDate]);

    const toneBox =
        tone === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
            : tone === "danger"
                ? "border-rose-200 bg-rose-50 text-rose-900"
                : "border-gray-200 bg-gray-50 text-gray-900";

    const submit = async () => {
        try {
            setSubmitting(true);
            setTone("info");
            setMessage("");

            if (!canSubmit) {
                setTone("danger");
                setMessage(isAccept ? "Please select a valid joining date." : "Invalid offer link.");
                return;
            }

            const payload = {
                token,
                action, // accept | decline
                remarks: remarks?.trim() || "",
                joining_date: isAccept ? joiningDate : null,
            };

            // Expect backend to respond with {data:{application_id,status,joining_date}, status:true, message:"..."}
            const res = await api.post(API_PATH, payload);

            setTone("success");
            setDone(true);
            setMessage(res?.data?.message || "Your response has been recorded. Thank you.");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (e) {
            const msg =
                e?.response?.data?.message ||
                (typeof e?.response?.data?.errors === "string" ? e.response.data.errors : "") ||
                (e?.response?.data?.errors && JSON.stringify(e.response.data.errors)) ||
                e?.message ||
                "Unable to submit response.";

            setTone("danger");
            setMessage(msg);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setSubmitting(false);
        }
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
                                Offer response
                            </div>
                        </div>

                        <div className="mt-10 max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-md">
                                {isAccept ? "Accept offer" : isDecline ? "Decline offer" : "Offer response"}
                            </div>

                            <h1 className="mt-6 text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                                {isAccept ? "Confirm your joining date" : isDecline ? "Confirm decline" : "Offer response"}
                            </h1>

                            <p className="mt-4 text-white/75 text-base md:text-lg leading-relaxed">
                                {isAccept
                                    ? "Please confirm your expected joining date to accept the offer."
                                    : isDecline
                                        ? "You can share a short note (optional) before submitting."
                                        : "Please use the correct link from your email."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
                {message ? (
                    <div className={`rounded-3xl border p-5 md:p-6 ${toneBox}`}>
                        <div className="flex items-start gap-3">
                            <div className="h-11 w-11 rounded-2xl border border-black/10 bg-white/60 flex items-center justify-center">
                                {tone === "danger" ? (
                                    <AlertTriangle className="h-5 w-5" />
                                ) : tone === "success" ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    <BadgeCheck className="h-5 w-5" />
                                )}
                            </div>
                            <div>
                                <div className="text-sm font-extrabold">
                                    {tone === "danger" ? "Something needs attention" : tone === "success" ? "Success" : "Note"}
                                </div>
                                <div className="mt-1 text-sm opacity-90">{message}</div>
                            </div>
                        </div>
                    </div>
                ) : null}

                <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Offer response</div>
                            <div className="mt-1 text-xl font-extrabold text-gray-900">
                                {isAccept ? "Accept offer" : isDecline ? "Decline offer" : "Invalid link"}
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                                {done
                                    ? "Your response has been submitted."
                                    : isAccept
                                        ? "Joining date is required for acceptance."
                                        : isDecline
                                            ? "Remarks are optional."
                                            : "This link is missing required information."}
                            </div>
                        </div>

                        <div className="h-12 w-12 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-gray-900" />
                        </div>
                    </div>

                    {/* FORM */}
                    {!done ? (
                        <div className="mt-6 space-y-4">
                            {isAccept ? (
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-2">Joining date *</label>
                                    <input
                                        type="date"
                                        value={joiningDate}
                                        onChange={(e) => setJoiningDate(e.target.value)}
                                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5 transition-all"
                                    />
                                    <div className="mt-2 text-xs text-gray-500">
                                        Please choose the date you can join (YYYY-MM-DD).
                                    </div>
                                </div>
                            ) : null}

                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-2">Remarks (optional)</label>
                                <textarea
                                    rows={4}
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder={isAccept ? "Any note for HR (optional)" : "Reason / note (optional)"}
                                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5 transition-all"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={submit}
                                    disabled={!canSubmit || submitting}
                                    className="rounded-2xl bg-black px-6 py-3 text-sm font-extrabold text-white hover:bg-black/90 transition-all disabled:opacity-60"
                                >
                                    {submitting ? "Submitting..." : isAccept ? "Submit acceptance" : "Submit decline"}
                                </button>

                                <Link
                                    to="/careers"
                                    className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-3 text-sm font-extrabold text-gray-900 hover:bg-gray-100 hover:border-black/20 transition-all text-center"
                                >
                                    Back to careers
                                </Link>
                            </div>

                            <div className="pt-2 text-xs text-gray-500">
                                This link is unique to you. Please don’t share it.
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6">
                            <button
                                onClick={() => navigate("/careers")}
                                className="rounded-2xl bg-black px-6 py-3 text-sm font-extrabold text-white hover:bg-black/90 transition-all"
                            >
                                View other roles
                            </button>
                        </div>
                    )}
                </div>

                <p className="mt-10 text-xs text-gray-500">
                    Equal opportunity employer. Hiring decisions are based on skills, experience, and business needs.
                </p>
            </div>

            <Footer onCareers={() => navigate("/careers")} />
        </div>
    );
}
