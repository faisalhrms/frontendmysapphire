import React from "react";
import { Eye } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import CourseOfferingView from "@modules/lms/components/course-offering/CourseOfferingView.jsx";

const OfferingView = () => {
    return (
        <>
            <IconPageHeader
                heading="View Course Offering"
                description="Detailed view of the course offering record."
                icon={Eye}
            />
            <CourseOfferingView />
        </>
    );
};

export default OfferingView;
