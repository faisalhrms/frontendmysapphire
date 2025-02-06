import { useEffect } from "react";

const AnalyticsTracker = () => {
    useEffect(() => {
        let visitorId = localStorage.getItem("visitor_id");
        if (!visitorId) {
            visitorId = Math.random().toString(36).substring(2);
            localStorage.setItem("visitor_id", visitorId);
        }

        const websiteId = 1;

        const trackPageView = async (sessionId) => {
            const pageViewData = {
                session_id: sessionId,
                url: window.location.href,
            };

            await fetch("http://127.0.0.1:8000/api/site-analytics/track_page_view/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(pageViewData),
            });
        };

        const startSession = async () => {
            const sessionData = {
                visitor_id: visitorId,
                website_id: websiteId,
                user_agent: navigator.userAgent,
                referer: document.referrer || "",
            };

            try {
                const response = await fetch("http://127.0.0.1:8000/api/site-analytics/start_session/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(sessionData),
                });

                const data = await response.json();
                const sessionId = data.session_id;


                await trackPageView(sessionId);

                window.addEventListener("beforeunload", () => {
                    endSession(sessionId);
                });

                const endSession = async (sessionId) => {
                    const endSessionData = {
                        session_id: sessionId,
                    };

                    await fetch("http://127.0.0.1:8000/api/site-analytics/end_session/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(endSessionData),
                    });
                };

            } catch (error) {
                console.error("Error starting session:", error);
            }
        };

        startSession();
    }, []);

    return null;
};

export default AnalyticsTracker;
