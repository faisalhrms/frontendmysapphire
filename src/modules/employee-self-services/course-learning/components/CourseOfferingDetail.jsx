import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "@config/axiosConfig.js";

const formatDate = (iso) => {
    if (!iso) return "—";
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

function PlayerModal({ open, onClose, url, title }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="absolute inset-0 p-3 sm:p-6 flex items-center justify-center">
                <div className="w-full max-w-6xl h-[85vh] bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-slate-700">
                    <div className="h-16 px-6 flex items-center justify-between border-b border-slate-700 bg-slate-800">
                        <div className="font-bold text-white truncate flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            {title || "Course Player"}
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl font-bold bg-white text-slate-900 hover:bg-slate-100 transition-all"
                        >
                            Close
                        </button>
                    </div>

                    <iframe
                        title="course-player"
                        src={url}
                        className="w-full h-[calc(85vh-64px)] bg-white"
                        allow="fullscreen"
                    />
                </div>
            </div>
        </div>
    );
}

export default function CourseOfferingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [offering, setOffering] = useState(location.state?.offering || null);

    const [playerOpen, setPlayerOpen] = useState(false);

    const isEnrolled = Boolean(offering?.enrollment);
    const canSelfEnroll = Boolean(offering?.self_enrollment);

    const title = offering?.courses?.title ?? "—";
    const slug = offering?.courses?.slug ?? "—";
    const launchUrl = offering?.launch_url || "";

    // ✅ date conditions
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
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => setPlayerOpen(true)}
                                                            className="w-full py-4 px-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white text-slate-900"
                                                        >
                                                            Open Course
                                                        </button>
                                                    </>
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

            {/* Additional Details Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Course Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Overview</h2>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                This comprehensive course will guide you through essential concepts and practical
                                applications. You'll gain hands-on experience and develop skills that are directly
                                applicable to real-world scenarios. Our expert instructors have designed this curriculum
                                to ensure you build a solid foundation in the subject matter.
                            </p>

                            {/* ✅ show date cards only if any date exists */}
                            {(hasStartDate || hasEndDate) && (
                                <div className="grid grid-cols-2 gap-4">
                                    {hasStartDate && (
                                        <div
                                            className={[
                                                "bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100",
                                                !hasEndDate ? "col-span-2" : "",
                                            ].join(" ")}
                                        >
                                            <div className="text-sm font-bold text-blue-600 uppercase mb-2">Start Date</div>
                                            <div className="text-xl font-bold text-slate-900">
                                                {formatDate(offering?.start_date)}
                                            </div>
                                        </div>
                                    )}

                                    {hasEndDate && (
                                        <div
                                            className={[
                                                "bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100",
                                                !hasStartDate ? "col-span-2" : "",
                                            ].join(" ")}
                                        >
                                            <div className="text-sm font-bold text-purple-600 uppercase mb-2">End Date</div>
                                            <div className="text-xl font-bold text-slate-900">
                                                {formatDate(offering?.end_date)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl p-6 text-white">
                            <h3 className="text-lg font-bold mb-4">What You'll Learn</h3>
                            <ul className="space-y-3">
                                {[
                                    "Core fundamental principles",
                                    "Practical applications",
                                    "Industry best practices",
                                    "Real-world projects",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <svg
                                            className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {loading && (
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 text-center">
                                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                <p className="text-slate-600 font-semibold">Loading details...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <PlayerModal open={playerOpen} onClose={() => setPlayerOpen(false)} url={launchUrl} title={title} />
        </div>
    );
}
