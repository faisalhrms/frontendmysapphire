import React from "react";
import { List } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import CourseOfferingList from "@modules/lms/components/course-offering/CourseOfferingList.jsx";

const OfferingList = () => {
    return (
        <>
            <IconPageHeader
                heading="Course Offerings"
                description="Manage and view all course offerings."
                icon={List}
            />
            <CourseOfferingList />
        </>
    );
};

export default OfferingList;
