import DynamicFormBuilder from "@modules/forms/components/DynamicFormBuilder.jsx";
import React from "react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {FileCheck2, FilePlus} from "lucide-react";
import DynamiceDetailApproval from "@modules/approvals/dynamiceform/components/DynamiceDetailApproval.jsx";

const CreateDynamicForm = ({}) => {

    return (
        <>
            <IconPageHeader
                heading="Dynamic Detail Approval"
                description="Manage and streamline multi-level form approval workflows with ease."
                icon={FileCheck2}
            />
            <DynamiceDetailApproval/>
        </>
    )
}

export default CreateDynamicForm;