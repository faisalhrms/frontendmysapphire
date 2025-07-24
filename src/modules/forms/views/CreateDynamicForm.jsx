import DynamicFormBuilder from "@modules/forms/components/DynamicFormBuilder.jsx";
import React from "react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {FilePlus} from "lucide-react";

const CreateDynamicForm = ({}) => {

    return (
        <>
            <IconPageHeader
                heading="Create New Dynamic Form"
                description="Design and configure a dynamic form with customizable fields and settings."
                icon={FilePlus}
            />
            <DynamicFormBuilder />
        </>
    )
}

export default CreateDynamicForm;