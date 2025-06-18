import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DynamicFormBuilder from "@modules/forms/components/DynamicFormBuilder.jsx";
import React from "react";

const CreateDynamicForm = ({}) => {

    return (
        <>
            <PageHeader currentpage="Create new form" activepage="Dynamic Form" mainpage="Create"/>
            <DynamicFormBuilder />
        </>
    )
}

export default CreateDynamicForm;