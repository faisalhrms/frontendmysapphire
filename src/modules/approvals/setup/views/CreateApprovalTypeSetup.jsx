import React from 'react';
import {HardDrive} from 'lucide-react';
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import ApprovalTypeForm from "@modules/approvals/setup/components/ApprovalTypeForm.jsx";

const CreateApprovalTypeSetup = () => {

    return (
            <>
                <IconPageHeader
                    heading="Approval Type"
                    description="Create Approval Type"
                    icon={HardDrive}
                />
                <ApprovalTypeForm />
            </>
    );
};

export default CreateApprovalTypeSetup;