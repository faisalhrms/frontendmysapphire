import {useParams} from "react-router-dom";
import {useCase} from "@modules/CustomerAssist/hooks/customerAssistHook.js";
import FormSection from "@modules/CustomerAssist/components/FormSection.jsx";
import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

const CustomerAssistEdit = (props) => {
    const { id } = useParams();
    const { caseData, isLoading, error } = useCase(id);
    return (
        <>
            <PageHeader currentpage="We Care" mainpage="Support" />

            {caseData && <FormSection data={caseData} isEdit={true} />}
        </>
    )
}
export default CustomerAssistEdit