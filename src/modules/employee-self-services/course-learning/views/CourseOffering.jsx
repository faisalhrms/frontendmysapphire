import React from "react";
import { Eye } from "lucide-react";
import PublishedOfferings from "@modules/employee-self-services/course-learning/components/PublishedOfferings.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

export default function CourseOffering() {
    return (
        <div className="p-4 space-y-4">
            <IconPageHeader
                heading="Enrollments"
                description="Browse available course offerings and enroll."
                icon={Eye}
            />

            <PublishedOfferings
                showEnrollButton={true}
                onSelectOffering={(offering) => {
                    console.log("Selected offering:", offering);
                }}
            />
        </div>
    );
}
