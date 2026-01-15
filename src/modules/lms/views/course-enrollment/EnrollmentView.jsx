import React from 'react';
import { Eye } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import CourseEnrollmentView from "@modules/lms/components/courseenrollment/CourseEnrollmentView.jsx";

const EnrollmentView = () => {
    return (
        <>
            <IconPageHeader
                heading="View Enrollment"
                description="Detailed view of the course enrollment record."
                icon={Eye}
            />
            <CourseEnrollmentView />
        </>
    );
};

export default EnrollmentView;