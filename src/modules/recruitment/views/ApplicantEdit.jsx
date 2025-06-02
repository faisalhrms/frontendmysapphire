import {useParams} from "react-router-dom";
import {useApplicant} from "@modules/recruitment/hooks/recruitmentHooks.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import React from "react";
import ApplicantForm from "@modules/recruitment/components/ApplicantForm.jsx";

const ApplicantEdit = () => {
    const { id } = useParams();
    const {applicantData}=useApplicant(id)

    return (
        <>
            <PageHeader currentpage='Edit Applicant' activepage="Recruitment" mainpage="Edit Applicant"/>
            {
                applicantData&&(
                    <ApplicantForm applicantData={applicantData} isEditMode={true}/>
                )
            }

        </>
    )
}
export default ApplicantEdit