import {ShieldCheck } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import React from "react";
import WarrantyForm from "@modules/it_governance/components/WarrantyForm.jsx";

const WarrantyAdd =()=>{
    return (
        <>
            <IconPageHeader
                heading="Add New Warranty"
                description="Register a new warranty, including coverage details, duration, and related documentation."
                icon={ShieldCheck }
            />
            <WarrantyForm/>
        </>
    )

}
export default WarrantyAdd