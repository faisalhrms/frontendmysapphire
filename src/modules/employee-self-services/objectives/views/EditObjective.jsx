import React from 'react';
import {
    HardDrive,
    Shield
} from 'lucide-react';
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {useActiveYear} from "@modules/employee-self-services/objectives/hooks/useActiveYear.js";
import EmptyState from "@components/EmptyState.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import ObjectiveForm from "@modules/employee-self-services/objectives/components/ObjectiveForm.jsx";
import {useParams} from "react-router-dom";

const EditObjective = () => {
    const { isActiveYear, isFetchingYear } = useActiveYear('edit');
    const { year } = useParams();
    return (
        <>
            <IconPageHeader
                heading="Objective"
                description="Edit Objective - For Year"
                icon={HardDrive}
            />
            <div className="min-h-screen">
                {isFetchingYear ? (
                    <LoadingSpinner />
                ) : !isActiveYear ? (
                    <EmptyState
                        icon={Shield}
                        heading="Objective updation is currently disabled"
                        description="The active year for setting objectives is not available at the moment."
                    />
                ) : (
                    <ObjectiveForm year={year} editMode={true} />
                )}

            </div>
        </>
    );
};

export default EditObjective;