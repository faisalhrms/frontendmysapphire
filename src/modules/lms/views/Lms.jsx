import React from 'react';
import LmsCourse from "@modules/lms/components/LmsCourse.jsx";
import {PlusCircle} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";


const Lms = () => {
    return (
        <>
            <IconPageHeader
                heading="Create LMS Course"
                description="Add a new course and organize learning content for learners."
                icon={PlusCircle}
            />
            <LmsCourse />
        </>
    );
};

export default Lms;

