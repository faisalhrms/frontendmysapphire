import {useParams} from "react-router-dom";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Edit3} from "lucide-react";
import React from "react";
import ITGovernForm from "@modules/it_governance/components/ITGovernForm.jsx";
import {useFetchApplicationById} from "@modules/it_governance/hooks/useApplicationUniverseForm.js";
import ApplicationUniverseForm from "@modules/it_governance/components/ApplicationUniverseForm.jsx";

const ApplicationUniverseEdit = () => {
    const { id } = useParams();
    const{appData}=useFetchApplicationById(id)
    return (
        <>
            <IconPageHeader
                heading="Edit Application Universe"
                description="Edit Application."
                icon={Edit3}
            />
            {appData&&(
                <ApplicationUniverseForm appData={appData} isEditMode={true}/>
            )}
        </>
    )
}
export default ApplicationUniverseEdit