import {useParams} from "react-router-dom";
import {useCase} from "@modules/CustomerAssist/hooks/customerAssistHook.js";
import FormSection from "@modules/CustomerAssist/components/CustomerAssistMainList.jsx";
import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

const CustomerAssistEdit = (props) => {
    const { id } = useParams();
    const { caseData, isLoading, error } = useCase(id);
    return (
        <>
            <PageHeader currentpage="Customer Assist" mainpage="Customer Assist"  activepage="We Care" />

            {caseData && <FormSection data={caseData} isEdit={true} />}
        </>
    )
}
export default CustomerAssistEdit