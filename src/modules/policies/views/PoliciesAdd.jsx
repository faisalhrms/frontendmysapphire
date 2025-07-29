import React from "react";
import PoliciesForm from "@modules/policies/components/PoliciesForm.jsx";
import {Shield} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

const PoliciesAdd =()=>{
    return (
        <>
            <IconPageHeader
                heading="Add New Policy"
                description="Create and configure a new policy, set its visibility, and attach relevant documents."
                icon={Shield}
            />
            <PoliciesForm/>
        </>
    )
}
export default PoliciesAdd