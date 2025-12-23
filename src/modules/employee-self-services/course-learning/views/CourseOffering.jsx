import React from "react";
import PublishedOfferings from "@modules/employee-self-services/course-learning/components/PublishedOfferings.jsx";


export default function CourseOffering() {
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-lg font-semibold">Enrollments</h1>

            <PublishedOfferings
                showEnrollButton={true}
                onSelectOffering={(offering) => {
                    console.log("Selected offering:", offering);
                }}
            />
        </div>
    );
}
