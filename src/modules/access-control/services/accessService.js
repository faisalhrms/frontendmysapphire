import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

// Create role API call
export const createRole = async (roleData) => {
    try {
        const response = await api.post('/roles', roleData);
        Notify.success('Role created successfully!')
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Failed to create role')
    }
};
// Update role API call
export const updateRole = async ({id, roleData}) => {
    try {
        const response = await api.put(`/roles/${id}`, roleData);
        Notify.success('Role Updated successfully!')
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Failed to update role')
    }
};
// Create permission API call
export const createPermission = async (permissionData) => {
    try {
        const response = await api.post('/permissions/', permissionData);
        Notify.success('Permission Created Successfully!')
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Failed to Create Permission')
    }
};
// Update permission API call
export const updatePermission = async ({id, permissionData}) => {
    try {
        const response = await api.put(`/permissions/${id}`, permissionData);
        Notify.success('Permission Updated successfully!')
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Failed to update Permission')
    }
};
// Fetch all permissions
export const getPermissions = async () => {
    try {
        const response = await api.get('/permissions');
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Failed to fetch permissions')
    }
};
// Fetch assigned permissions for a role
export const getAssignedPermissions = async (roleId) => {
    try {
        const response = await api.get(`/roles/${roleId}/permissions`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Failed to fetch assigned permissions')
    }
};
// Save permissions for a specific role
export const AssignPermissionsToRole = async (roleId, permissionIds) => {
    try {
        const response = await api.post(`/roles/${roleId}/permissions`, {permission_ids: permissionIds});
        Notify.success('Permission assigned to role successfully!')
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Failed to assign permission to role')
    }
};
