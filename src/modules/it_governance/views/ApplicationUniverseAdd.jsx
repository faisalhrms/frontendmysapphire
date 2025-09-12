import {Shield} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import React from "react";
import ApplicationUniverseForm from "@modules/it_governance/components/ApplicationUniverseForm.jsx";

const ApplicationUniverseAdd =()=>{
    return (
        <>
            <IconPageHeader
                heading="Add New Application"
                description="Add a new application"
                icon={Shield}
            />
            <ApplicationUniverseForm/>
        </>
    )

}
export default ApplicationUniverseAdd