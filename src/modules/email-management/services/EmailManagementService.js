
// In employeeDetailService.js
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const emailApprovalTypes = [
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'pending', label: 'Pending' },
    // Add more as needed
];


export const updateEmployeeApprovalStatus = async (id, newStatus) => {
    try {
        const response = await api.put(`/employee-details/${id}/approval/`, { approval_status: newStatus });
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to update approval status");
    }
};

export const updateApprovalStatus = async (approvalId, approval_status) => {
    try {
        const response = await api.post(`/employee-details/${approvalId}/update-status/`, { approval_status });
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
        throw Error(error.response?.data?.message || 'An error occurred');
    }
};