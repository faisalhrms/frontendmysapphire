import React, { useState } from "react";
import api from "@config/axiosConfig.js";

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : "—");

// ✅ Keep API paths consistent.
// If your axios baseURL already includes "/api", use "/lms/..."
// If your axios baseURL does NOT include "/api", change these to "/api/lms/..."
const API = {
    publishedOfferings: "/lms/course-offerings/published/",
    selfEnroll: "/lms/course-enrollments/self/",
};

export default function PublishedOfferings({
                                               showEnrollButton = true,
                                               onSelectOffering = null, // kept for compatibility, but Select UI removed
                                           }) {
    const [loading, setLoading] = useState(false);
    const [enrollingId, setEnrollingId] = useState(null);
    const [search, setSearch] = useState("");
    const [offerings, setOfferings] = useState([]);
    const [error, setError] = useState("");

    const fetchPublished = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get(API.publishedOfferings, {
                params: search ? { search } : {},
            });
            setOfferings(res?.data?.data ?? []);
        } catch (e) {
            setError(e?.response?.data?.message || "Failed to load published offerings.");
            setOfferings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => fetchPublished();

    const selfEnroll = async (offeringId) => {
        setEnrollingId(offeringId);
        setError("");
        try {
            await api.post(API.selfEnroll, { offering_id: offeringId });
            await fetchPublished(); // refresh list
        } catch (e) {
            setError(e?.response?.data?.message || "Self enroll failed.");
        } finally {
            setEnrollingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center">
                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Course Offerings</h1>
                            <p className="text-slate-600 mt-1 text-sm sm:text-base">
                                Explore and enroll in professional training programs
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Search & Filter Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
                        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <button
                                    type="button"
                                    onClick={fetchPublished}
                                    disabled={loading}
                                    className="relative group hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                                    <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Loading...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Show Published Offerings
                        </>
                    )}
                  </span>
                                </button>

                                {offerings.length > 0 && (
                                    <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-sm font-bold text-emerald-700">
                      {offerings.length} {offerings.length === 1 ? "offering" : "offerings"} available
                    </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-stretch gap-3">
                                <div className="relative flex-1 lg:w-80">
                                    <input
                                        value={search}
                                        onClick={handleSearch}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleSearch();
                                            }
                                        }}
                                        placeholder="Search course title..."
                                        className="form-control form-control-sm"
                                    />
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error ? (
                        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-2xl p-5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm text-red-800 font-medium">{error}</p>
                            </div>
                        </div>
                    ) : null}

                    {/* Offerings Table */}
                    {offerings.length > 0 ? (
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                            <div className="hidden lg:grid grid-cols-12 gap-4 bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-5">
                                <div className="col-span-4 text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                    </svg>
                                    Course
                                </div>
                                <div className="col-span-3 text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                    Company
                                </div>
                                <div className="col-span-2 text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Start Date
                                </div>
                                <div className="col-span-1 text-xs font-bold text-slate-200 uppercase tracking-wider">Status</div>
                                <div className="col-span-2 text-right text-xs font-bold text-slate-200 uppercase tracking-wider">
                                    Actions
                                </div>
                            </div>

                            <div className="hidden lg:block divide-y divide-slate-100">
                                {offerings.map((o) => (
                                    <div
                                        key={o.id}
                                        className="grid grid-cols-12 gap-4 px-8 py-6 items-center hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group"
                                    >
                                        <div className="col-span-4">
                                            <div className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                {o?.course?.title ?? "—"}
                                            </div>
                                            <div className="inline-flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded-lg">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                </svg>
                                                {o?.course?.slug ?? ""}
                                            </div>
                                        </div>

                                        <div className="col-span-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                </div>
                                                <span className="text-slate-700 font-semibold">{o?.company?.name ?? "—"}</span>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm font-medium">{formatDate(o?.start_at)}</span>
                                            </div>
                                        </div>

                                        <div className="col-span-1">
                                            {o?.allow_self_enroll ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                          </svg>
                          Open
                        </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 text-slate-600 text-xs font-bold">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                            />
                          </svg>
                          Locked
                        </span>
                                            )}
                                        </div>

                                        {/* ✅ Removed SELECT button here */}

                                        <div className="col-span-2 flex justify-end gap-2">
                                            {showEnrollButton ? (
                                                <button
                                                    type="button"
                                                    disabled={!o?.allow_self_enroll || enrollingId === o.id}
                                                    onClick={() => selfEnroll(o.id)}
className="relative group hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"                                                >
                                                    {enrollingId === o.id ? (
                                                        <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Enrolling...
                            </span>
                                                    ) : (
                                                        "Enroll Now"
                                                    )}
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Mobile Cards */}
                            <div className="lg:hidden divide-y divide-slate-100">
                                {offerings.map((o) => (
                                    <div
                                        key={o.id}
                                        className="p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all"
                                    >
                                        <div className="mb-4">
                                            <h3 className="font-bold text-slate-900 mb-2 text-lg">{o?.course?.title ?? "—"}</h3>
                                            <div className="inline-flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded-lg">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                </svg>
                                                {o?.course?.slug ?? ""}
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                </div>
                                                <span className="text-slate-700 font-semibold">{o?.company?.name ?? "—"}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-slate-600">
                                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm font-medium">{formatDate(o?.start_at)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                                            {o?.allow_self_enroll ? (
                                                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-md">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                          </svg>
                          Open
                        </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 text-slate-600 text-xs font-bold">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                            />
                          </svg>
                          Locked
                        </span>
                                            )}

                                            {/* ✅ Removed SELECT button here */}

                                            <div className="flex gap-2">
                                                {showEnrollButton ? (
                                                    <button
                                                        type="button"
                                                        disabled={!o?.allow_self_enroll || enrollingId === o.id}
                                                        onClick={() => selfEnroll(o.id)}
                                                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400 transition-all"
                                                    >
                                                        {enrollingId === o.id ? "..." : "Enroll"}
                                                    </button>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {/* Empty State */}
                    {!loading && offerings.length === 0 && !error && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No courses available yet</h3>
                            <p className="text-slate-600 mb-6">Click the button above to load available course offerings</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
