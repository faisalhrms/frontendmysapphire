import React from "react";
import { PlusCircle } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import CourseEnrollmentForm from "@modules/lms/components/courseenrollment/CourseEnrollmentForm.jsx";

const EnrollmentForm = () => {
    return (
        <>
            <IconPageHeader
                heading="Create Course Enrollment"
                description="Enroll a learner in a course (self-enrollment or assigned by HR)."
                icon={PlusCircle}
            />


            <CourseEnrollmentForm showHeader={false} showBackButton={false} />
        </>
    );
};

export default EnrollmentForm;
