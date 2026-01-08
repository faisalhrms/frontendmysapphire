import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "@config/axiosConfig.js";

const formatDate = (iso) => {
    if (!iso) return "—";
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const throttle = (fn, wait = 15000) => {
    let last = 0;
    let timer = null;

    return (...args) => {
        const now = Date.now();
        const remaining = wait - (now - last);
        if (remaining <= 0) {
            last = now;
            fn(...args);
            return;
        }
        if (!timer) {
            timer = setTimeout(() => {
                timer = null;
                last = Date.now();
                fn(...args);
            }, remaining);
        }
    };
};

const statusLabel = (s) => {
    const v = String(s || "").toLowerCase();
    if (!v) return "Not started";
    if (v === "not attempted") return "Not started";
    if (v === "browsing") return "In progress";
    if (v === "incomplete") return "In progress";
    if (v === "completed") return "Completed";
    if (v === "passed") return "Passed";
    if (v === "failed") return "Failed";
    return v;
};

const statusTone = (s) => {
    const v = String(s || "").toLowerCase();
    if (v === "completed" || v === "passed") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    if (v === "failed") return "bg-rose-50 text-rose-700 ring-rose-200";
    if (v === "incomplete" || v === "browsing") return "bg-amber-50 text-amber-700 ring-amber-200";
    return "bg-slate-50 text-slate-700 ring-slate-200";
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

    const [showPlayer, setShowPlayer] = useState(false);
    const playerRef = useRef(null);
    const iframeRef = useRef(null);

    const scormDataRef = useRef({
        initialized: false,
        lessonStatus: "not attempted",
        lessonLocation: "",
        suspendData: "",
        scoreRaw: "",
        scoreMax: "",
        scoreMin: "",
        sessionTime: "0000:00:00",
        totalTime: "0000:00:00",
        exit: "",
        credit: "credit",
        mode: "normal",
        lastCommitAt: null,
        lastSetValueAt: null,
    });

    const [trackingData, setTrackingData] = useState({
        score: 0,
        progress: 0,
        timeSpent: 0, // seconds (cumulative)
        status: "not attempted",
        lastActivity: null,
        lessonLocation: "",
        suspendData: "",
    });

    const trackingRef = useRef(trackingData);
    useEffect(() => {
        trackingRef.current = trackingData;
    }, [trackingData]);

    const saveInFlightRef = useRef(false);

    const isEnrolled = Boolean(offering?.enrollment);
    const canSelfEnroll = Boolean(offering?.self_enrollment);

    const title = offering?.courses?.title ?? "—";
    const slug = offering?.courses?.slug ?? "—";
    const rawLaunchUrl = offering?.launch_url || "";

    const launchUrl = useMemo(() => {
        if (!rawLaunchUrl) return "";
        // Storyline: prefer LMS wrapper if present
        return rawLaunchUrl.replace(/story\.html(\?.*)?$/i, "index_lms.html$1");
    }, [rawLaunchUrl]);

    // cache-buster per open
    const iframeSrc = useMemo(() => {
        if (!launchUrl || !showPlayer) return "";
        const sep = launchUrl.includes("?") ? "&" : "?";
        return `${launchUrl}${sep}v=${Date.now()}`;
    }, [launchUrl, showPlayer]);

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

    const canOpenCourse = useMemo(() => isEnrolled && Boolean(launchUrl), [isEnrolled, launchUrl]);

    const computeProgress = () => {
        const d = scormDataRef.current;
        const status = String(d.lessonStatus || "").toLowerCase();

        if (status === "completed" || status === "passed") return 100;

        const score = parseFloat(d.scoreRaw);
        if (!Number.isNaN(score) && score > 0) return Math.max(0, Math.min(100, score));

        // If resume data exists, assume mid-progress (Storyline uses suspend_data heavily)
        if ((status === "incomplete" || status === "browsing") && d.suspendData) return 50;
        if (status === "incomplete" || status === "browsing") return 10;

        return 0;
    };

    const syncTrackingFromScorm = () => {
        const d = scormDataRef.current;

        setTrackingData((prev) => {
            const score = parseFloat(d.scoreRaw);
            const nextScore = !Number.isNaN(score) ? score : prev.score;

            return {
                ...prev,
                score: nextScore || 0,
                progress: computeProgress(),
                status: d.lessonStatus || prev.status,
                lessonLocation: d.lessonLocation || "",
                suspendData: d.suspendData || "",
                lastActivity: new Date().toISOString(),
            };
        });
    };

    const syncTrackingFromScormThrottled = useMemo(() => throttle(syncTrackingFromScorm, 1000), []);

    const loadProgressFromBackend = async () => {
        try {
            const res = await api.get("/lms/course-progress/", {
                params: { offering_id: Number(id) },
            });
            const p = res?.data?.data ?? res?.data ?? null;
            if (!p) return;

            scormDataRef.current.lessonStatus = p.scorm_status || p.status || "not attempted";
            scormDataRef.current.lessonLocation = p.lesson_location || "";
            scormDataRef.current.suspendData = p.suspend_data || "";
            scormDataRef.current.scoreRaw = p.score != null ? String(p.score) : "";

            setTrackingData((prev) => ({
                ...prev,
                status: p.scorm_status || p.status || prev.status,
                lessonLocation: p.lesson_location || "",
                suspendData: p.suspend_data || "",
                score: Number(p.score || 0),
                progress: Number(p.progress || 0),
                timeSpent: Number(p.total_time_seconds || prev.timeSpent || 0),
                lastActivity: p.last_activity_at || prev.lastActivity,
            }));
        } catch (e) {
            // best-effort
        }
    };

    const saveTrackingDataToBackend = async (reason = "auto") => {
        if (saveInFlightRef.current) return;
        saveInFlightRef.current = true;

        try {
            syncTrackingFromScorm();

            const d = scormDataRef.current;
            const t = trackingRef.current;

            const payload = {
                offering_id: Number(id),
                score: t.score || parseFloat(d.scoreRaw) || 0,
                progress: t.progress ?? computeProgress(),
                scorm_status: d.lessonStatus || t.status, // match your backend serializer
                time_spent: t.timeSpent,
                lesson_location: d.lessonLocation || "",
                suspend_data: d.suspendData || "",
                last_activity: t.lastActivity || new Date().toISOString(),
            };

            await api.post("/lms/course-progress/", payload);

            if (reason === "finish" || reason === "hide") {
                setSuccess("Progress saved.");
                setTimeout(() => setSuccess(""), 1500);
            }
        } catch (err) {
            if (reason === "finish" || reason === "hide") {
                setError("Failed to save progress.");
                setTimeout(() => setError(""), 2500);
            }
        } finally {
            saveInFlightRef.current = false;
        }
    };

    const autosaveThrottled = useMemo(
        () => throttle((reason) => saveTrackingDataToBackend(reason), 15000),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id]
    );

    const selfEnroll = async () => {
        if (!id) return;
        setEnrolling(true);
        setError("");
        setSuccess("");
        try {
            await api.post("/lms/course-enrollments/self/", { offering_id: Number(id) });
            setSuccess("Successfully enrolled.");
            await fetchDetail();
        } catch (e) {
            const backendMsg =
                e?.response?.data?.message || e?.response?.data?.errors?.offering_id || "Self enrollment failed.";
            setError(backendMsg);
        } finally {
            setEnrolling(false);
        }
    };

    const openInlinePlayer = async () => {
        setError("");
        setSuccess("");

        // ✅ load resume data first
        await loadProgressFromBackend();

        setShowPlayer(true);
        setTimeout(() => playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    };

    const closeInlinePlayer = async () => {
        await saveTrackingDataToBackend("hide");
        setShowPlayer(false);
    };

    // ---------- SCORM API registration (only while open) ----------
    useEffect(() => {
        if (!showPlayer) return;

        // SCORM 1.2
        window.API = {
            LMSInitialize: () => {
                scormDataRef.current.initialized = true;
                syncTrackingFromScormThrottled();
                return "true";
            },

            LMSFinish: () => {
                scormDataRef.current.initialized = false;
                syncTrackingFromScorm();
                saveTrackingDataToBackend("finish");
                return "true";
            },

            LMSGetValue: (element) => {
                const d = scormDataRef.current;

                switch (element) {
                    case "cmi.core.lesson_status":
                        return d.lessonStatus;

                    case "cmi.core.lesson_location":
                        return d.lessonLocation;

                    case "cmi.core.score.raw":
                        return d.scoreRaw;

                    case "cmi.core.score.max":
                        return d.scoreMax;

                    case "cmi.core.score.min":
                        return d.scoreMin;

                    case "cmi.core.session_time":
                        return d.sessionTime;

                    case "cmi.core.total_time":
                        return d.totalTime;

                    case "cmi.suspend_data":
                        return d.suspendData;

                    case "cmi.core.student_id":
                        return `student_${id}`;

                    case "cmi.core.student_name":
                        return "Student";

                    case "cmi.core.credit":
                        return d.credit;

                    // ✅ professional: resume if either suspend_data OR lesson_location exists
                    case "cmi.core.entry":
                        return d.suspendData || d.lessonLocation ? "resume" : "ab-initio";

                    case "cmi.launch_data":
                        return "";

                    case "cmi.core.lesson_mode":
                        return d.mode;

                    default:
                        return "";
                }
            },

            LMSSetValue: (element, value) => {
                const d = scormDataRef.current;
                d.lastSetValueAt = new Date().toISOString();

                // update
                if (element === "cmi.core.lesson_status") d.lessonStatus = value;
                if (element === "cmi.core.lesson_location") d.lessonLocation = value;
                if (element === "cmi.core.score.raw") d.scoreRaw = value;
                if (element === "cmi.core.score.max") d.scoreMax = value;
                if (element === "cmi.core.score.min") d.scoreMin = value;
                if (element === "cmi.core.session_time") d.sessionTime = value;
                if (element === "cmi.suspend_data") d.suspendData = value;
                if (element === "cmi.core.exit") d.exit = value;

                syncTrackingFromScormThrottled();
                return "true";
            },

            LMSCommit: () => {
                scormDataRef.current.lastCommitAt = new Date().toISOString();
                syncTrackingFromScormThrottled();
                autosaveThrottled("commit");
                return "true";
            },

            LMSGetLastError: () => "0",
            LMSGetErrorString: () => "No error",
            LMSGetDiagnostic: () => "No error",
        };

        // SCORM 2004
        window.API_1484_11 = {
            Initialize: () => {
                scormDataRef.current.initialized = true;
                syncTrackingFromScormThrottled();
                return "true";
            },

            Terminate: () => {
                scormDataRef.current.initialized = false;
                syncTrackingFromScorm();
                saveTrackingDataToBackend("finish");
                return "true";
            },

            GetValue: (element) => {
                const d = scormDataRef.current;
                switch (element) {
                    case "cmi.location":
                        return d.lessonLocation;
                    case "cmi.suspend_data":
                        return d.suspendData;
                    case "cmi.score.raw":
                        return d.scoreRaw;
                    case "cmi.score.min":
                        return d.scoreMin;
                    case "cmi.score.max":
                        return d.scoreMax;
                    case "cmi.completion_status":
                    case "cmi.success_status":
                        return d.lessonStatus;
                    default:
                        return "";
                }
            },

            SetValue: (element, value) => {
                const d = scormDataRef.current;

                if (element === "cmi.location") d.lessonLocation = value;
                if (element === "cmi.suspend_data") d.suspendData = value;
                if (element === "cmi.score.raw") d.scoreRaw = value;
                if (element === "cmi.score.min") d.scoreMin = value;
                if (element === "cmi.score.max") d.scoreMax = value;
                if (element === "cmi.completion_status" || element === "cmi.success_status") d.lessonStatus = value;

                syncTrackingFromScormThrottled();
                return "true";
            },

            Commit: () => {
                syncTrackingFromScormThrottled();
                autosaveThrottled("commit");
                return "true";
            },

            GetLastError: () => "0",
            GetErrorString: () => "No error",
            GetDiagnostic: () => "No error",
        };

        return () => {
            delete window.API;
            delete window.API_1484_11;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showPlayer, id]);

    // Time tracking (accurate; cumulative)
    useEffect(() => {
        if (!showPlayer) return;

        let last = Date.now();
        const interval = setInterval(() => {
            const now = Date.now();
            const delta = Math.max(0, Math.floor((now - last) / 1000));
            last = now;

            setTrackingData((prev) => ({
                ...prev,
                timeSpent: prev.timeSpent + delta,
                lastActivity: new Date().toISOString(),
            }));
        }, 10000);

        return () => clearInterval(interval);
    }, [showPlayer]);

    // Periodic autosave even if content never calls commit
    useEffect(() => {
        if (!showPlayer) return;
        const interval = setInterval(() => autosaveThrottled("interval"), 30000);
        return () => clearInterval(interval);
    }, [showPlayer, autosaveThrottled]);

    // Save on unload
    useEffect(() => {
        if (!showPlayer) return;
        const handler = () => autosaveThrottled("unload");
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [showPlayer, autosaveThrottled]);

    const hasResume = Boolean(trackingData.suspendData);
    const progressPct = Math.max(0, Math.min(100, Math.round(trackingData.progress || 0)));
    const minutes = Math.floor((trackingData.timeSpent || 0) / 60);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Bar */}
            <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 sm:px-8 py-4 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        <span aria-hidden>←</span> Back
                    </button>

                    <div className="flex items-center gap-2">
                        {isEnrolled && (
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusTone(trackingData.status)}`}>
                {statusLabel(trackingData.status)}
              </span>
                        )}
                        {hasResume && isEnrolled && (
                            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 bg-indigo-50 text-indigo-700 ring-indigo-200">
                Resume available
              </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Hero */}
            <div className="mx-auto max-w-7xl px-4 sm:px-8 py-8">
                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-semibold">
                    SCORM
                  </span>
                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-semibold font-mono">
                    {slug}
                  </span>
                                    {showDateRange && (
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-semibold">
                      {formatDate(offering?.start_date)} — {formatDate(offering?.end_date)}
                    </span>
                                    )}
                                </div>

                                <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 truncate">
                                    {title}
                                </h1>

                                <p className="mt-2 text-slate-600 max-w-2xl">
                                    Launch the course in an embedded player with automatic tracking and resume support.
                                </p>

                                {isEnrolled && (
                                    <div className="mt-5">
                                        <div className="flex items-center justify-between text-sm text-slate-700">
                                            <span className="font-semibold">Progress</span>
                                            <span className="font-bold">{progressPct}%</span>
                                        </div>
                                        <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progressPct}%` }} />
                                        </div>
                                        <div className="mt-2 text-xs text-slate-500">
                                            Time spent: <span className="font-semibold text-slate-700">{minutes}m</span>
                                            {trackingData.lastActivity && (
                                                <>
                                                    {" "}
                                                    · Last activity:{" "}
                                                    <span className="font-semibold text-slate-700">
                            {new Date(trackingData.lastActivity).toLocaleString()}
                          </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="shrink-0 w-full lg:w-[360px]">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    {success && (
                                        <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 text-sm font-semibold">
                                            {success}
                                        </div>
                                    )}
                                    {error && (
                                        <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm font-semibold">
                                            {error}
                                        </div>
                                    )}

                                    {!isEnrolled ? (
                                        <>
                                            <div className="text-slate-900 font-bold">Enrollment</div>
                                            <div className="mt-1 text-sm text-slate-600">
                                                {canSelfEnroll ? "You can self-enroll to access this course." : "Self-enrollment is not available."}
                                            </div>

                                            <button
                                                type="button"
                                                disabled={!canSelfEnroll || enrolling}
                                                onClick={selfEnroll}
                                                className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-white font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {enrolling ? "Enrolling..." : canSelfEnroll ? "Enroll now" : "Enrollment closed"}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-slate-900 font-bold">Access</div>
                                            <div className="mt-1 text-sm text-slate-600">
                                                Open the course player. Progress is saved automatically.
                                            </div>

                                            <button
                                                type="button"
                                                disabled={!canOpenCourse}
                                                onClick={openInlinePlayer}
                                                className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {showPlayer ? "Resume course" : "Open course"}
                                            </button>

                                            {hasResume && (
                                                <div className="mt-3 text-xs text-slate-500">
                                                    Resume is available from your last session.
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {loading && (
                                        <div className="mt-4 text-xs text-slate-500">Loading course details…</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Player */}
                    <div ref={playerRef} className="border-t border-slate-200 bg-white">
                        {canOpenCourse && showPlayer && (
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                    <div className="min-w-0">
                                        <div className="text-sm text-slate-500">Learning session</div>
                                        <div className="text-lg font-bold text-slate-900 truncate">{title}</div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={closeInlinePlayer}
                                        className="rounded-xl bg-slate-900 px-4 py-2 text-white font-semibold hover:bg-slate-800"
                                    >
                                        Close
                                    </button>
                                </div>

                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="text-xs text-slate-500">Progress</div>
                                        <div className="mt-1 text-xl font-bold text-slate-900">{progressPct}%</div>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="text-xs text-slate-500">Time spent</div>
                                        <div className="mt-1 text-xl font-bold text-slate-900">{minutes}m</div>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="text-xs text-slate-500">Status</div>
                                        <div className="mt-1 text-xl font-bold text-slate-900">{statusLabel(trackingData.status)}</div>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="text-xs text-slate-500">Resume</div>
                                        <div className="mt-1 text-xl font-bold text-slate-900">{hasResume ? "Yes" : "No"}</div>
                                    </div>
                                </div>

                                <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-slate-900">
                                    <div className="h-[75vh] w-full">
                                        <iframe
                                            ref={iframeRef}
                                            title="course-player"
                                            src={iframeSrc}
                                            className="h-full w-full bg-white"
                                            allow="fullscreen; autoplay"
                                            onLoad={() => {
                                                // Best-effort: help nested frames find API
                                                try {
                                                    const w = iframeRef.current?.contentWindow;
                                                    if (w) {
                                                        w.API = window.API;
                                                        w.API_1484_11 = window.API_1484_11;
                                                    }
                                                } catch {
                                                    // ignore
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <p className="mt-3 text-xs text-slate-500">
                                    Progress is saved automatically (commit, interval, close, unload). If the course does not report score/location, those fields will remain unavailable.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
