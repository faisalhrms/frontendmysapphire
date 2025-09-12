import {Shield} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import React from "react";
import WarrantyForm from "@modules/it_governance/components/WarrantyForm.jsx";

const WarrantyAdd =()=>{
    return (
        <>
            <IconPageHeader
                heading="Add New Warranty"
                description="Add a new Warranty"
                icon={Shield}
            />
            <WarrantyForm/>
        </>
    )

}
export default WarrantyAdd