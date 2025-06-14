// src/modules/recruitment/views/ApplicantLists.jsx
import React, { useState } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabsWithPermission from "@components/IconTabsWithPermission.jsx";
import ApplicantsTable from "@modules/recruitment/components/ApplicantsTable.jsx";

// Define your tab definitions with optional `permission` strings:
const tabDefinitions = [
    {
        id: "allApplicant",
        label: "All Applicants",
        icon: <i className="ri-file-list-line"></i>,
        content: (
            <ApplicantsTable
                apiUrl={`/recruitment/applicants/datatable/`}
                title="All Applicants"
            />
        ),
        permission: "recruitment.change_applicant_status_applicant", // only show if user has this
    },
    {
        id: "locationBased",
        label: "Applicants",
        icon: <i className="ri-map-pin-line"></i>,
        content: (
            <ApplicantsTable
                apiUrl={`/recruitment/applicants/location-based/datatable/`}
                title="Location Based Applicants"
            />
        ),
        permission: "recruitment.view_location_based_applicant", // or remove field to always show
    },
];

const ApplicantLists = () => {
    const [activeTab, setActiveTab] = useState("allApplicant");

    return (
        <>
            <PageHeader currentpage="Applicants" mainpage="Recruitment" />

            <IconTabsWithPermission
                tabsConfig={tabDefinitions}
                onTabChange={(newTab) => setActiveTab(newTab)}
            />
        </>
    );
};

export default ApplicantLists;
