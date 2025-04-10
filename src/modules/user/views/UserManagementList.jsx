// UserManagementList.jsx
import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import UserManagementTable from "@modules/user/components/UserManagementTable.jsx"; // Importing UserManagementTable
import { useUserManagementList } from "@modules/user/hooks/userManagementHooks.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx"; // Importing hook

const UserManagementList = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const statusFilter = params.get("status") || ""; // Example of using search parameters for filters

    const { users, loading, error } = useUserManagementList(1, 10, statusFilter); // Fetching users with status filter

    if (loading) {
        return <LoadingSpinner/>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div className="p-3">
                <div className="box">
                    <div className="box-header sm:flex block !justify-start dark:bg-bodybg bg-white">
                        <div className="box-title ">User Management</div>
                        <UserManagementTable users={users}/> {/* Passing the users to the UserManagementTable */}
                    </div>
                </div>
            </div>
                    </>
                    );
                    };

                    export default UserManagementList;
