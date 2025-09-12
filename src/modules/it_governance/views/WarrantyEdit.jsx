import {useParams} from "react-router-dom";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Edit3} from "lucide-react";
import React from "react";
import {useFetchWarrantyById} from "@modules/it_governance/hooks/useWarrantyForm.js";
import WarrantyForm from "@modules/it_governance/components/WarrantyForm.jsx";

const WarrantyEdit = () => {
    const { id } = useParams();
    const{warrantyData}=useFetchWarrantyById(id)
    return (
        <>
            <IconPageHeader
                heading="Edit Application Universe"
                description="Edit Application."
                icon={Edit3}
            />
            {warrantyData&&(
                <WarrantyForm warrantyData={warrantyData} isEditMode={true}/>
            )}
        </>
    )
}
export default WarrantyEdit