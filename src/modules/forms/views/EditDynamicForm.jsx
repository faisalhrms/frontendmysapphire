import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DynamicFormBuilder from "@modules/forms/components/DynamicFormBuilder.jsx";
import React from "react";
import {useParams} from "react-router-dom";
import {useDynamicFormEdit} from "@modules/forms/hooks/dynamicFormHooks.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const EditDynamicForm = ({}) => {
    const { id } = useParams();
    const {data, isLoading}   = useDynamicFormEdit(id)
    return (
        <>
            <PageHeader currentpage="Edit form" activepage="Dynamic Form" mainpage="Edit"/>
            {
                isLoading ?
                <LoadingSpinner />
                    :
                    <DynamicFormBuilder formData={data} />
            }
        </>
    )
}

export default EditDynamicForm;