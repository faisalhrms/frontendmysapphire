import { useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import api from "@config/axiosConfig.js";

const SESSION_TIMEOUT = 15 * 60 * 1000;
const SESSION_STORAGE_KEY = "analytics_session";
const LAST_ACTIVITY_KEY = "analytics_last_activity";

const useAnalyticsTracker = () => {
    const location = useLocation();
    const inactivityTimerRef = useRef(null);
    const sessionInitializedRef = useRef(false);

    const getOrCreateSession = useCallback(async () => {
        const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
        const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
        const now = Date.now();

        if (storedSession && lastActivity) {
            const timeSinceActivity = now - parseInt(lastActivity, 10);

            if (timeSinceActivity < SESSION_TIMEOUT) {
                localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
                return storedSession;
            }
        }

        try {
            const response = await api.post("/analytics/sessions/");

            const sessionId = response.data.session_id;
            localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
            localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());

            return sessionId;
        } catch (error) {
            console.error("[Analytics] Failed to create session:", error);
            return null;
        }
    }, []);

    const trackEvent = useCallback(async (event = {}) => {
        const sessionId = await getOrCreateSession();
        if (!sessionId) return;

        try {
            const eventData = {
                session_id: sessionId,
                name: event.name || "page_view",
                category: event.category || "navigation",
                page_url: event.page_url || window.location.href,
                page_path: event.page_path || window.location.pathname,
                page_title: event.page_title || document.title,
                referrer: event.referrer || document.referrer || null,
                label: event.label || null,
                value: event.value || null,
                extra: {
                    viewport: `${window.innerWidth}x${window.innerHeight}`,
                    screen_resolution: `${window.screen.width}x${window.screen.height}`,
                    device_pixel_ratio: window.devicePixelRatio,
                    online: navigator.onLine,
                    connection_type: navigator.connection?.effectiveType || null,
                    downlink: navigator.connection?.downlink || null,
                    rtt: navigator.connection?.rtt || null,
                    language: navigator.language,
                    cookies_enabled: navigator.cookieEnabled,
                    do_not_track: navigator.doNotTrack === "1",
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    page_load_time: window.performance?.timing?.loadEventEnd - window.performance?.timing?.navigationStart || null,
                    dom_content_loaded: window.performance?.timing?.domContentLoadedEventEnd - window.performance?.timing?.navigationStart || null,
                    page_title: document.title,
                    ...event.extra,
                },
            };

            await api.post("/analytics/events/", eventData);
            localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
        } catch (error) {
            console.error("[Analytics] Failed to track event:", error);
        }
    }, [getOrCreateSession]);

    const endSession = useCallback(async () => {
        const sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
        if (!sessionId) return;

        try {
            await api.post(`/analytics/sessions/${sessionId}/end/`);

            localStorage.removeItem(SESSION_STORAGE_KEY);
            localStorage.removeItem(LAST_ACTIVITY_KEY);
        } catch (error) {
            console.error("[Analytics] Failed to end session:", error);
        }
    }, []);

    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }

        inactivityTimerRef.current = setTimeout(() => {
            endSession();
        }, SESSION_TIMEOUT);

        localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }, [endSession]);

    useEffect(() => {
        if (sessionInitializedRef.current) return;

        const initializeAnalytics = async () => {
            await getOrCreateSession();
            await trackEvent({
                name: "page_view",
                category: "navigation",
                page_path: location.pathname,
            });

            const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"];
            activityEvents.forEach(event =>
                window.addEventListener(event, resetInactivityTimer, { passive: true })
            );

            resetInactivityTimer();
            sessionInitializedRef.current = true;
        };

        initializeAnalytics();

        return () => {
            if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

            const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"];
            activityEvents.forEach(event =>
                window.removeEventListener(event, resetInactivityTimer)
            );
        };
    }, [getOrCreateSession, trackEvent, resetInactivityTimer, location.pathname]);

    useEffect(() => {
        if (!sessionInitializedRef.current) return;

        trackEvent({
            name: "page_view",
            category: "navigation",
            page_path: location.pathname,
        });
    }, [location.pathname, trackEvent]);

    return { trackEvent, endSession };
};

export default useAnalyticsTracker;
