import {AppWindow} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import React from "react";
import ApplicationUniverseForm from "@modules/it_governance/components/ApplicationUniverseForm.jsx";

const ApplicationUniverseAdd =()=>{
    return (
        <>
            <IconPageHeader
                heading="Add New Application"
                description="Register a new application in the Application Universe, including key details and ownership information."
                icon={AppWindow}
            />
            <ApplicationUniverseForm/>
        </>
    )

}
export default ApplicationUniverseAdd