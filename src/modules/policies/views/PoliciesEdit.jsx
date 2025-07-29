import {useParams} from "react-router-dom";
import {usePolicy} from "@modules/policies/hooks/policyHooks.js";
import React from "react";
import PoliciesForm from "@modules/policies/components/PoliciesForm.jsx";
import {Edit3} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

const PoliciesEdit=()=>{
    const { id } = useParams();
   const{policyData}= usePolicy(id)
    return(
        <>
            <IconPageHeader
                heading="Edit Policy"
                description="Update policy details, adjust visibility settings, and manage related documents."
                icon={Edit3}
            />
            {policyData
                &&(
                    <PoliciesForm policyData={policyData} isEditMode={true}/>
                )
            }
        </>
    )
}
export default PoliciesEdit