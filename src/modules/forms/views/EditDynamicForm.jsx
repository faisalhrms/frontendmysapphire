import DynamicFormBuilder from "@modules/forms/components/DynamicFormBuilder.jsx";
import React from "react";
import {useParams} from "react-router-dom";
import {useDynamicFormEdit} from "@modules/forms/hooks/dynamicFormHooks.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import {FileEdit} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

const EditDynamicForm = ({}) => {
    const { id } = useParams();
    const {data, isLoading}   = useDynamicFormEdit(id)
    return (
        <>
            <IconPageHeader
                heading="Edit Dynamic Form"
                description="Edit and configure a dynamic form with customizable fields and settings."
                icon={FileEdit}
            />
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