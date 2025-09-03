import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Shield} from "lucide-react";
import React from "react";
import LocationSubnetForm from "@modules/inventory/components/LocationSubnetForm.jsx";

const LocationSubnetAdd = (props) => {
    return (
        <>
            <IconPageHeader
                heading="Add New Location Subnet"
                description="Create and configure a new policy, set its visibility, and attach relevant documents."
                icon={Shield}
            />
            <LocationSubnetForm/>
        </>
    )
}
export default LocationSubnetAdd;