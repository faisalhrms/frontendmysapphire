import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import UserForm from "@modules/user/components/UserForm.jsx";
import { useUser } from "@modules/user/hooks/userHooks.js";
import InfoAlert from "../../../InfoAlert.jsx"; // adjust import path as needed

const UserEdit = () => {
    const { id } = useParams();
    const { userData } = useUser(id);

    const showInfoAlert = userData && userData.is_active === false && userData.attempts === 4;

    return (
        <>
            <PageHeader currentpage="Edit User" activepage="Users" mainpage="Edit User" />

            {showInfoAlert && (
                <InfoAlert description="This user is inactive and has reached the maximum number of login attempts." />
            )}

            {userData && (
                <UserForm userData={userData} />
            )}
        </>
    );
};

export default UserEdit;
