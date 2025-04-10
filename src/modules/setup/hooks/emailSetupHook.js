import { useNavigate } from "react-router-dom";
import { createEmailSetup, updateEmailSetup ,getEmailSetupById } from "@modules/setup/services/emailSetupService.js";
import {SETUP_ROUTES} from "@modules/setup/routes.js";
import {useEffect, useState} from "react";

export const useEmailSetupForm = (emailSetupData, isEditMode) => {
    const navigate = useNavigate();

    const handleEmailSetupSubmit = async (data) => {
        try {
            let response;
            if (isEditMode) {
                response = await updateEmailSetup(emailSetupData.id, data);
            } else {
                response = await createEmailSetup(data);
            }

            if (response?.status === 200 || response?.status === 201) {
                navigate(SETUP_ROUTES.EMAIL.READ.path);
            } else {
                console.error("Failed to save or update email setup:", response?.message);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    return { handleEmailSetupSubmit };
};

export const useEmailSetup = (id) => {
    const [emailSetupData, setEmailSetupData] = useState(null);

    useEffect(() => {
        const fetchEmailSetup = async () => {
            try {
                const data = await getEmailSetupById(id);
                setEmailSetupData(data);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchEmailSetup();
    }, [id]);

    return { emailSetupData };
};