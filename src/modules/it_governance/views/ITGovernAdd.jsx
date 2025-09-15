import {FileText} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import React from "react";
import ITGovernForm from "@modules/it_governance/components/ITGovernForm.jsx";

const ITGovernAdd =()=>{
    return (
        <>
            <IconPageHeader
                heading="Create Service Level Agreement"
                description="Add a new Service Level Agreement, define its scope, and attach supporting documentation."
                icon={FileText}
            />
            <ITGovernForm/>
        </>
    )

}
export default ITGovernAdd