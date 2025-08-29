import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useDynamicFormEdit } from "@modules/forms/hooks/dynamicFormHooks.js";
import DynamicDetailApproval from "@modules/forms/components/DynamicDetailApproval.jsx";

const DynamicFormDetail = () => {
    const { id } = useParams();
    const { data, isLoading } = useDynamicFormEdit(id);

    return (
        <>
            <PageHeader currentpage="Detail Page" activepage="Dynamic Detail Approval" mainpage="detail"/>
            {isLoading ? <LoadingSpinner /> : <DynamicDetailApproval formData={data} isEditMode={true} />}
        </>
    );
};

export default DynamicFormDetail;