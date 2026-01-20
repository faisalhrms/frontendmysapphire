import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@config/axiosConfig.js";
import CourseFeedbackModal from "@modules/employee-self-services/course-learning/components/CourseFeedbackModal.jsx";

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
    if (!v || v === "not attempted") return "Not started";
    if (v === "browsing" || v === "incomplete") return "In progress";
    if (v === "completed") return "Completed";
    if (v === "passed") return "Passed";
    if (v === "failed") return "Failed";
    return v;
};

const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins} min`;
};

export default function CourseOfferingDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [offering, setOffering] = useState(null);
    const [showPlayer, setShowPlayer] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
    });

    const [trackingData, setTrackingData] = useState({
        score: 0,
        progress: 0,
        timeSpent: 0,
        status: "not attempted",
        lastActivity: null,
        lessonLocation: "",
        suspendData: "",
    });

    const isTerminalStatus = (s) => {
        const v = String(s || "").toLowerCase();
        return v === "completed" || v === "passed";
    };

    const normalizeStatus = (s) => String(s || "").toLowerCase();


    const trackingRef = useRef(trackingData);
    useEffect(() => {
        trackingRef.current = trackingData;
    }, [trackingData]);

    const saveInFlightRef = useRef(false);
    const feedbackSubmittedRef = useRef(false);

    useEffect(() => {
        feedbackSubmittedRef.current = feedbackSubmitted;
    }, [feedbackSubmitted]);

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const offeringId = offering?.id ?? offering?.offering_id ?? null;
    const enrollmentId = useMemo(() => {
        return (
            offering?.enrollment?.id ??
            offering?.enrollment_id ??
            offering?.enrollment?.enrollment_id ??
            offering?.enrollment?.pk ??
            null
        );
    }, [offering]);

    const fetchDetail = useCallback(async (signal) => {
        if (!slug) return;
        setLoading(true);
        setError("");
        try {
            const res = await api.get(`/lms/course-offerings/by-slug/${slug}/`, { signal });
            const offeringData = res?.data?.data ?? res?.data ?? null;
            setOffering(offeringData);

            // ✅ OPTIMIZED: Get feedback status directly from detail API response
            const feedbackStatus = Boolean(
                offeringData?.feedback_submitted ??
                offeringData?.enrollment?.feedback_submitted ??
                false
            );
            setFeedbackSubmitted(feedbackStatus);

            // Load progress immediately after fetching course details
            if (offeringData?.is_enrolled || offeringData?.enrollment) {
                const offeringIdValue = offeringData?.id ?? offeringData?.offering_id;
                if (offeringIdValue) {
                    try {
                        const progressRes = await api.get("/lms/course-progress/", {
                            params: { offering_id: Number(offeringIdValue) },
                            signal
                        });
                        const p = progressRes?.data?.data ?? progressRes?.data ?? null;
                        if (p) {
                            scormDataRef.current.lessonStatus = p.scorm_status || p.status || "not attempted";
                            scormDataRef.current.lessonLocation = p.lesson_location || "";
                            scormDataRef.current.suspendData = p.suspend_data || "";
                            scormDataRef.current.scoreRaw = p.score != null ? String(p.score) : "";
                            setTrackingData({
                                status: p.scorm_status || p.status || "not attempted",
                                lessonLocation: p.lesson_location || "",
                                suspendData: p.suspend_data || "",
                                score: Number(p.score || 0),
                                progress: Number(p.progress || 0),
                                timeSpent: Number(p.total_time_seconds || 0),
                                lastActivity: p.last_activity_at || null,
                            });
                        }
                    } catch (err) {
                        console.warn("Failed to load progress:", err);
                    }
                }
            }
        } catch (e) {
            if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
            setError(e?.response?.data?.message || "Failed to load course");
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        if (!slug) return;
        const controller = new AbortController();
        fetchDetail(controller.signal);
        return () => controller.abort();
    }, [slug, fetchDetail]);

    const courseObj = offering?.course ?? null;
    const title = courseObj?.title ?? "Course Title";
    const description = courseObj?.description ?? "Enhance your skills with this interactive SCORM course. Track your progress and learn at your own pace.";

    const canSelfEnroll = Boolean(offering?.allow_self_enroll ?? offering?.self_enrollment);
    const isEnrolled = Boolean(offering?.is_enrolled ?? offering?.enrollment);
    const startDate = offering?.started_at ?? offering?.start_date ?? null;
    const endDate = offering?.ended_at ?? offering?.end_date ?? null;

    const rawLaunchUrl = offering?.course?.scorm_package?.launch_url || "";
    const launchUrl = useMemo(() => {
        if (!rawLaunchUrl) return "";
        return rawLaunchUrl.replace(/story\.html(\?.*)?$/i, "index_lms.html$1");
    }, [rawLaunchUrl]);

    const canOpenCourse = useMemo(() => isEnrolled && Boolean(launchUrl), [isEnrolled, launchUrl]);

    const iframeSrc = useMemo(() => {
        if (!launchUrl || !showPlayer) return "";
        const sep = launchUrl.includes("?") ? "&" : "?";
        return `${launchUrl}${sep}v=${Date.now()}`;
    }, [launchUrl, showPlayer]);

    const computeProgress = useCallback(() => {
        const d = scormDataRef.current;
        const status = String(d.lessonStatus || "").toLowerCase();
        if (status === "completed" || status === "passed") return 100;
        const score = parseFloat(d.scoreRaw);
        if (!Number.isNaN(score) && score > 0) return Math.max(0, Math.min(100, score));
        if (status === "incomplete" || status === "browsing") {
            if (d.lessonLocation && d.lessonLocation !== "0") return 5;
            return 0;
        }
        return 0;
    }, []);

    const syncTrackingFromScorm = useCallback(() => {
        const d = scormDataRef.current;

        setTrackingData((prev) => {
            const prevStatus = normalizeStatus(prev.status);
            const incomingStatus = normalizeStatus(d.lessonStatus);

            const finalStatus =
                isTerminalStatus(prevStatus) && !isTerminalStatus(incomingStatus)
                    ? prev.status
                    : (d.lessonStatus || prev.status);

            const score = parseFloat(d.scoreRaw);
            const nextScore = !Number.isNaN(score) ? score : prev.score;
            const newProgress = computeProgress();

            return {
                ...prev,
                score: nextScore || 0,
                progress: Math.max(prev.progress, newProgress),
                status: finalStatus,
                lessonLocation: d.lessonLocation || "",
                suspendData: d.suspendData || "",
                lastActivity: new Date().toISOString(),
            };
        });
    }, [computeProgress]);


    const syncTrackingFromScormThrottled = useMemo(() => throttle(syncTrackingFromScorm, 1000), [syncTrackingFromScorm]);

    const loadProgressFromBackend = useCallback(async () => {
        if (!offeringId) return;
        try {
            const res = await api.get("/lms/course-progress/", {
                params: { offering_id: Number(offeringId) },
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
        } catch {}
    }, [offeringId]);

    const saveTrackingDataToBackend = useCallback(async (reason = "auto") => {
        if (!offeringId || saveInFlightRef.current) return;
        saveInFlightRef.current = true;
        try {
            syncTrackingFromScorm();
            const d = scormDataRef.current;
            const t = trackingRef.current;
            const payload = {
                offering_id: Number(offeringId),
                score: t.score || parseFloat(d.scoreRaw) || 0,
                progress: t.progress ?? computeProgress(),
                scorm_status: d.lessonStatus || t.status,
                time_spent: t.timeSpent,
                lesson_location: d.lessonLocation || "",
                suspend_data: d.suspendData || "",
                last_activity: t.lastActivity || new Date().toISOString(),
            };
            await api.post("/lms/course-progress/", payload);
            if (reason === "finish" || reason === "hide") {
                setSuccess("Progress saved");
                setTimeout(() => setSuccess(""), 2000);
            }
        } catch {
            if (reason === "finish" || reason === "hide") {
                setError("Save failed");
                setTimeout(() => setError(""), 2500);
            }
        } finally {
            saveInFlightRef.current = false;
        }
    }, [offeringId, computeProgress, syncTrackingFromScorm]);

    const autosaveThrottled = useMemo(() => throttle((reason) => saveTrackingDataToBackend(reason), 15000), [saveTrackingDataToBackend]);

    const selfEnroll = useCallback(async () => {
        if (!offeringId) {
            setError("Please wait, loading course data...");
            return;
        }
        setEnrolling(true);
        setError("");
        setSuccess("");
        try {
            await api.post("/lms/course-enrollments/self/", { offering_id: Number(offeringId) });
            setSuccess("Enrolled successfully!");
            await fetchDetail();
        } catch (e) {
            setError(e?.response?.data?.message || "Enrollment failed");
        } finally {
            setEnrolling(false);
        }
    }, [offeringId, fetchDetail]);

    const openInlinePlayer = useCallback(async () => {
        setError("");
        setSuccess("");
        await loadProgressFromBackend();
        setShowPlayer(true);
        setTimeout(() => playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }, [loadProgressFromBackend]);

    const closeInlinePlayer = useCallback(async () => {
        await saveTrackingDataToBackend("hide");
        setShowPlayer(false);
    }, [saveTrackingDataToBackend]);

    // ✅ OPTIMIZED: Handle feedback modal based on completion status
    const isCompleted = useMemo(() => {
        const s = String(trackingData?.status || "").toLowerCase();
        return s === "completed" || s === "passed";
    }, [trackingData?.status]);

    useEffect(() => {
        if (!isEnrolled || !enrollmentId) return;

        // Show feedback modal if completed and not yet submitted
        if (isCompleted && !feedbackSubmitted) {
            setShowFeedback(true);
        }

        // Close modal if feedback becomes submitted
        if (feedbackSubmitted) {
            setShowFeedback(false);
        }
    }, [isCompleted, isEnrolled, enrollmentId, feedbackSubmitted]);

    useEffect(() => {
        if (!showPlayer) return;
        const studentId = `student_${offeringId ?? slug ?? "unknown"}`;

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
                const st = String(scormDataRef.current.lessonStatus || "").toLowerCase();
                if ((st === "completed" || st === "passed") && enrollmentId && !feedbackSubmittedRef.current) {
                    setShowFeedback(true);
                }
                return "true";
            },
            LMSGetValue: (element) => {
                const d = scormDataRef.current;
                switch (element) {
                    case "cmi.core.lesson_status": return d.lessonStatus;
                    case "cmi.core.lesson_location": return d.lessonLocation;
                    case "cmi.core.score.raw": return d.scoreRaw;
                    case "cmi.core.score.max": return d.scoreMax;
                    case "cmi.core.score.min": return d.scoreMin;
                    case "cmi.core.session_time": return d.sessionTime;
                    case "cmi.core.total_time": return d.totalTime;
                    case "cmi.suspend_data": return d.suspendData;
                    case "cmi.core.student_id": return studentId;
                    case "cmi.core.student_name": return "Student";
                    case "cmi.core.credit": return d.credit;
                    case "cmi.core.entry": return d.suspendData || d.lessonLocation ? "resume" : "ab-initio";
                    case "cmi.launch_data": return "";
                    case "cmi.core.lesson_mode": return d.mode;
                    default: return "";
                }
            },
            LMSSetValue: (element, value) => {
                const d = scormDataRef.current;
                if (element === "cmi.core.lesson_status") {
                    const incoming = normalizeStatus(value);
                    const current = normalizeStatus(d.lessonStatus);
                    if (isTerminalStatus(current) && !isTerminalStatus(incoming)) {
                        return "true";
                    }
                    d.lessonStatus = value;
                }
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
                syncTrackingFromScormThrottled();
                autosaveThrottled("commit");
                return "true";
            },
            LMSGetLastError: () => "0",
            LMSGetErrorString: () => "No error",
            LMSGetDiagnostic: () => "No error",
        };

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
                const st = String(scormDataRef.current.lessonStatus || "").toLowerCase();
                if ((st === "completed" || st === "passed") && enrollmentId && !feedbackSubmittedRef.current) {
                    setShowFeedback(true);
                }
                return "true";
            },
            GetValue: (element) => {
                const d = scormDataRef.current;
                switch (element) {
                    case "cmi.location": return d.lessonLocation;
                    case "cmi.suspend_data": return d.suspendData;
                    case "cmi.score.raw": return d.scoreRaw;
                    case "cmi.score.min": return d.scoreMin;
                    case "cmi.score.max": return d.scoreMax;
                    case "cmi.completion_status":
                    case "cmi.success_status": return d.lessonStatus;
                    default: return "";
                }
            },
            SetValue: (element, value) => {
                const d = scormDataRef.current;
                if (element === "cmi.completion_status" || element === "cmi.success_status") {
                    const incoming = normalizeStatus(value);
                    const current = normalizeStatus(d.lessonStatus);
                    if (isTerminalStatus(current) && !isTerminalStatus(incoming)) {
                        return "true";
                    }
                    d.lessonStatus = value;
                }
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
    }, [showPlayer, offeringId, slug, enrollmentId, autosaveThrottled, saveTrackingDataToBackend, syncTrackingFromScorm, syncTrackingFromScormThrottled]);

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

    useEffect(() => {
        if (!showPlayer) return;
        const interval = setInterval(() => autosaveThrottled("interval"), 30000);
        return () => clearInterval(interval);
    }, [showPlayer, autosaveThrottled]);

    useEffect(() => {
        if (!showPlayer) return;
        const handler = () => autosaveThrottled("unload");
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [showPlayer, autosaveThrottled]);

    const downloadCertificate = useCallback(async () => {
        if (!enrollmentId) {
            setError("Enrollment not found");
            setTimeout(() => setError(""), 2000);
            return;
        }

        try {
            setError("");
            setSuccess("");

            const res = await api.get("/lms/course-enrollments/download-certificate/", {
                params: { enrollment_id: Number(enrollmentId) },
                responseType: "blob",
            });

            // Try to pick filename from headers if backend sends it
            const disposition = res?.headers?.["content-disposition"] || "";
            const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
            const serverFilename = match ? decodeURIComponent(match[1]) : null;

            const filename =
                serverFilename ||
                `${String(title || "course").replace(/[^\w\-]+/g, "_")}_certificate.pdf`;

            const blob = new Blob([res.data], {
                type: res?.headers?.["content-type"] || "application/pdf",
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setSuccess("Certificate downloaded");
            setTimeout(() => setSuccess(""), 2000);
        } catch (e) {
            setError(e?.response?.data?.message || "Unable to download certificate");
            setTimeout(() => setError(""), 2500);
        }
    }, [enrollmentId, title]);


    const hasResume = Boolean(trackingData.progress > 0);
    const progressPct = Math.max(0, Math.min(100, Math.round(trackingData.progress || 0)));
    const statusColor = trackingData.status === "completed" || trackingData.status === "passed" ? "text-success" : trackingData.status === "incomplete" || trackingData.status === "browsing" ? "text-amber-600" : "text-slate-500";

    const certificateId =
        offering?.certificate_id ??
        offering?.enrollment?.certificate_id ??
        offering?.enrollment?.certificate_no ??
        null;

    const issuedOn =
        offering?.completed_at ??
        offering?.enrollment?.completed_at ??
        trackingData?.lastActivity ??
        null;

    const issuerName = "Sapphire Retail Limited (SRL)";
    const credentialName = title;

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(String(text));
            setSuccess("Copied");
            setTimeout(() => setSuccess(""), 1200);
        } catch {
            setError("Copy failed");
            setTimeout(() => setError(""), 1500);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-indigo-600 mb-4" />
                    <div className="text-slate-600">Loading course...</div>
                </div>
            </div>
        );
    }

    if (showPlayer) {
        return (
            <div className="h-screen flex flex-col bg-slate-900">
                <div className="bg-black border-b border-slate-800 px-4 py-3">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <button onClick={closeInlinePlayer} className="flex-shrink-0 text-slate-400 hover:text-white transition">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="min-w-0">
                                <div className="text-white font-medium truncate text-sm">{title}</div>
                                <div className="text-slate-400 text-xs">{formatDuration(trackingData.timeSpent)} · {progressPct}% complete</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {success && <div className="text-emerald-400 text-sm">{success}</div>}
                            {error && <div className="text-red-400 text-sm">{error}</div>}
                        </div>
                    </div>
                </div>
                <div ref={playerRef} className="flex-1 relative bg-black">
                    <iframe
                        ref={iframeRef}
                        title="course-player"
                        src={iframeSrc}
                        className="absolute inset-0 w-full h-full border-0"
                        allow="fullscreen; autoplay"
                        onLoad={() => {
                            try {
                                const w = iframeRef.current?.contentWindow;
                                if (w) {
                                    w.API = window.API;
                                    w.API_1484_11 = window.API_1484_11;
                                }
                            } catch {}
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-zinc-900 transition-colors duration-500 overflow-x-hidden relative">

            {/* --- SAPPHIRE BACKGROUND ANIMATIONS --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div
                    className="absolute w-[800px] h-[800px] bg-black/[0.08] rounded-full blur-[120px] transition-transform duration-700 ease-out"
                    style={{transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`}}
                />
                <div className="neural-grid-bg-steel opacity-40"/>
                <div className="dots-system">
                    {[...Array(30)].map((_, i) => (
                        <div key={i} className="node-steel">
                            <div className="pulse-line-steel"/>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                {/* --- CENTERED SAPPHIRE HEADER --- */}
                <header className="pt-16 pb-16 px-8 max-w-5xl mx-auto text-center flex flex-col items-center">

                    <h1 className="text-5xl lg:text-8xl font-black tracking-tighter leading-none mb-8 dark:text-gray-200 dark:bg-bodybg">
                        {title.split(' ').slice(0, -1).join(' ')} <br/>
                        <span className="shimmer-text uppercase">{title.split(' ').pop()}</span>
                    </h1>

                    {isEnrolled && (
                        <div className="flex flex-wrap justify-center items-center gap-6 mt-10">
                            <div
                                className="flex items-center gap-3 bg-zinc-50 px-5 py-2.5 rounded-2xl border border-zinc-100 shadow-sm dark:text-gray-200 dark:bg-bodybg">
                                <span
                                    className="text-[10px] font-black text-zinc-400 uppercase tracking-widest dark:text-gray-200 dark:bg-bodybg">Time Spent</span>
                                <span className="text-sm font-bold">{formatDuration(trackingData.timeSpent)}</span>
                            </div>
                            <div
                                className="flex items-center gap-3 bg-zinc-50 px-5 py-2.5 rounded-2xl border border-zinc-100 shadow-sm dark:text-gray-200 dark:bg-bodybg">
                                <span
                                    className="text-[10px] font-black text-zinc-400 uppercase tracking-widest dark:text-gray-200 dark:bg-bodybg">Status</span>
                                <span
                                    className={`text-sm font-bold uppercase ${statusColor}`}>{statusLabel(trackingData.status)}</span>
                            </div>
                        </div>
                    )}
                </header>

                <main className="max-w-7xl mx-auto px-8 pb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                        {/* --- LEFT: COURSE CONTENT --- */}
                        <div className="lg:col-span-8 space-y-12">
                            {isEnrolled && (
                                <div
                                    className="bg-white border border-gray-200 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group dark:text-gray-200 dark:bg-bodybg">
                                    <div
                                        className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                        </svg>
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-end justify-between mb-6">
                                            <div>
                                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-1 dark:text-gray-200 dark:bg-bodybg">Learning
                                                    Progress</h3>
                                                <div className="text-5xl font-black tracking-tighter dark:text-gray-200 dark:bg-bodybg">{progressPct}%
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div
                                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-gray-200 dark:bg-bodybg">Current
                                                    Score
                                                </div>
                                                <div className="text-2xl font-bold dark:text-gray-200 dark:bg-bodybg">{trackingData.score || 0}%</div>
                                            </div>
                                        </div>

                                        <div
                                            className="w-full h-4 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                                            <div
                                                className="h-full bg-zinc-900 transition-all duration-1000 ease-out"
                                                style={{width: `${progressPct}%`}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-zinc-50/50 border border-zinc-100 p-12 rounded-[3rem] dark:text-gray-200 dark:bg-bodybg">
                                <h2 className="text-3xl font-black uppercase tracking-tight mb-8 dark:text-gray-200 dark:bg-bodybg">Curriculum
                                    Insight</h2>
                                <div className="prose prose-zinc max-w-none">
                                    <p className="text-zinc-600 text-lg leading-relaxed mb-10 dark:text-gray-200 dark:bg-bodybg">{description}</p>

                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 dark:text-gray-200 dark:bg-bodybg">Course
                                        Objectives</h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {[
                                            "Interactive SCORM Architecture",
                                            "Automatic State Bookmarking",
                                            "Session Persistence Logic",
                                            "Compliance Score Tracking"
                                        ].map((item, i) => (
                                            <div key={i}
                                                 className="flex items-center gap-4 p-5 bg-white border border-zinc-200 rounded-2xl dark:text-gray-200 dark:bg-bodybg">
                                                <div
                                                    className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                                    <svg className="w-3 h-3 text-white" fill="none"
                                                         stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth="4" d="M5 13l4 4L19 7"/>
                                                    </svg>
                                                </div>
                                                <span
                                                    className="text-xs font-bold uppercase tracking-tight dark:text-gray-200 dark:bg-bodybg">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- RIGHT: ACTIONS SIDEBAR --- */}
                        <div className="lg:col-span-4 space-y-6 sticky top-8">
                            <div
                                className="bg-white border border-gray-200 rounded-[2.5rem] shadow-xl overflow-hidden dark:text-gray-200 dark:bg-bodybg">
                                <div className="p-8">
                                    {/* Alerts */}
                                    {success && (
                                        <div
                                            className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-800 animate-bounce">
                                            {success}
                                        </div>
                                    )}
                                    {error && (
                                        <div
                                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-800">
                                            {error}
                                        </div>
                                    )}

                                    {!isEnrolled ? (
                                        <div className="space-y-6">
                                            <div className="text-center">
                                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Initialize</h3>
                                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                                    {canSelfEnroll ? "Self-Enrollment Available" : "Restricted Access"}
                                                </p>
                                            </div>

                                            <button
                                                onClick={selfEnroll}
                                                disabled={!canSelfEnroll || enrolling}
                                                className="w-full py-5 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all active:scale-95 disabled:bg-zinc-100 disabled:text-zinc-400 shadow-xl border-b-4 border-black/20"
                                            >
                                                {enrolling ? "Processing..." : "Enroll for Free"}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {hasResume && !isCompleted && (
                                                <div
                                                    className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center gap-4">
                                                    <div
                                                        className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white shrink-0">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                                             viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth="2"
                                                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                        </svg>
                                                    </div>
                                                    <div
                                                        className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Restore
                                                        Session Available
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                {isCompleted ? (
                                                    <>
                                                        {/* Primary: Certificate */}
                                                        <button
                                                            onClick={downloadCertificate}
                                                            className="w-full py-6 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em]
                                                               hover:bg-emerald-700 transition-all active:scale-95 shadow-2xl border-b-4 border-black/20
                                                               flex items-center justify-center gap-3"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                                                 viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      strokeWidth="2"
                                                                      d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v3a1 1 0 001 1h14a1 1 0 001-1v-3"/>
                                                            </svg>
                                                            Download Certificate
                                                        </button>

                                                        {/* Secondary: Review */}
                                                        <button
                                                            onClick={openInlinePlayer}
                                                            disabled={!canOpenCourse}
                                                            className="w-full py-5 bg-white text-zinc-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em]
                                                               border-2 border-zinc-900 hover:bg-zinc-50 transition-all active:scale-95 shadow-xl
                                                               flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor"
                                                                 viewBox="0 0 20 20">
                                                                <path fillRule="evenodd"
                                                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                                      clipRule="evenodd"/>
                                                            </svg>
                                                            Review Course
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={openInlinePlayer}
                                                        disabled={!canOpenCourse}
                                                        className="w-full py-6 bg-zinc-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em]
                                                                 hover:bg-emerald-600 transition-all active:scale-95 shadow-2xl border-b-4 border-black/20
                                                                 flex items-center justify-center gap-3 disabled:bg-zinc-100 disabled:text-zinc-400 border border-gray-200"
                                                    >
                                                        <svg className="w-5 h-5" fill="currentColor"
                                                             viewBox="0 0 20 20">
                                                            <path fillRule="evenodd"
                                                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                        {hasResume ? "Continue Module" : "Launch Course"}
                                                    </button>
                                                )}
                                            </div>


                                            <div className="pt-6 border-t border-zinc-100 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span
                                                        className="text-[10px] font-black text-zinc-400 uppercase tracking-widest dark:text-gray-200 dark:bg-bodybg">Active Time</span>
                                                    <span
                                                        className="text-sm font-bold dark:text-gray-200 dark:bg-bodybg">{formatDuration(trackingData.timeSpent)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span
                                                        className="text-[10px] font-black text-zinc-400 uppercase tracking-widest dark:text-gray-200 dark:bg-bodybg">Module Status</span>
                                                    <span
                                                        className={`text-sm font-bold uppercase   ${statusColor}`}>{statusLabel(trackingData.status)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-zinc-900 p-6 flex items-center gap-3 border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                    <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                    </svg>
                                    <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] dark:text-gray-200 dark:bg-bodybg">End-to-End Encryption Active</span>
                                </div>
                            </div>

                            {/* LINKEDIN CREDENTIAL CARD (COMPACT) */}
                            {isCompleted && certificateId && (
                                <div className="p-7 bg-white border-2 border-zinc-900 rounded-[2.5rem] shadow-xl space-y-5 dark:text-gray-200 dark:bg-bodybg
 ">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-gray-200 dark:bg-bodybg
">
                                                LinkedIn Credential
                                            </h4>
                                            <div className="mt-2 text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-gray-200 dark:bg-bodybg
">
                                                Add to LinkedIn
                                            </div>
                                        </div>

                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 text-white text-[9px] font-black uppercase tracking-[0.2em] dark:text-gray-200 dark:bg-bodybg border border-gray-200
">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 6L9 17l-5-5" />
                                            </svg>
                                            Verified
                                        </div>
                                    </div>

                                    {/* Credential ID row */}
                                    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-3 dark:text-gray-200 dark:bg-bodybg
">
                                        <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest dark:text-gray-200 dark:bg-bodybg
">
          Credential ID
        </span>
                                            <button
                                                onClick={() => copyToClipboard(certificateId)}
                                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-900 hover:text-emerald-700 transition dark:text-gray-200 dark:bg-bodybg
"
                                                type="button"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 9h10M9 13h10M9 17h7" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 4h12a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" />
                                                </svg>
                                                Copy
                                            </button>
                                        </div>

                                        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:text-gray-200 dark:bg-bodybg">
                                            <div className="text-[11px] font-black tracking-wide text-zinc-900 break-all dark:text-gray-200 dark:bg-bodybg
">
                                                {certificateId}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-3 border-t border-zinc-200 dark:text-gray-200 dark:bg-bodybg">
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest dark:text-gray-200 dark:bg-bodybg
">
          Issued
        </span>
                                            <span className="text-[11px] font-black">
          {issuedOn ? formatDate(issuedOn) : "—"}
        </span>
                                        </div>
                                    </div>

                                    {/* Compact steps */}
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            'LinkedIn → "Licenses & Certifications"',
                                            `Name: ${credentialName}`,
                                            `Issuer: ${issuerName}`,
                                            `ID: ${certificateId}`,
                                        ].map((step, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                {/* small checkbox icon */}
                                                <div className="mt-0.5 w-5 h-5 rounded-md  flex items-center justify-center shrink-0  border border-gray-200">
                                                    <svg className="w-3.5 h-3.5 text-zinc-900 dark:text-gray-200 dark:bg-bodybg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 6L9 17l-5-5" />
                                                    </svg>
                                                </div>
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 leading-5 dark:text-gray-200 dark:bg-bodybg
">
                                                    {step}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA row */}
                                    <div className="pt-3 border-t border-zinc-100 flex items-center gap-3">
                                        <button
                                            onClick={() =>
                                                window.open(
                                                    "https://www.linkedin.com/in/rehabzafar/edit/forms/certification/new/?isFromA2p=true",
                                                    "_blank",
                                                    "noopener,noreferrer"
                                                )
                                            }
                                            className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]
                   hover:bg-emerald-600 transition-all active:scale-95 shadow-xl border-b-4 border-black/20
                   flex items-center justify-center gap-3  border border-gray-200"
                                            type="button"
                                        >
                                            {/* small LinkedIn icon */}
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.604 0 4.268 2.372 4.268 5.456v6.285zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM6.814 20.452H3.859V9h2.955v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.727v20.545C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.273V1.727C24 .774 23.2 0 22.222 0h.003z"/>
                                            </svg>
                                            Add to LinkedIn
                                        </button>
                                    </div>
                                </div>
                            )}



                            {/* RESTORED DATES & META */}
                            {
                                startDate && endDate && (
                                    <div className="p-8 bg-zinc-50 border border-zinc-200 rounded-[2.5rem] space-y-6 dark:text-gray-200 dark:bg-bodybg ">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Course
                                            Protocol</h4>

                                        {/* RESTORED DATES */}
                                        <div className="space-y-4 pt-2">
                                            <div className="flex justify-between items-center">
                                        <span
                                            className="text-[10px] font-bold text-zinc-400 uppercase dark:text-gray-200 dark:bg-bodybg ">Effective Date</span>
                                                <span className="text-[11px] font-black">{formatDate(startDate)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                        <span
                                            className="text-[10px] font-bold text-zinc-400 uppercase dark:text-gray-200 dark:bg-bodybg ">Expiry Date</span>
                                                <span className="text-[11px] font-black">{formatDate(endDate)}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-zinc-200 space-y-3">
                                            {["Verified Content", "Progress Synced"].map((text, i) => (
                                                <div key={i} className="flex items-center gap-3 text-zinc-500">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400"/>
                                                    <span
                                                        className="text-[9px] font-bold uppercase tracking-widest dark:text-gray-200 dark:bg-bodybg">{text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                    </div>
                </main>
            </div>

            <CourseFeedbackModal
                open={showFeedback}
                enrollmentId={enrollmentId}
                onSubmitted={() => {
                    setFeedbackSubmitted(true);
                    setShowFeedback(false);
                    fetchDetail();
                }}
            />

            <style dangerouslySetInnerHTML={{
                __html: `
        .neural-grid-bg-steel {
            position: absolute; inset: 0;
            background-image: linear-gradient(to right, rgba(0,0,0,0.15) 1.5px, transparent 1.5px), 
                              linear-gradient(to bottom, rgba(0,0,0,0.15) 1.5px, transparent 1.5px);
            background-size: 80px 80px; animation: drift 60s linear infinite;
        }
        .node-steel { position: absolute; width: 6px; height: 6px; background: rgba(0,0,0,0.25); border-radius: 50%; animation: float linear infinite; }
        .pulse-line-steel { position: absolute; width: 1.5px; height: 150px; background: linear-gradient(to bottom, rgba(0,0,0,0.15), transparent); top: 100%; left: 50%; transform-origin: top; animation: p-line 6s ease-in-out infinite; }
        @keyframes p-line { 0%, 100% { transform: scaleY(0); opacity: 0; } 50% { transform: scaleY(1.4); opacity: 1; } }
        ${[...Array(30)].map((_, i) => `
            .node-steel:nth-child(${i + 1}) { left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; animation-duration: ${15 + Math.random() * 10}s; animation-delay: -${Math.random() * 10}s; }
        `).join('')}
        @keyframes drift { from { background-position: 0 0; } to { background-position: 800px 800px; } }
        @keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(60px, 40px); } }
        .shimmer-text { background: linear-gradient(90deg, #aaa, #000, #aaa); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shine 5s linear infinite; }
        @keyframes shine { to { background-position: 200% center; } }
    `
            }}/>
        </div>
    );
}