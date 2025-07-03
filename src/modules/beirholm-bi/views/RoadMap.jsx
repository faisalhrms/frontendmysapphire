import React from 'react';
import RoadmapForm from "@modules/beirholm-bi/components/RoadMapform.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

const RoadMap = () => {
    return (
        <>
            <PageHeader
                currentpage="Road Map Sourcing Beirholm"
                activepage="Road map"
                mainpage="Road Map Sourcing Beirholm"
            />
        <div>
         <RoadmapForm/>
        </div>
            </>
    );
};

export default RoadMap;
