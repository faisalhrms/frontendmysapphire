import {useNavigate} from "react-router-dom";
import {createSubscription, getSubscriptionById, updateSubscription} from "../services/subscriptionService.js";
import {useEffect, useState} from "react";

export const useSubscriptionForm = (subscriptionData, isEditMode = false) => {
    const navigate = useNavigate();

    const handleSubscriptionSubmit = async (data) => {
        try {
            if (isEditMode) {
                await updateSubscription(subscriptionData.id, data);
            } else {
                await createSubscription(data);
            }
            // navigate('/module/subscription');
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return {handleSubscriptionSubmit};
};


export  const useSubscription = (id) => {
    const [subscriptionData, setSubscriptionData] = useState(null);
    useEffect(() => {
        const fetchSubscription = async () => {
            try{
                const subscriptionData=await getSubscriptionById(id)
                setSubscriptionData(subscriptionData);
            }catch (error) {
                console.log(error.message);            }
        }
        fetchSubscription()
    },[id])
    return {subscriptionData};
}
