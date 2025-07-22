import React from 'react';
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import RoadmapDashboard from "@modules/dashboards/roadmap/view/RoadmapDashboard.jsx";

const RoadMap = () => {
    return (
        <>
            <PageHeader
                currentpage="RoadMap Sourcing Beirholm"
                activepage="Roadmap"
                mainpage="RoadMap Sourcing Beirholm"
            />
        <div>
         <RoadmapDashboard/>
        </div>
            </>
    );
};

export default RoadMap;
