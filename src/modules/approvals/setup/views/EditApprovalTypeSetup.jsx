import React from 'react';
import {HardDrive} from 'lucide-react';
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import ApprovalTypeForm from "@modules/approvals/setup/components/ApprovalTypeForm.jsx";
import {useParams} from "react-router-dom";

const EditApprovalTypeSetup = () => {
    const { id } = useParams();
    return (
            <>
                <IconPageHeader
                    heading="Objective"
                    description="My Objective - Create Form"
                    icon={HardDrive}
                />

                <ApprovalTypeForm editMode={true} approvalTypeId={id} />
            </>
    );
};

export default EditApprovalTypeSetup;