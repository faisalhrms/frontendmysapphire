import React from "react";
import { PlusCircle } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import CoursesPage from "@modules/lms/components/LmsCourse.jsx";

const CoursesView = () => {
    return (
        <>
            <IconPageHeader
                heading="Create LMS Course"
                description="Add a new course and organize learning content for learners."
                icon={PlusCircle}
            />
            <CoursesPage />
        </>
    );
};

export default CoursesView;
