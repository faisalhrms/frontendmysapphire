import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import IconTabs from "@components/IconTabs.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { Users, BadgeCheck, CalendarCheck2, CalendarX, ClipboardCheck } from "lucide-react";

import RequisitionAllApplicantList from "../views/RequisitionAllApplicantList.jsx";
import RequisitionShortlistedApplicant from "../views/RequisitionShortlistedApplicant.jsx";
import RequisitionInterviewScheduledApplicant from "../views/RequisitionInterviewScheduledApplicant.jsx";

// ✅ NEW
import RequisitionInterviewCancelledApplicant from "../views/RequisitionInterviewCancelledApplicant.jsx";
import RequisitionInterviewCompletedApplicant from "../views/RequisitionInterviewCompletedApplicant.jsx";

const DEFAULT_TAB = "all";

const RequisitionApplicant = () => {
    const { requisitionId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = searchParams.get("tab") || DEFAULT_TAB;

    const handleTabChange = (tabId) => {
        setSearchParams((prev) => {
            const p = new URLSearchParams(prev);
            p.set("tab", tabId);
            return p;
        });
    };

    return (
        <>
            <IconPageHeader
                heading="Requisition Applicants"
                description="Browse applicants for the selected requisition."
                icon={Users}
            />

            <IconTabs
                activeId={activeTab}
                defaultActiveId={DEFAULT_TAB}
                onTabChange={handleTabChange}
                tabs={[
                    {
                        id: "all",
                        label: "All Applicants",
                        icon: <Users className="text-sky-400" />,
                        content: (
                            <RequisitionAllApplicantList
                                requisitionId={requisitionId}
                                isActive={activeTab === "all"}
                            />
                        ),
                    },
                    {
                        id: "shortlisted",
                        label: "Shortlisted",
                        icon: <BadgeCheck className="text-success" />,
                        content: (
                            <RequisitionShortlistedApplicant
                                requisitionId={requisitionId}
                                isActive={activeTab === "shortlisted"}
                            />
                        ),
                    },
                    {
                        id: "interview_scheduled",
                        label: "Interview Scheduled",
                        icon: <CalendarCheck2 className="text-primary" />,
                        content: (
                            <RequisitionInterviewScheduledApplicant
                                requisitionId={requisitionId}
                                isActive={activeTab === "interview_scheduled"}
                            />
                        ),
                    },

                    // ✅ NEW TAB: Cancelled
                    {
                        id: "interview_cancelled",
                        label: "Interview Cancelled",
                        icon: <CalendarX className="text-danger" />,
                        content: (
                            <RequisitionInterviewCancelledApplicant
                                requisitionId={requisitionId}
                                isActive={activeTab === "interview_cancelled"}
                            />
                        ),
                    },

                    // ✅ NEW TAB: Completed
                    {
                        id: "interview_completed",
                        label: "Interview Completed",
                        icon: <ClipboardCheck className="text-success" />,
                        content: (
                            <RequisitionInterviewCompletedApplicant
                                requisitionId={requisitionId}
                                isActive={activeTab === "interview_completed"}
                            />
                        ),
                    },
                ]}
            />
        </>
    );
};

export default RequisitionApplicant;
