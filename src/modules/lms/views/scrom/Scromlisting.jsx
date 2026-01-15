import React from "react";
import { PlusCircle } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import LmsScormListing from "@modules/lms/components/scorm-courses/LmsScormListing.jsx";

const ScromListing = () => {
    return (
        <>
            <IconPageHeader
                heading="SCORM Packages"
                description="Add a new course and organize learning content for learners."
                icon={PlusCircle}
            />
            <LmsScormListing showHeader={false} />
        </>
    );
};

export default ScromListing;
