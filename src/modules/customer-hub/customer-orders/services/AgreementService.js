import api from "@config/axiosConfig.js"
import Notify from "@helpers/toastNotifications.js";
const ROOT = "/customer-hub"

const serverMessage = (error, fallback) =>
  error?.response?.data?.errors ||
  error?.response?.data?.message ||
  fallback

export const createAgreement = async (payload, opts = {}) => {
  try {
    const res = await api.post(`${ROOT}/agreements/`, payload, { signal: opts.signal })
    Notify.success("Agreement saved")
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to save agreement"))
    throw error
  }
}

export const updateAgreement = async (id, payload, opts = {}) => {
  try {
    const res = await api.put(`${ROOT}/agreements/${id}/`, payload, { signal: opts.signal })
    Notify.success("Agreement updated")
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to update agreement"))
    throw error
  }
}

export const getAgreement = async (id, opts = {}) => {
  try {
    const res = await api.get(`${ROOT}/agreements/${id}/`, { signal: opts.signal })
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to load agreement"))
    throw error
  }
}

export const deleteAgreement = async (id, opts = {}) => {
  try {
    const res = await api.delete(`${ROOT}/agreements/${id}/`, { signal: opts.signal })
    Notify.success("Agreement deleted")
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to delete agreement"))
    throw error
  }
}

export const datatableAgreements = async ({ skip = 0, limit = 10, s = "" } = {}, opts = {}) => {
  try {
    const res = await api.get(`${ROOT}/agreements/datatable/`, {
      params: { skip: String(skip), limit: String(limit), ...(s ? { s } : {}) },
      signal: opts.signal,
    })
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to load agreements"))
    throw error
  }
}

export const submitAgreement = async (id, opts = {}) => {
  try {
    const res = await api.post(`${ROOT}/agreements/${id}/submit/`, {}, { signal: opts.signal })
    Notify.success("Agreement submitted")
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to submit agreement"))
    throw error
  }
}

export const approveAgreement = async (id, opts = {}) => {
  try {
    const res = await api.post(`${ROOT}/agreements/${id}/approve/`, {}, { signal: opts.signal })
    Notify.success("Agreement approved")
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to approve agreement"))
    throw error
  }
}

export const rejectAgreement = async (id, opts = {}) => {
  try {
    const res = await api.post(`${ROOT}/agreements/${id}/reject/`, {}, { signal: opts.signal })
    Notify.success("Agreement rejected")
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to reject agreement"))
    throw error
  }
}

export const uploadAgreementsExcel = async (file, opts = {}) => {
  try {
    const form = new FormData()
    form.append("file", file)
    const res = await api.post(`${ROOT}/agreements/upload-excel/`, form, { signal: opts.signal })
    Notify.success("File uploaded successfully")
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "File upload failed"))
    throw error
  }
}

export const findAgreementByEmail = async ({ email_id, agreement_no }, opts = {}) => {
  try {
    const res = await api.get(`${ROOT}/agreements/by-email/`, {
      params: { email_id, agreement_no },
      signal: opts.signal,
    })
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to find agreement"))
    throw error
  }
}
