import React from 'react';
import { Users } from "lucide-react";  // Better icon than PlusCircle
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import CourseEnrollmentList from "@modules/lms/components/courseenrollment/CourseEnrollmentList.jsx";

const EnrollmentList  = () => {
    return (
        <>
            <IconPageHeader
                heading="Course Enrollments"
                description="Manage and view all learner enrollments across courses."
                icon={Users}
            />
            <CourseEnrollmentList />
        </>
    );
};

export default EnrollmentList ;