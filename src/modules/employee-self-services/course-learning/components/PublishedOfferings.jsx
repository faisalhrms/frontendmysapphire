
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@config/axiosConfig.js";

const formatDate = (iso) => {
    if (!iso) return "—";
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const ensureArray = (v) => (Array.isArray(v) ? v : []);

export default function CourseOffering() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState(null);
    const [search, setSearch] = useState("");
    const [offerings, setOfferings] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchPublished = async (overrideSearch) => {
        const q = typeof overrideSearch === "string" ? overrideSearch : search;

        setLoading(true);
        setError("");
        setSuccessMessage("");
        try {
            const res = await api.get("/lms/course-offerings/available/", {
                params: q ? { search: q } : {},
            });

            // ✅ normalize response shape to array (prevents .map crash)
            const raw = res?.data?.data;
            const rows =
                Array.isArray(raw) ? raw :
                    Array.isArray(raw?.results) ? raw.results :
                        Array.isArray(raw?.data) ? raw.data :
                            [];

            setOfferings(rows);

            if (rows.length === 0) setError("No course offerings found matching your search.");
        } catch (e) {
            setError(e?.response?.data?.message || "Failed to load published offerings.");
            setOfferings([]); // ✅ keep array always
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublished("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selfEnroll = async (offeringId) => {
        setEnrollingId(offeringId);
        setError("");
        setSuccessMessage("");
        try {
            await api.post("/lms/course-enrollments/self/", { offering_id: offeringId });
            setSuccessMessage("Successfully enrolled in the course!");
            await fetchPublished();
        } catch (e) {
            const backendMsg =
                e?.response?.data?.message ||
                e?.response?.data?.errors?.offering_id ||
                "Self enrollment failed.";
            setError(backendMsg);
            await fetchPublished();
        } finally {
            setEnrollingId(null);
        }
    };

    const filteredOfferings = useMemo(() => {
        // ✅ ensure offerings is always array
        const list = ensureArray(offerings);

        const q = (search || "").trim().toLowerCase();
        if (!q) return list;

        return list.filter((o) => (o?.courses?.title ?? "").toLowerCase().includes(q));
    }, [offerings, search]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
            {/* Hero Section */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900/80 z-10"></div>
                <div
                    className="h-[500px] bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80')"
                    }}
                ></div>

                <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium mb-6 border border-white/20">
                            Updated December 2023
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Discover Professional
                            <span className="block mt-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                Training Programs
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
                            Cracking the code to great design is much easier with a solid foundation of core principles.
                            Our team covers everything you need to get started.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <div className="relative w-full sm:w-96">
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            fetchPublished();
                                        }
                                    }}
                                    placeholder="Search courses..."
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-md focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 transition-all outline-none text-white placeholder-slate-300"
                                />
                                <svg className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            {ensureArray(offerings).length > 0 && (
                                <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/20 backdrop-blur-md rounded-2xl border border-emerald-400/30">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <span className="text-sm font-bold text-white">
                                        {ensureArray(filteredOfferings).length}{" "}
                                        {ensureArray(filteredOfferings).length === 1 ? "course" : "courses"} available
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-8 relative z-30">
                {successMessage && (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 rounded-2xl p-5 shadow-lg mb-6">
                        <p className="text-sm text-emerald-800 font-semibold">{successMessage}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-2xl p-5 shadow-lg mb-6">
                        <p className="text-sm text-red-800 font-semibold">{error}</p>
                    </div>
                )}
            </div>

            {/* Course Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
                {loading ? (
                    <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Loading Courses...</h3>
                        <p className="text-slate-600">Please wait while we fetch available courses</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {ensureArray(filteredOfferings).map((offering) => {
                            const isEnrolled = Boolean(offering?.enrollment);
                            const canSelfEnroll = Boolean(offering?.self_enrollment);
                            const title = offering?.courses?.title ?? "—";
                            const slug = offering?.courses?.slug ?? "—";

                            const showDateRange = Boolean(offering?.start_date && offering?.end_date);

                            return (
                                <div
                                    key={offering.id}
                                    className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500 group"
                                >
                                    {/* Course Image with Overlay */}
                                    <div className="relative h-52 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-slate-900/70 z-10"></div>
                                        <div
                                            className="h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                                            style={{
                                                backgroundImage: offering?.image
                                                    ? `url(${offering.image})`
                                                    : "url('https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80')"
                                            }}
                                        ></div>

                                        {/* Lesson Info Overlay */}
                                        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-4">
                                            <button
                                                type="button"
                                                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center hover:bg-white/30 transition-all group/play"
                                            >
                                                <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </button>

                                            <div className="text-white">
                                                <div className="text-sm font-semibold opacity-90">
                                                    Lesson (20:24)
                                                </div>
                                                <div className="text-base font-bold">
                                                    Course Overview
                                                </div>
                                            </div>
                                        </div>

                                        {/* Enrollment Badge */}
                                        {isEnrolled && (
                                            <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-emerald-500/90 backdrop-blur-sm px-4 py-2 rounded-full">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span className="text-xs font-bold text-white">Enrolled</span>
                                            </div>
                                        )}

                                        {/* Updated Badge */}
                                        <div className="absolute top-6 left-6 z-20 px-3 py-1.5 bg-slate-900/60 backdrop-blur-sm rounded-full text-xs font-medium text-white border border-white/20">
                                            Updated Recently
                                        </div>
                                    </div>

                                    {/* Course Content */}
                                    <div className="p-5">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-emerald-600 transition-colors">
                                            {title}
                                        </h3>

                                        <p className="text-slate-600 mb-6 line-clamp-2">
                                            {offering?.courses?.description ||
                                                offering?.courses?.overview ||
                                                "Cracking the code to great design is much easier with a solid foundation of core principles."}
                                        </p>

                                        {/* Course Meta */}
                                        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-200">
                                            {showDateRange && (
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="font-medium">
                                                        {formatDate(offering?.start_date)} - {formatDate(offering?.end_date)}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 text-sm font-mono text-slate-500">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                </svg>
                                                {slug}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => navigate(`/module/ess/course-learing/${offering.id}`, { state: { offering } })}
                                                className="flex-1 py-4 px-6 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all duration-300 hover:-translate-y-0.5"
                                            >
                                                View Details
                                            </button>

                                            {!isEnrolled && (
                                                <button
                                                    type="button"
                                                    disabled={!canSelfEnroll || enrollingId === offering.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        selfEnroll(offering.id);
                                                    }}
                                                    className="flex-1 py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5"
                                                >
                                                    {enrollingId === offering.id
                                                        ? "Enrolling..."
                                                        : canSelfEnroll
                                                            ? "Enroll Now"
                                                            : "Enrollment Closed"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && ensureArray(offerings).length === 0 && (
                    <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">No courses available</h3>
                        <p className="text-slate-600 max-w-md mx-auto">
                            There are currently no course offerings available. Please check back later.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
