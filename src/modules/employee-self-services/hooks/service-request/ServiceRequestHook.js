import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    createServiceRequest, getServiceRequest, saveServiceRequest, getServiceRequestById, submitServiceRequest

} from "@modules/employee-self-services/services/service-request/ServiceRequestServices.js";

export const useServiceRequestForm = (serviceData, isEditMode) => {
    const navigate = useNavigate();

    const saveAsDraft = async (data) => {
        console.log(`this is data in handleSaveDraft`, data);
        try {
            let response;
            if (isEditMode && serviceData?.id) {
                response = await saveServiceRequest(serviceData.id, { ...data, is_submitted: false });
                navigate('/module/ess/services-request'); // Redirect after successful submission

            } else {
console.log(`this is data`,data)
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
                // Update existing service request
                response = await saveServiceRequest(id, data);
            } else {
                // Create new service request
                response = await createServiceRequest(data);
            }
            navigate('/module/ess/services-request'); // Redirect after successful submission
            return response;
        } catch (error) {
            console.error("Error submitting request:", error.message);
            throw error;
        }
    };
    return { saveAsDraft, submitRequest };
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

    return { serviceData };
};