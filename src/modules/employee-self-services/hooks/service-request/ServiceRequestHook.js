import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    createServiceRequest, getServiceRequest, saveServiceRequest, getServiceRequestById, submitServiceRequest

} from "@modules/employee-self-services/services/service-request/ServiceRequestServices.js";
import Notify from "@helpers/toastNotifications.js";

export const useServiceRequestForm = (serviceData, isEditMode) => {
    const navigate = useNavigate();

    const saveAsDraft = async (data) => {
        try {
            let response;
            if (isEditMode && serviceData?.id) {
                response = await saveServiceRequest(serviceData.id, {...data, is_submitted: false});
                navigate('/module/ess/services-request'); // Redirect after successful submission

            } else {
                response = await createServiceRequest(data);
                navigate('/module/ess/services-request'); // Redirect after successful submission

            }
            return response;
        } catch (error) {
            console.error("Error saving as draft:", error.message);
            throw error;
        }
    };

    const submitRequest = async (id, data) => {
        try {
            let response;
            if (id) {
                response = await saveServiceRequest(id, data);
            } else {
                response = await createServiceRequest(data);
            }
            navigate('/module/ess/services-request'); // Redirect after successful submission
            return response;
        } catch (error) {
            console.error("Error submitting request:", error.message);
            throw error;
        }
    };

    const submitFeedback = async (id, feedbackData) => {
        try {
            if (id) {
                await saveServiceRequest(id, feedbackData);
            } else {
                Notify.error(
                    "Service Request ID is missing.")
            }
        } catch (error) {
            console.error("Error submitting feedback:", error.message);
            alert("Failed to submit feedback.");
        }
    };

    return {saveAsDraft, submitRequest, submitFeedback};
};

export const useServiceRequest = (id) => {
    const [serviceData, setServiceData] = useState(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await getServiceRequestById(id);
                setServiceData(data);
            } catch (error) {
                console.error("Error fetching Service data:", error.message);
            }
        };

        fetchService();
    }, [id]);

    return {serviceData};
};