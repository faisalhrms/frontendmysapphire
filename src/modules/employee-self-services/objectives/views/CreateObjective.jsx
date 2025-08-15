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

const CreateObjective = () => {
    const { isActiveYear, isFetchingYear } = useActiveYear();

    return (
        <>
            <IconPageHeader
                heading="Objective"
                description="My Objective - Create Form"
                icon={HardDrive}
            />
            <div className="min-h-screen">
                {isFetchingYear ? (
                    <LoadingSpinner />
                ) : !isActiveYear ? (
                    <EmptyState
                        icon={Shield}
                        heading="Objective submission is currently disabled"
                        description="The active year for setting objectives is not available at the moment."
                    />
                ) : (
                    <ObjectiveForm />
                )}

            </div>
        </>
    );
};

export default CreateObjective;