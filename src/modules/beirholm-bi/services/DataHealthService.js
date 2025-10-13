import api from "@config/axiosConfig.js"
import Notify from "@helpers/toastNotifications.js"

export const rulesDatatable = async ({ skip=0, limit=50, s="", headerId=null }={}) => {
  const res = await api.get("beirholm-bi/health/rules/datatable/", { params: { skip, limit, s, header_id: headerId } })
  return res.data?.data || res.data
}

export const getHeaderRules = async (headerId) => {
  const res = await api.get("beirholm-bi/health/header-rules/", { params: { header_id: headerId } })
  return res.data?.data || res.data
}

export const saveHeaderRules = async ({ header_id, rules }) => {
  const res = await api.post("beirholm-bi/health/header-rules/save/", { header: header_id, rules })
  Notify.success("Saved")
  return res.data?.data || res.data
}

export const deleteRule = async (ruleId) => {
  const res = await api.delete(`beirholm-bi/health/rules/${ruleId}/`)
  Notify.success("Rule deleted")
  return res.data?.data || res.data
}

export const runDataHealth = async (filters) => {
  const res = await api.post("beirholm-bi/health/run/", filters || {})
  Notify.success("Data health executed")
  return res.data?.data || res.data
}
