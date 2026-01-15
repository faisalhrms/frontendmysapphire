import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "@config/axiosConfig.js";
import { toast } from "react-toastify";

const StarRatingBlack = ({ rating = 0, count = 0 }) => {
    const r = Number(rating || 0);
    const c = Number(count || 0);
    if (!c) return null;

    const filled = Math.round(r);

    return (
        <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <svg
                            key={n}
                            className={`w-4 h-4 ${n <= filled ? "text-warning" : "text-zinc-300"}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.719c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>

                <span className="text-xs font-black text-zinc-900">{r.toFixed(1)}</span>
                <span className="text-xs font-bold text-zinc-400">({c})</span>
            </div>

            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
        Avg rating
      </span>
        </div>
    );
};

export default function CourseOffering() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [isEnrolling, setIsEnrolling] = useState(null);
    const [search, setSearch] = useState("");
    const [offerings, setOfferings] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const fetchPublished = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/lms/course-offerings/available/", {
                params: {
                    search: search.trim() || undefined,
                    status: activeTab !== "all" ? activeTab : undefined,
                },
            });

            const payload = res?.data?.data ?? [];
            const list =
                Array.isArray(payload) ? payload :
                    Array.isArray(payload?.results) ? payload.results :
                        Array.isArray(payload?.data) ? payload.data :
                            [];

            setOfferings(list);
        } catch (e) {
            console.error("LMS Sync Error", e);
            toast.error("Failed to load offerings");
            setOfferings([]);
        } finally {
            setLoading(false);
        }
    }, [search, activeTab]);

    useEffect(() => {
        const handler = setTimeout(fetchPublished, 350);
        return () => clearTimeout(handler);
    }, [fetchPublished]);

    const onEnroll = async (id, slug) => {
        setIsEnrolling(id);
        try {
            const res = await api.post(`/lms/course-enrollments/self/`, { offering_id: id });
            if (res.status === 200 || res.status === 201) {
                toast.success("Enrolled Successfully!");
                fetchPublished();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Enrollment failed");
        } finally {
            setIsEnrolling(null);
        }
    };

    return (
        <div className="min-h-screen text-zinc-900 transition-colors duration-500 overflow-x-hidden relative">
            {/* --- DARKER BACKGROUND ANIMATIONS --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div
                    className="absolute w-[600px] h-[600px] bg-black/[0.12] rounded-full blur-[100px] transition-transform duration-500 ease-out"
                    style={{ transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)` }}
                />
                <div className="neural-grid-bg-steel" />
                <div className="dots-system">
                    {[...Array(30)].map((_, i) => (
                        <div key={i} className="node-steel">
                            <div className="pulse-line-steel" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                {/* --- CENTERED HEADER WITH SEARCH --- */}
                <header className="pt-16 pb-16 px-8 max-w-4xl mx-auto text-center flex flex-col items-center gap-10">
                    <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none">
                        Learning <br />
                        <span className="shimmer-text uppercase">Resources.</span>
                    </h1>

                    <div className="w-full space-y-6">
                        {/* SEARCH */}
                        <div className="relative max-w-xl mx-auto group">
                            <input
                                type="text"
                                placeholder="Search curriculum..."
                                className="w-full bg-white border-2 border-zinc-200 rounded-2xl py-5 pl-14 pr-4 outline-none focus:border-zinc-900 transition-all shadow-xl text-zinc-900"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <svg
                                className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400 group-focus-within:text-zinc-900 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>

                        {/* FILTER TABS */}
                        <div className="flex bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200 w-full max-w-md mx-auto shadow-sm">
                            {["all", "in_progress", "completed"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        activeTab === tab
                                            ? "bg-zinc-900 text-white shadow-xl"
                                            : "text-zinc-400 hover:text-black"
                                    }`}
                                >
                                    {tab.replace("_", " ")}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-8 pb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            [1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-96 rounded-3xl bg-zinc-50 border border-zinc-100 animate-pulse"
                                />
                            ))
                        ) : offerings.length === 0 ? (
                            <div className="col-span-full text-center py-16">
                                <p className="text-sm font-black text-zinc-500 uppercase tracking-widest">
                                    No courses found
                                </p>
                                <p className="text-xs text-zinc-400 mt-2">
                                    Try changing filters or searching with different keywords.
                                </p>
                            </div>
                        ) : (
                            offerings.map((offering) => {
                                // ✅ SAFELY NORMALIZE DATA (prevents crashes when course is null)
                                const course = offering?.course || null;

                                const title = course?.title || "Untitled Course";
                                const desc = course?.description || "";
                                const slug = course?.slug || null;

                                const status = (offering?.enrollment_status || "").toLowerCase();

                                const thumb =
                                    course?.scorm_package?.thumbnail_url ||
                                    "https://via.placeholder.com/400x225?text=No+Thumbnail";

                                const canOpenCourse = Boolean(slug);

                                return (
                                    <div
                                        key={offering.id}
                                        className="group relative bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-2xl overflow-hidden rounded-[2rem]"
                                    >
                                        {/* STATUS BADGE */}
                                        <div className="absolute top-5 right-5 z-20">
                      <span
                          className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border-2 rounded-full ${
                              status === "completed"
                                  ? "bg-emerald-600 text-white border-emerald-700"
                                  : status === "in_progress"
                                      ? "bg-amber-500 text-white border-amber-600"
                                      : "bg-zinc-900 text-white border-black"
                          }`}
                      >
                        {status?.replace("_", " ") || "AVAILABLE"}
                      </span>
                                        </div>

                                        <div className="aspect-video overflow-hidden bg-zinc-100 border-b border-zinc-100">
                                            <img
                                                src={thumb}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                alt={title}
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "https://via.placeholder.com/400x225?text=No+Image";
                                                }}
                                            />
                                        </div>

                                        <div className="p-7 flex flex-col flex-1 bg-white">
                                            <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-3 line-clamp-1 uppercase">
                                                {title}
                                            </h3>

                                            {desc ? (
                                                <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed mb-4">
                                                    {desc}
                                                </p>
                                            ) : (
                                                <p className="text-zinc-400 text-xs mb-4">
                                                    No description available.
                                                </p>
                                            )}

                                            <StarRatingBlack
                                                rating={offering?.avg_rating}
                                                count={offering?.review_count}
                                            />

                                            {/* BUTTONS */}
                                            <div className="mt-auto">
                                                {!offering?.is_enrolled ? (
                                                    <button
                                                        onClick={() => onEnroll(offering.id)}
                                                        disabled={isEnrolling === offering.id}
                                                        className="w-full py-4 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all active:scale-[0.97] disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed"
                                                    >
                                                        {isEnrolling === offering.id ? (
                                                            <span className="flex items-center justify-center gap-2">
                                <svg
                                    className="animate-spin h-4 w-4 text-zinc-400"
                                    viewBox="0 0 24 24"
                                >
                                  <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      fill="none"
                                  />
                                  <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Processing
                              </span>
                                                        ) : (
                                                            "Initialize Enrollment"
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            if (!canOpenCourse) {
                                                                toast.error("Course details are missing for this offering.");
                                                                return;
                                                            }
                                                            navigate(`/module/ess/course/${slug}`);
                                                        }}
                                                        className="w-full py-4 bg-white border border-zinc-200 text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-zinc-900 transition-all active:scale-[0.97] flex items-center justify-center gap-3 group/btn disabled:opacity-60 disabled:cursor-not-allowed"
                                                        disabled={!canOpenCourse}
                                                        title={!canOpenCourse ? "Course details missing" : undefined}
                                                    >
                                                        {status === "completed" ? "Review" : "Resume Course"}
                                                        <svg
                                                            className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2.5"
                                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                            />
                                                        </svg>
                                                    </button>
                                                )}

                                                {/* Helpful warning when backend sends offering without course */}
                                                {!course && (
                                                    <div className="mt-3 text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                                                        Missing course data (backend)
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="absolute top-0 left-0 w-full h-[3px] bg-zinc-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </main>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
            .neural-grid-bg-steel {
              position: absolute; inset: 0;
              background-image: linear-gradient(to right, rgba(0,0,0,0.22) 1.5px, transparent 1.5px),
                                linear-gradient(to bottom, rgba(0,0,0,0.22) 1.5px, transparent 1.5px);
              background-size: 60px 60px; animation: drift 40s linear infinite;
            }

            .node-steel {
              position: absolute; width: 6px; height: 6px;
              background: rgba(0,0,0,0.4); border-radius: 50%;
              animation: float linear infinite;
            }

            .pulse-line-steel {
              position: absolute; width: 2px; height: 120px;
              background: linear-gradient(to bottom, rgba(0,0,0,0.3), transparent);
              top: 100%; left: 50%; transform-origin: top; animation: p-line 5s ease-in-out infinite;
            }

            @keyframes p-line { 0%, 100% { transform: scaleY(0); opacity: 0; } 50% { transform: scaleY(1.3); opacity: 1; } }

            ${[...Array(30)]
                        .map(
                            (_, i) => `
                .node-steel:nth-child(${i + 1}) {
                  left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
                  animation-duration: ${12 + Math.random() * 8}s;
                  animation-delay: -${Math.random() * 10}s;
                }
              `
                        )
                        .join("")}

            @keyframes drift { from { background-position: 0 0; } to { background-position: 600px 600px; } }
            @keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(40px, 40px); } }

            .shimmer-text {
              background: linear-gradient(90deg, #888, #000, #888);
              background-size: 200% auto;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: shine 4s linear infinite;
            }
            @keyframes shine { to { background-position: 200% center; } }
          `,
                }}
            />
        </div>
    );
}
