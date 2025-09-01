import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Shield} from "lucide-react";
import React from "react";
import SweepersGuardsForm from "@modules/dynamics/sweeper-and-gards/components/SweepersGuardsForm.jsx";

const SweepersGardAdd = () => {
    return (
        <>
            <IconPageHeader
                heading="Add New Entry"
                description="Create and configure a new policy, set its visibility, and attach relevant documents."
                icon={Shield}
            />
           <SweepersGuardsForm/>
        </>
    )
}
export default SweepersGardAdd