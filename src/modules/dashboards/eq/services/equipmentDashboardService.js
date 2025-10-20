// @modules/dashboard/services/equipmentDashboardService.js
import api from "@config/axiosConfig.js";

// Base path — adjust if your router mounts differently
const BASE = "/dashboard/equipment";

// Each fn returns response.data.data (your ResponseMixin shape)

export const getSummary = (params) =>
    api.get(`${BASE}/summary/`, { params }).then(r => r.data.data);

export const getStatusStats = (params) =>
    api.get(`${BASE}/status-stats/`, { params }).then(r => r.data.data);

export const getTypeStats = (params) =>
    api.get(`${BASE}/type-stats/`, { params }).then(r => r.data.data);

export const getDepartmentStats = (params) =>
    api.get(`${BASE}/department-stats/`, { params }).then(r => r.data.data);

export const getSiteStats = (params) =>
    api.get(`${BASE}/site-stats/`, { params }).then(r => r.data.data);

export const getValueStats = (params) =>
    api.get(`${BASE}/value-stats/`, { params }).then(r => r.data.data);

export const getMonthlyAcquisition = (params) =>
    api.get(`${BASE}/monthly-acquisition/`, { params }).then(r => r.data.data);

export const getAgeBuckets = (params) =>
    api.get(`${BASE}/age-buckets/`, { params }).then(r => r.data.data);

export const getWarrantyExpiring = (params) =>
    api.get(`${BASE}/warranty-expiring/`, { params }).then(r => r.data.data);

export const getVerificationProgress = (params) =>
    api.get(`${BASE}/verifications/progress/`, { params }).then(r => r.data.data);

export const getRepairsSummary = (params) =>
    api.get(`${BASE}/repairs/summary/`, { params }).then(r => r.data.data);

export const getTopAssets = (params) =>
    api.get(`${BASE}/top-assets/`, { params }).then(r => r.data.data);

export const getReplacementsSummary = (params) =>
    api.get(`${BASE}/replacements/summary/`, { params }).then(r => r.data.data);
