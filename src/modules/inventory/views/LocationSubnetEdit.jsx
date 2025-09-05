import {useParams} from "react-router-dom";
import {useFetchLocationSubnetById} from "@modules/inventory/hooks/useLocationSubnetHooks.js";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Router} from "lucide-react";
import React from "react";
import LocationSubnetForm from "@modules/inventory/components/LocationSubnetForm.jsx";

const LocationSubnetEdit=()=>{
    const { id } = useParams();
    const {subnetData}=useFetchLocationSubnetById(id)
    return (
        <>
            <IconPageHeader
                heading="Edit Subnet IPs"
                description="Update IP ranges, adjust settings, and keep your subnet configuration accurate."
                icon={Router}
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