import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import React from "react";
import {useParams} from "react-router-dom";
import {useEmailSetup} from "@modules/setup/hooks/emailSetupHook.js";
import EmailSetupForm from "@modules/setup/components/EmailSetupForm.jsx";

const EmailSetupEdit = () => {
    const {id} = useParams();
    const {emailSetupData}=useEmailSetup(id)
    return (
        <>
            <PageHeader currentpage='Edit Email Setup' activepage="Email Setup" mainpage="Edit Email Setup"/>
            {
                emailSetupData&&(
                    <EmailSetupForm emailSetupData={emailSetupData} isEditMode={true} />
                )
            }
        </>
    )
}
export default EmailSetupEdit