import api from "@config/axiosConfig.js"

const ROOT = "/customer-hub/num-width-rules"

export const resolveNumWidthPanels = async ({ loom_band, loom_type, width_in }) => {
  const res = await api.get(`${ROOT}/resolve/`, {
    params: { loom_band, loom_type, width_in },
  })
  return res.data?.data || res.data
}

export const listNumWidthRules = async () => {
  try {
    const res = await api.get(`${ROOT}/`)
    const data = res.data?.data || res.data
    return Array.isArray(data) ? data : data?.rows || []
  } catch {
    const res = await api.get(`${ROOT}/datatable/`, { params: { skip: 0, limit: 100 } })
    const d = res.data?.data || res.data || {}
    return d.rows || []
  }
}

export const createNumWidthRule = async (payload) => {
  const res = await api.post(`${ROOT}/`, payload)
  return res.data?.data || res.data
}

export const updateNumWidthRule = async (id, payload) => {
  const res = await api.put(`${ROOT}/${id}/`, payload)
  return res.data?.data || res.data
}

export const deleteNumWidthRule = async (id) => {
  await api.delete(`${ROOT}/${id}/`)
  return true
}

export const bulkSaveNumWidthRules = async ({ wider_panels, narrow_rows }) => {
  const res = await api.post(`${ROOT}/num-width-rules/bulk-save/`, {
    wider_panels,
    narrow_rows,
  })
  return res.data?.data || res.data
}