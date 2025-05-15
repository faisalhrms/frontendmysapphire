import {useParams,useLocation } from "react-router-dom";
import {useUser} from "@modules/user/hooks/userHooks.js";
import {useUserManagement} from "@modules/user/hooks/userManagementHooks.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import React from "react";
import UserManagementForm from "@modules/user/components/UserManagementForm.jsx";

const UserManagementEdit = () => {
    const { id } = useParams();
    const location = useLocation();
    const {userData} = useUserManagement(id);
    const fromApproval = Boolean(location.state?.fromApprovalList);
    console.log(fromApproval)
    return (
        <>
            <PageHeader currentpage={`Edit User`} activepage="Users" mainpage="Edit User"/>
                <UserManagementForm userData={userData} isEditMode={true}  fromApproval={fromApproval}/>
        </>
    )
}
export default UserManagementEdit