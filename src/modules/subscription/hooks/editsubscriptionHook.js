import { useNavigate } from "react-router-dom";
import { updateSubscription } from "../services/subscriptionService.js";

export const useEditSubscription = (subscriptionData) => {
    const navigate = useNavigate();

    const handleEditSubmit = async (data) => {
        try {
            if (subscriptionData?.id) {
                await updateSubscription(subscriptionData.id, data);
                navigate('/module/subscription');
            } else {
                console.error('Error: No subscription ID provided');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return { handleEditSubmit };
};
