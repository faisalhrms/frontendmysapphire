import React from "react";
import { PlusCircle } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import LmsScorm from "@modules/lms/components/scorm-courses/LmsScorm.jsx";

const ScromCourse = () => {
    return (
        <>
            <IconPageHeader
                heading="SCORM Packages"
                description="Add a new course and organize learning content for learners."
                icon={PlusCircle}
            />
            <LmsScorm showHeader={false} />
        </>
    );
};

export default ScromCourse;
