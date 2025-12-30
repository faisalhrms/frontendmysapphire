// import React, { useState, useEffect } from "react";
// import api from "@config/axiosConfig.js";
//
// const formatDate = (iso) => {
//     if (!iso) return "—";
//     const date = new Date(iso);
//     return date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//     });
// };
//
// export default function PublishedOfferings() {
//     const [loading, setLoading] = useState(true);
//     const [enrollingId, setEnrollingId] = useState(null);
//     const [search, setSearch] = useState("");
//     const [offerings, setOfferings] = useState([]);
//     const [error, setError] = useState("");
//     const [successMessage, setSuccessMessage] = useState("");
//
//     const fetchPublished = async () => {
//         setLoading(true);
//         setError("");
//         setSuccessMessage("");
//         try {
//             const res = await api.get("/lms/course-offerings/available/", {
//                 params: search ? { search } : {},
//             });
//
//             const rows = res?.data?.data ?? [];
//             setOfferings(rows);
//
//             if (rows.length === 0) {
//                 setError("No course offerings found matching your search.");
//             }
//         } catch (e) {
//             setError(e?.response?.data?.message || "Failed to load published offerings.");
//             setOfferings([]);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         fetchPublished();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);
//
//     const selfEnroll = async (offeringId) => {
//         setEnrollingId(offeringId);
//         setError("");
//         setSuccessMessage("");
//         try {
//             await api.post("/lms/course-enrollments/self/", { offering_id: offeringId });
//             setSuccessMessage("Successfully enrolled in the course!");
//             await fetchPublished();
//         } catch (e) {
//             setError(e?.response?.data?.message || "Self enrollment failed.");
//         } finally {
//             setEnrollingId(null);
//         }
//     };
//
//     // ✅ backend uses "courses" not "course"
//     const filteredOfferings = offerings.filter((o) =>
//         !search
//             ? true
//             : (o?.courses?.title ?? "").toLowerCase().includes(search.toLowerCase())
//     );
//
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-8">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header Section */}
//                 <div className="mb-8 sm:mb-12">
//                     <div className="flex items-center gap-4 mb-4">
//                         <div className="w-16 h-16 rounded-2xl bg-secondary/50 text-secondary flex items-center justify-center shadow-lg">
//                             <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//                                 />
//                             </svg>
//                         </div>
//                         <div>
//                             <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
//                                 Available Courses
//                             </h1>
//                             <p className="text-slate-600 mt-1 text-sm sm:text-base">
//                                 Discover and enroll in professional training programs
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//
//                 <div className="space-y-6">
//                     {/* Search Bar */}
//                     <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-6">
//                         <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
//                             <div className="flex-1 flex flex-col sm:flex-row gap-3">
//                                 {offerings.length > 0 && (
//                                     <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
//                                         <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
//                                         <span className="text-sm font-bold text-emerald-700">
//                       {filteredOfferings.length}{" "}
//                                             {filteredOfferings.length === 1 ? "course" : "courses"} available
//                     </span>
//                                     </div>
//                                 )}
//                             </div>
//
//                             <div className="relative lg:w-80">
//                                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                                     <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                     </svg>
//                                 </div>
//
//                                 <input
//                                     value={search}
//                                     onChange={(e) => setSearch(e.target.value)}
//                                     onKeyDown={(e) => {
//                                         if (e.key === "Enter") {
//                                             e.preventDefault();
//                                             fetchPublished();
//                                         }
//                                     }}
//                                     placeholder="Search courses..."
//                                     className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none text-slate-700"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Messages */}
//                     {successMessage && (
//                         <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 rounded-xl p-5 shadow-lg">
//                             <div className="flex items-start gap-3">
//                                 <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
//                                     <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                         <path
//                                             fillRule="evenodd"
//                                             d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                             clipRule="evenodd"
//                                         />
//                                     </svg>
//                                 </div>
//                                 <p className="text-sm text-emerald-800 font-semibold">{successMessage}</p>
//                             </div>
//                         </div>
//                     )}
//
//                     {error && (
//                         <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-xl p-5 shadow-lg">
//                             <div className="flex items-start gap-3">
//                                 <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
//                                     <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
//                                         <path
//                                             fillRule="evenodd"
//                                             d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                                             clipRule="evenodd"
//                                         />
//                                     </svg>
//                                 </div>
//                                 <p className="text-sm text-red-800 font-semibold">{error}</p>
//                             </div>
//                         </div>
//                     )}
//
//                     {/* Loader */}
//                     {loading && (
//                         <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-16 text-center">
//                             <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
//                                 <svg className="animate-spin h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                     <path
//                                         className="opacity-75"
//                                         fill="currentColor"
//                                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                     />
//                                 </svg>
//                             </div>
//                             <h3 className="text-2xl font-bold text-slate-900 mb-3">Loading Courses...</h3>
//                             <p className="text-slate-600">Please wait while we fetch available courses</p>
//                         </div>
//                     )}
//
//                     {/* Cards */}
//                     {!loading && filteredOfferings.length > 0 && (
//                         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//                             {filteredOfferings.map((offering) => {
//                                 const isEnrolled = Boolean(offering?.enrollment); // ✅ based on response
//                                 const canSelfEnroll = Boolean(offering?.self_enrollment);
//                                 const title = offering?.courses?.title ?? "—";
//                                 const slug = offering?.courses?.slug ?? "—";
//
//                                 return (
//                                     <div
//                                         key={offering.id}
//                                         className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col"
//                                     >
//                                         {/* Header */}
//                                         <div className="bg-primary/50 text-primary p-6 text-white">
//                                             <div className="flex items-start justify-between mb-3">
//                                                 <div className="px-3 py-1 rounded-full text-xs font-bold border bg-white/15 border-white/30">
//                                                     Course
//                                                 </div>
//
//                                                 {isEnrolled ? (
//                                                     <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
//                                                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                                                             <path
//                                                                 fillRule="evenodd"
//                                                                 d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                                                                 clipRule="evenodd"
//                                                             />
//                                                         </svg>
//                                                         <span className="text-xs font-bold">Enrolled</span>
//                                                     </div>
//                                                 ) : null}
//                                             </div>
//
//                                             <h3 className="text-xl font-bold mb-2 leading-tight">{title}</h3>
//
//                                             <div className="flex items-center gap-2 text-blue-100 text-sm">
//                                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
//                                                 </svg>
//                                                 <span className="font-mono">{slug}</span>
//                                             </div>
//                                         </div>
//
//                                         {/* Body */}
//                                         <div className="p-6 flex-1 flex flex-col">
//                                             <div className="space-y-4 mb-6 flex-1">
//                                                 {/* Duration */}
//                                                 <div className="flex items-start gap-3">
//                                                     <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
//                                                         <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                                         </svg>
//                                                     </div>
//                                                     <div className="flex-1 min-w-0">
//                                                         <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Duration</p>
//                                                         <p className="text-sm font-bold text-slate-900">
//                                                             {formatDate(offering?.start_date)} - {formatDate(offering?.end_date)}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//
//                                                 {/* Enrollment info */}
//                                                 {offering?.enrollment && (
//                                                     <div className="flex items-start gap-3">
//                                                         <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
//                                                             <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                             </svg>
//                                                         </div>
//                                                         <div className="flex-1 min-w-0">
//                                                             <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Enrollment</p>
//                                                             <div className="flex items-center gap-2">
//                                 <span className="text-sm font-bold text-emerald-700 capitalize">
//                                   {offering.enrollment.status}
//                                 </span>
//                                                                 <span className="text-xs text-slate-500">via {offering.enrollment.source}</span>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 )}
//
//                                                 {/* Self enrollment status */}
//                                                 <div className="pt-3">
//                                                     {canSelfEnroll ? (
//                                                         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-bold shadow-md">
//                                                             Open for Enrollment
//                                                         </div>
//                                                     ) : (
//                                                         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-sm font-bold">
//                                                             Enrollment Closed
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//
//                                             {/* Actions */}
//                                             <div className="mt-auto space-y-3">
//                                                 {/* ✅ Launch SCORM */}
//                                                 {offering?.launch_url && (
//                                                     <a
//                                                         href={offering.launch_url}
//                                                         target="_blank"
//                                                         rel="noreferrer"
//                                                         className="w-full inline-flex items-center justify-center py-3 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-slate-900 text-white"
//                                                     >
//                                                         Open Course
//                                                     </a>
//                                                 )}
//
//                                                 {/* ✅ Enroll button */}
//                                                 {!isEnrolled ? (
//                                                     <button
//                                                         type="button"
//                                                         disabled={!canSelfEnroll || enrollingId === offering.id}
//                                                         onClick={() => selfEnroll(offering.id)}
//                                                         className="w-full py-3 px-6 bg-primary/50 text-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
//                                                         title={!canSelfEnroll ? "Self enrollment is not allowed" : "Enroll in this course"}
//                                                     >
//                                                         {enrollingId === offering.id ? "Enrolling..." : (canSelfEnroll ? "Enroll Now" : "Enrollment Closed")}
//                                                     </button>
//                                                 ) : (
//                                                     <div className="w-full py-3 px-6 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-center border-2 border-emerald-200">
//                                                         ✓ Already Enrolled
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     )}
//
//                     {/* Empty */}
//                     {!loading && offerings.length === 0 && !error && (
//                         <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-16 text-center">
//                             <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
//                                 <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//                                     />
//                                 </svg>
//                             </div>
//                             <h3 className="text-2xl font-bold text-slate-900 mb-3">No courses available</h3>
//                             <p className="text-slate-600 mb-6 max-w-md mx-auto">
//                                 There are currently no course offerings available. Please check back later.
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }
import React, { useState, useEffect } from "react";
import api from "@config/axiosConfig.js";

const formatDate = (iso) => {
    if (!iso) return "—";
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export default function PublishedOfferings() {
    const [loading, setLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState(null);
    const [search, setSearch] = useState("");
    const [offerings, setOfferings] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchPublished = async () => {
        setLoading(true);
        setError("");
        setSuccessMessage("");
        try {
            const res = await api.get("/lms/course-offerings/available/", {
                params: search ? { search } : {},
            });

            const rows = res?.data?.data ?? [];
            setOfferings(rows);

            if (rows.length === 0) {
                setError("No course offerings found matching your search.");
            }
        } catch (e) {
            setError(e?.response?.data?.message || "Failed to load published offerings.");
            setOfferings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublished();
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
            setError(e?.response?.data?.message || "Self enrollment failed.");
        } finally {
            setEnrollingId(null);
        }
    };

    // ✅ backend uses "courses" not "course"
    const filteredOfferings = offerings.filter((o) =>
        !search ? true : (o?.courses?.title ?? "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-secondary/50 text-secondary flex items-center justify-center shadow-lg">
                            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                                Available Courses
                            </h1>
                            <p className="text-slate-600 mt-1 text-sm sm:text-base">
                                Discover and enroll in professional training programs
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Search Bar */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                            <div className="flex-1 flex flex-col sm:flex-row gap-3">
                                {offerings.length > 0 && (
                                    <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                                        <span className="text-sm font-bold text-emerald-700">
                      {filteredOfferings.length}{" "}
                                            {filteredOfferings.length === 1 ? "course" : "courses"} available
                    </span>
                                    </div>
                                )}
                            </div>

                            <div className="relative lg:w-80">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>

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
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none text-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    {successMessage && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 rounded-xl p-5 shadow-lg">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm text-emerald-800 font-semibold">{successMessage}</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-xl p-5 shadow-lg">
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
                                <p className="text-sm text-red-800 font-semibold">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Loader */}
                    {loading && (
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-16 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <svg className="animate-spin h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Loading Courses...</h3>
                            <p className="text-slate-600">Please wait while we fetch available courses</p>
                        </div>
                    )}

                    {/* Cards */}
                    {!loading && filteredOfferings.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredOfferings.map((offering) => {
                                // prefer backend is_enrolled if present, fallback to enrollment object
                                const isEnrolled = Boolean(offering?.is_enrolled ?? offering?.enrollment);
                                const canSelfEnroll = Boolean(offering?.self_enrollment);

                                const title = offering?.courses?.title ?? "—";
                                const slug = offering?.courses?.slug ?? "—";

                                return (
                                    <div
                                        key={offering.id}
                                        className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col"
                                    >
                                        {/* Header */}
                                        <div className="bg-primary/50 text-primary p-6 text-white">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="px-3 py-1 rounded-full text-xs font-bold border bg-white/15 border-white/30">
                                                    Course
                                                </div>

                                                {isEnrolled ? (
                                                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        <span className="text-xs font-bold">Enrolled</span>
                                                    </div>
                                                ) : null}
                                            </div>

                                            <h3 className="text-xl font-bold mb-2 leading-tight">{title}</h3>

                                            <div className="flex items-center gap-2 text-blue-100 text-sm">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                </svg>
                                                <span className="font-mono">{slug}</span>
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="space-y-4 mb-6 flex-1">
                                                {/* Duration */}
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Duration</p>
                                                        <p className="text-sm font-bold text-slate-900">
                                                            {formatDate(offering?.start_date)} - {formatDate(offering?.end_date)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Enrollment info */}
                                                {offering?.enrollment && (
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Enrollment</p>
                                                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-emerald-700 capitalize">
                                  {offering.enrollment.status}
                                </span>
                                                                <span className="text-xs text-slate-500">via {offering.enrollment.source}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Self enrollment status */}
                                                <div className="pt-3">
                                                    {canSelfEnroll ? (
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-bold shadow-md">
                                                            Open for Enrollment
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-sm font-bold">
                                                            Enrollment Closed
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-auto space-y-3">
                                                {isEnrolled ? (
                                                    // ✅ ENROLLED => ONLY OPEN COURSE
                                                    offering?.launch_url ? (
                                                        <a
                                                            href={offering.launch_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="w-full inline-flex items-center justify-center py-3 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-slate-900 text-white"
                                                        >
                                                            Open Course
                                                        </a>
                                                    ) : (
                                                        <div className="w-full py-3 px-6 bg-slate-200 text-slate-700 rounded-xl font-bold text-center">
                                                            Launch URL not available
                                                        </div>
                                                    )
                                                ) : (
                                                    // ✅ NOT ENROLLED => ENROLL ONLY
                                                    <button
                                                        type="button"
                                                        disabled={!canSelfEnroll || enrollingId === offering.id}
                                                        onClick={() => selfEnroll(offering.id)}
                                                        className="w-full py-3 px-6 bg-primary/50 text-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                                                        title={!canSelfEnroll ? "Self enrollment is not allowed" : "Enroll in this course"}
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

                    {/* Empty */}
                    {!loading && offerings.length === 0 && !error && (
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-16 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">No courses available</h3>
                            <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                There are currently no course offerings available. Please check back later.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
