// UserManagementList.jsx
import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import UserManagementTable from "@modules/user/components/UserManagementTable.jsx"; // Importing UserManagementTable
import { useUserManagementList } from "@modules/user/hooks/userManagementHooks.js"; // Importing hook

const UserManagementList = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const statusFilter = params.get("status") || ""; // Example of using search parameters for filters

    const { users, loading, error } = useUserManagementList(1, 10, statusFilter); // Fetching users with status filter

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <PageHeader currentpage="User Management" mainpage="User Management" />
            <UserManagementTable users={users} /> {/* Passing the users to the UserManagementTable */}
        </>
    );
};

export default UserManagementList;
