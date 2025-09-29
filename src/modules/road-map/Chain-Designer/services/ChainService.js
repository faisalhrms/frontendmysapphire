import api from "@config/axiosConfig.js"
import Notify from "@helpers/toastNotifications.js"
import {downloadFile} from "@modules/beirholm-bi/services/DataSanitizeService.js"

export const createChain = async (chainData) => {
  try {
    const response = await api.post("chain/", chainData)
    Notify.success("Successfully Created!")
    return response.data
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create chain")
    throw error
  }
}

export const getChainById = async (id) => {
  try {
    const response = await api.get(`chain/${id}/`)
    return response?.data
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch chain details")
    throw error
  }
}

export const updateChain = async (id, chainData) => {
  try {
    const response = await api.put(`chain/${id}/`, chainData)
    Notify.success("Updated Successfully!")
    return response.data
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update chain")
    throw error
  }
}

export const deleteChain = async (id) => {
  try {
    const response = await api.delete(`chain/${id}/`)
    Notify.success("Delete Successfully!")
    return response.data
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to Delete chain")
    throw error
  }
}

export const downloadChainSample = async (business_unit) => {
  const url = `/chain/download-sample-file/?business_unit=${encodeURIComponent(business_unit)}`
  await downloadFile(url, `chain_mapping_template_${business_unit}.xlsx`)
}

export const downloadSupplyChain = async (business_unit) => {
  const url = `/chain/download-supplychain/?business_unit=${encodeURIComponent(business_unit)}`
  await downloadFile(url, `SupplyChain_${business_unit}.xlsx`)
}

export const uploadChainBulkFD = async (formData) => {
  try {
    const res = await api.post("chain/bulk-upload/", formData)
    const {created, updated, warnings} = res.data?.data || {}
    if (created || updated) Notify.success(`Created: ${created || 0}, Updated: ${updated || 0}`)
    if (warnings && warnings.length) Notify.info(warnings.join("\n"))
    return res.data
  } catch (error) {
    Notify.error(error.response?.data?.message || "Bulk upload failed")
    throw error
  }
}
