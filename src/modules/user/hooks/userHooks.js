import {useNavigate} from "react-router-dom";
import {createUser, getUserById, updateUser} from "@modules/user/services/userService.js";
import {useEffect, useState} from "react";

export const useUserForm = (userData) => {

    const navigate = useNavigate();

    const handleUserSubmit = async (data) => {

        try {
            if (userData) {
                await updateUser(userData.id, data);
            } else {
                await createUser(data);
            }
            navigate('/module/users');
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return { handleUserSubmit };
};

export const useUser = (id) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserById(id);
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchUser();
    }, [id]);

    return { userData };
}