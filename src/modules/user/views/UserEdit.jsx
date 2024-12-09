import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import UserForm from "@modules/user/components/UserForm.jsx";
import {useUser} from "@modules/user/hooks/userHooks.js";

const UserEdit = () => {
    const { id } = useParams();
    const {userData} = useUser(id);

    return (
        <>
            <PageHeader currentpage={`Edit ${userData?.full_name}`} activepage="Users" mainpage="Edit User"/>
            {userData && (
                <UserForm
                    userData={userData}
                />
            )}
        </>
    );
};

export default UserEdit;
