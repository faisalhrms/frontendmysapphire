// src/modules/policies/services/policyService.js
import api from "@config/axiosConfig.js";
import Notify from '@helpers/toastNotifications.js';
import CryptoJS from "crypto-js";



const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_SECRET;
const key = CryptoJS.enc.Hex.parse(SECRET_KEY);  // Must be 32 chars (256 bits)

export const createPolicy = async (payload) => {
    try {
        const response = await api.post('/policies/', payload);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Error creating policy');
        throw error;
    }
};

export const getPolicyById = async (id) => {
    try {
        const response = await api.get(`/policies/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Error fetching policy');
        throw error;
    }
};

export const updatePolicy = async (id, payload) => {
    try {
        const response = await api.put(`/policies/${id}/`, payload);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Error updating policy');
        throw error;
    }
};

export const fetchSelfPolicies = async () => {
    try {
        const response = await api.get("/policies/ess/datatable/");
        console.log("Encrypted API response:", response.data);

        const encrypted = response.data?.data;
        if (!encrypted) throw new Error("No encrypted data found in response.");

        const bytes = CryptoJS.AES.decrypt(encrypted, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedText) throw new Error("Decryption failed — bad key or format.");

        const decryptedData = JSON.parse(decryptedText);
        return decryptedData;

    } catch (error) {
        console.error("Decryption failed:", error);
        Notify.error("Failed to load policies");
        return [];
    }
};