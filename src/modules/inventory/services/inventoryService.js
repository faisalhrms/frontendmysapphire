import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

// Equipment statuses (similar to projectStatuses in the project service)
export const equipmentStatuses = [
    { value: 'no_status', label: 'N/A' },
    { value: 'brand_new', label: 'Brand New' },
    { value: 'faulty', label: 'Faulty' },
    { value: 'functional', label: 'Functional' },
    { value: 'lost', label: 'Lost' },
    { value: 'sold_to_employee', label: 'Sold To Employee' },
    { value: 'write-off', label: 'Write Off' },
    { value: 'temporary_allocation', label: 'Temporary Allocation' },
];

// Create a new equipment
export const createEquipment = async (equipmentData) => {
    try {
        const response = await api.post('/equipments/', equipmentData);

        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

// Update an existing equipment
export const updateEquipment = async (id, equipmentData) => {
    try {
        const response = await api.put(`/equipments/${id}/`, equipmentData);

        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

// Fetch a list of equipments with pagination and optional search
export const getEquipments = async (page, size, s) => {
    try {
        const response = await api.get(`/equipments/datatable/`, {
            params: { skip: (page - 1) * size, limit: size, s },
        });
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

// Get equipment details by its ID
export const getEquipmentById = async (id) => {
    try {
        const response = await api.get(`/equipments/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

// Toggle favourite status for an equipment
export const toggleFavouriteEquipment = async (id, is_favourite) => {
    try {
        const response = await api.post(`/equipments/${id}/toggle-favourite/`, { is_favourite });
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const reAssignEquipment = async (payload) => {
    try {
        // Assuming your endpoint is POST /equipment-transactions/
        // If it's different (e.g. POST /equipment-transactions/create/), adjust accordingly.
        const response = await api.post("/equipment-transactions/", payload);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Error reassigning equipment.");
        throw error;
    }
};