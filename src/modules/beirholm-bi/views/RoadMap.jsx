import React from 'react';
import RoadmapForm from "@modules/beirholm-bi/components/RoadMapform.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

const RoadMap = () => {
    return (
        <>
            <PageHeader
                currentpage="RoadMap"
                activepage="Roadmap"
                mainpage="RoadMap"
            />
        <div>
         <RoadmapForm/>
        </div>
            </>
    );
};

export default RoadMap;
