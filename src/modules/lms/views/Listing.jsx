import React from 'react';

import LmsListing from "@modules/lms/components/LmsListing.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {BookOpen} from "lucide-react";

const Listing = () => {
    return (
        <>
            <IconPageHeader
                heading="LMS Courses Listing"
                description="View and manage all available courses, track content, and access learning materials."
                icon={BookOpen}
            />
            <LmsListing />
        </>
    );
};

export default Listing;

