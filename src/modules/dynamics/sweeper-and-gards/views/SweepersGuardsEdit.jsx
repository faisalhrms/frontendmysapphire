import {useParams} from "react-router-dom";
import {
    useFetchSweeperGuardById
} from "@modules/dynamics/sweeper-and-gards/hooks/useSweeperGuardFormHook.js"
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Edit3} from "lucide-react";
import React from "react";
import SweepersGuardsForm from "@modules/dynamics/sweeper-and-gards/components/SweepersGuardsForm.jsx";
const SweepersGuardsEdit = () => {
    const { id } = useParams();
    const{sgData}=useFetchSweeperGuardById(id)
    return (
        <>
            <IconPageHeader
                heading="Edit Sweeper Guard Details"
                description="Update Sweeper Guard details."
                icon={Edit3}
            />
            {sgData&&(
                <SweepersGuardsForm sgData={sgData} isEditMode={true}/>
            )}
        </>
    )
}
export default SweepersGuardsEdit