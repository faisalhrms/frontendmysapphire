import {useParams} from "react-router-dom";
import {usePolicy} from "@modules/policies/hooks/policyHooks.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import React from "react";
import PoliciesForm from "@modules/policies/components/PoliciesForm.jsx";

const PoliciesEdit=()=>{
    const { id } = useParams();
   const{policyData}= usePolicy(id)
    return(
        <>
            <PageHeader currentpage='Edit Asset' activepage="Asset" mainpage="Edit Asset"/>
            {policyData
                &&(
                    <PoliciesForm policyData={policyData} isEditMode={true}/>
                )
            }
        </>
    )
}
export default PoliciesEdit