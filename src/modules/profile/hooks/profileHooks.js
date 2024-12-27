import {useNavigate} from "react-router-dom";
import {updateUserProfile} from "@modules/profile/services/userProfileService.js";


export const useProfileForm = (userData) => {

    const navigate = useNavigate();

    const handleProfileUpdate = async (data) => {
        try {

            if (userData) {
                await updateUserProfile(data);
            }
            // navigate('/module/users');  // Redirect after successful submission
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return { handleProfileUpdate };
};
