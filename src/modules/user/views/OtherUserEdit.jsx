// @modules/user/pages/OtherUserEdit.jsx
import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import {useOtherUser} from "@modules/user/hooks/userHooks.js";
import OtherUserForm from "@modules/user/components/OtherUserForm.jsx";

const OtherUserEdit = () => {
    const { id } = useParams();
    const { userData } = useOtherUser(id);

    return (
        <>
            <PageHeader
                currentpage="Edit User"
                activepage="Other Users"
                mainpage="Edit User"
            />
            {userData && (
                <OtherUserForm userData={userData} />
            )}
        </>
    );
};

export default OtherUserEdit;
