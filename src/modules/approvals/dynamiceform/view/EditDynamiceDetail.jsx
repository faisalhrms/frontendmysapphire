import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useDynamicFormEdit } from "@modules/forms/hooks/dynamicFormHooks.js";
import DynamicDetailApproval from "@modules/approvals/dynamiceform/components/DynamiceDetailApproval.jsx";

const DynamicFormDetail = () => {
    const { id } = useParams();
    const { data, isLoading } = useDynamicFormEdit(id);

    return (
        <>
            <PageHeader currentpage="Edit form" activepage="Dynamic Detail Approval" mainpage="Edit"/>
            {isLoading ? <LoadingSpinner /> : <DynamicDetailApproval formData={data} isEditMode={true} />}
        </>
    );
};

export default DynamicFormDetail;