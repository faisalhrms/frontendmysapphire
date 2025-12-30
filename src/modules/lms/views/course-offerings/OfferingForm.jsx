import React from "react";
import { PlusCircle } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import CourseOfferingForm from "@modules/lms/components/course-offering/CourseOfferingForm.jsx";

const OfferingForm = () => {
    return (
        <>
            <IconPageHeader
                heading="Create Course Offering"
                description="Create and publish a course offering for learners."
                icon={PlusCircle}
            />

            <CourseOfferingForm showHeader={false} showBackButton={false} />
        </>
    );
};

export default OfferingForm;
