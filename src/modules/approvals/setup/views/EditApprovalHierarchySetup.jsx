import React from 'react';
import {HardDrive} from 'lucide-react';
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {useParams} from "react-router-dom";
import ApprovalTypeHierarchyForm from "@modules/approvals/setup/components/ApprovalTypeHierarchyForm.jsx";

const EditApprovalHierarchySetup = () => {
    const { id } = useParams();
    return (
            <>
                <IconPageHeader
                    heading="Objective"
                    description="My Objective - Create Form"
                    icon={HardDrive}
                />

                <ApprovalTypeHierarchyForm editMode={true} hierarchyId={id} />
            </>
    );
};

export default EditApprovalHierarchySetup;