import {Shield} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import React from "react";
import ITGovernForm from "@modules/it_governance/components/ITGovernForm.jsx";

const ITGovernAdd =()=>{
    return (
        <>
            <IconPageHeader
                heading="Add New Entry"
                description="Create and configure a new policy, set its visibility, and attach relevant documents."
                icon={Shield}
            />
            <ITGovernForm/>
        </>
    )

}
export default ITGovernAdd