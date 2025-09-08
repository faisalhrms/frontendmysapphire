import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Router} from "lucide-react";
import React from "react";
import LocationSubnetForm from "@modules/inventory/components/LocationSubnetForm.jsx";

const LocationSubnetAdd = (props) => {
    return (
        <>
            <IconPageHeader
                heading="Add New Location Subnet"
                description="Define a new subnet, set its scope, and link it to the right location."
                icon={Router}
            />
            <LocationSubnetForm/>
        </>
    )
}
export default LocationSubnetAdd;