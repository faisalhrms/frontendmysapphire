// useUserManagement.js
import { useState, useEffect } from 'react';
import {getUsers, createUser, updateUser, getUserManagementById} from "@modules/user/services/userManagementService.js";
import {useNavigate} from "react-router-dom";

export const useUserManagementForm = (userData, isEditMode) => {
    const navigate = useNavigate();

    const handleUserManagementSubmit = async (data) => {
        try {
            let response;
            if (isEditMode) {
                response = await updateUser(userData.id, data);
                navigate("/module/user-management/list");
            } else {
                response = await createUser(data);
                navigate("/module/user-management/list");
            }

            // Navigate to the user list page after successful submission
            if (response?.status === 200 || response?.status === 201) {
                navigate("/module/user-management/list");
            } else {
                console.error('Failed to save or update user:', response?.message);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return { handleUserManagementSubmit };
};


export const useUserManagement = (id) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserManagementById(id);
                setUserData(data);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchUserData();
    }, [id]);

    return { userData };
};
