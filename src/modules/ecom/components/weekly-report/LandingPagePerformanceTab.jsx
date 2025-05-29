import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import ClientSideTable from "@components/ClientSideTable.jsx";
import ProgressBar from "@components/ProgressBar.jsx";

const LandingPagePerformanceTab = ({data, isLoading, isActive}) => {
    if (!isActive) {
        return null
    }
    if (isLoading) {
        return <LoadingSpinner/>;
    }
    const tableData = (data || []).map((item) => ({
        name: item.name,
        sessions: item.sessions,
        avg_session_duration: item.avg_session_duration,
        engaged_sessions: item.engaged_sessions,
        engagement_rate: <ProgressBar value={item.engagement_rate} withStatus={false}/>,
    }));

    const tableConfig = {
        headers: [
            { label: "Name/URL", accessor: "name", align: "left"},
            { label: "Sessions", accessor: "sessions" },
            { label: "Avg Session Duration", accessor: "avg_session_duration" },
            { label: "Engaged Sessions", accessor: "engaged_sessions" },
            { label: "Engagement Rate", accessor: "engagement_rate" },
        ],
    };
    return (
        <ClientSideTable height="800px" tHeadClasses='text-white bg-[#383853]' config={tableConfig} data={tableData} title='Landing page mostly is showing (Not Set)'/>
    )
}
export default LandingPagePerformanceTab