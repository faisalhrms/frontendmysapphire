import React from 'react';
import {HardDrive} from 'lucide-react';
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import ApprovalTypeHierarchyForm from "@modules/approvals/setup/components/ApprovalTypeHierarchyForm.jsx";

const CreateApprovalHierarchySetup = () => {

    return (
            <>
                <IconPageHeader
                    heading="Objective"
                    description="My Objective - Create Form"
                    icon={HardDrive}
                />
                <ApprovalTypeHierarchyForm />
            </>
    );
};

export default CreateApprovalHierarchySetup;