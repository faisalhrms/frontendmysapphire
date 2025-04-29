// src/modules/email/services/sendEmailService.js
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

/**
 * Send an email with given data
 * @param {{ date: string, type: string }} emailData
 * @returns {Promise<any>}
 */
export const sendEmail = async (emailData) => {
    try {
        const response = await api.post("/emails/send/", emailData);
        Notify.success(response.data.message || "Email sent successfully.");
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to send email.");
        throw error;
    }
};
