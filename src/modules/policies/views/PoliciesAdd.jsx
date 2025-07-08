import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import React from "react";
import PoliciesForm from "@modules/policies/components/PoliciesForm.jsx";

const PoliciesAdd =()=>{
    return (
        <>
            <PageHeader currentpage="Policies" mainpage="Add Policy"  activepage="Policies" />
                <PoliciesForm/>
        </>
    )
}
export default PoliciesAdd