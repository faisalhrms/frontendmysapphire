import {useParams} from "react-router-dom";
import {useFetchLocationSubnetById} from "@modules/inventory/hooks/useLocationSubnetHooks.js";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Shield} from "lucide-react";
import React from "react";
import LocationSubnetForm from "@modules/inventory/components/LocationSubnetForm.jsx";

const LocationSubnetEdit=()=>{
    const { id } = useParams();
    const {subnetData}=useFetchLocationSubnetById(id)
    return (
        <>
            <IconPageHeader
                heading="Edit Subnet ips"
                description="Create and configure a new policy, set its visibility, and attach relevant documents."
                icon={Shield}
            />
            {
                subnetData&&(
                    <LocationSubnetForm subnetData={subnetData} isEditMode={true}/>
                )
            }
        </>
    )
}
export default LocationSubnetEdit;