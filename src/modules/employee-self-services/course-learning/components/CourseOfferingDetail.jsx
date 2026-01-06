import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "@config/axiosConfig.js";

const formatDate = (iso) => {
    if (!iso) return "—";
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export default function CourseOfferingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [offering, setOffering] = useState(location.state?.offering || null);

    // ✅ inline player state
    const [showPlayer, setShowPlayer] = useState(false);
    const playerRef = useRef(null);

    const isEnrolled = Boolean(offering?.enrollment);
    const canSelfEnroll = Boolean(offering?.self_enrollment);

    const title = offering?.courses?.title ?? "—";
    const slug = offering?.courses?.slug ?? "—";
    const launchUrl = offering?.launch_url || "";

    // ✅ date conditions (only for hero line)
    const hasStartDate = Boolean(offering?.start_date);
    const hasEndDate = Boolean(offering?.end_date);
    const showDateRange = hasStartDate && hasEndDate;

    const fetchDetail = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get(`/lms/course-offerings/${id}/`);
            setOffering(res?.data?.data ?? res?.data ?? null);
        } catch (e) {
            setError(e?.response?.data?.message || "Failed to load course detail.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!offering && id) fetchDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const selfEnroll = async () => {
        if (!id) return;
        setEnrolling(true);
        setError("");
        setSuccess("");
        try {
            await api.post("/lms/course-enrollments/self/", { offering_id: Number(id) });
            setSuccess("Successfully enrolled in the course!");
            await fetchDetail();
        } catch (e) {
            const backendMsg =
                e?.response?.data?.message ||
                e?.response?.data?.errors?.offering_id ||
                "Self enrollment failed.";
            setError(backendMsg);
        } finally {
            setEnrolling(false);
        }
    };

    const canOpenCourse = useMemo(() => isEnrolled && Boolean(launchUrl), [isEnrolled, launchUrl]);

    const openInlinePlayer = () => {
        setShowPlayer(true);
        setTimeout(() => {
            playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
            {/* Hero Section */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-900/90 z-10"></div>
                <div
                    className="h-[600px] bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80')",
                    }}
                ></div>

                <div className="absolute inset-0 z-20">
                    {/* Back Button */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Courses
                        </button>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
                                {/* Left: Course Info */}
                                <div className="lg:col-span-2">
                                    <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium mb-4 border border-white/20">
                                        Updated December 2023
                                    </div>

                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                        {title}
                                    </h1>

                                    <p className="text-lg md:text-xl text-slate-200 mb-6 max-w-3xl">
                                        Cracking the code to great design is much easier with a solid foundation of core
                                        principles. Our team covers everything you need to get started in this comprehensive
                                        course.
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 mb-6">
                                        {/* ✅ show date range only if both dates exist */}
                                        {showDateRange && (
                                            <>
                                                <div className="flex items-center gap-2 text-white/90">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <span className="font-medium">
                                                        {formatDate(offering?.start_date)} - {formatDate(offering?.end_date)}
                                                    </span>
                                                </div>

                                                <div className="w-1 h-1 rounded-full bg-white/40"></div>
                                            </>
                                        )}

                                        <div className="flex items-center gap-2 text-white/90 font-mono">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                                />
                                            </svg>
                                            {slug}
                                        </div>

                                        {isEnrolled && (
                                            <>
                                                <div className="w-1 h-1 rounded-full bg-white/40"></div>
                                                <div className="flex items-center gap-2 bg-emerald-500/30 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-400/50">
                                                    <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span className="text-sm font-bold text-white">Enrolled</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Action Card */}
                                <div className="lg:col-span-1">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
                                        <div className="space-y-4">
                                            {/* Lesson Preview */}
                                            <div className="flex items-center gap-4 pb-4 border-b border-white/20">
                                                <button className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center hover:bg-white/30 transition-all">
                                                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </button>

                                                <div className="text-white">
                                                    <div className="text-sm font-semibold opacity-90">12 Lessons</div>
                                                    <div className="text-base font-bold">Duration: 20:24</div>
                                                </div>
                                            </div>

                                            {/* Enrollment Status */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-white/70 font-medium">Self Enrollment</span>
                                                    <span className="text-white font-bold">
                                                        {canSelfEnroll ? "Allowed" : "Not Allowed"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Messages */}
                                            {success && (
                                                <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-3 text-emerald-100 text-sm font-semibold">
                                                    {success}
                                                </div>
                                            )}
                                            {error && (
                                                <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3 text-red-100 text-sm font-semibold">
                                                    {error}
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="space-y-3 pt-2">
                                                {!isEnrolled && (
                                                    <button
                                                        type="button"
                                                        disabled={!canSelfEnroll || enrolling}
                                                        onClick={selfEnroll}
                                                        className="w-full py-4 px-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-emerald-500 to-teal-500 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                    >
                                                        {enrolling ? (
                                                            <span className="flex items-center justify-center gap-2">
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                Enrolling...
                                                            </span>
                                                        ) : canSelfEnroll ? (
                                                            "Enroll Now"
                                                        ) : (
                                                            "Enrollment Closed"
                                                        )}
                                                    </button>
                                                )}

                                                {canOpenCourse && (
                                                    <button
                                                        type="button"
                                                        onClick={openInlinePlayer}
                                                        className="w-full py-4 px-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white text-slate-900"
                                                    >
                                                        Open Course
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Player Section (NO extra cards/text, only iframe when opened) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
                <div ref={playerRef}>
                    {canOpenCourse && showPlayer && (
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <div className="font-bold text-slate-900 text-xl truncate">{title}</div>
                                <button
                                    type="button"
                                    onClick={() => setShowPlayer(false)}
                                    className="px-4 py-2 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all"
                                >
                                    Hide
                                </button>
                            </div>

                            <div className="w-full h-[75vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
                                <iframe
                                    title="course-player"
                                    src={launchUrl}
                                    className="w-full h-full bg-white"
                                    allow="fullscreen; autoplay"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}




