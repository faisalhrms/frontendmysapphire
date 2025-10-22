import api from '@config/axiosConfig.js'
const ROOT = '/customer-hub'

export const getThreadsPage = async (mailbox, skip = 0, limit = 20, s = '') => {
  const params = { skip, limit }
  if (mailbox) params.mailbox = mailbox
  if (s) params.s = s
  const res = await api.get(`${ROOT}/threads`, { params })
  const data = res.data?.data || res.data || {}
  const rows = data.rows || []
  const current_page = data.current_page ?? (limit ? skip / limit + 1 : 1)
  const total_pages = data.total_pages ?? 1
  return { rows, current_page, total_pages }
}

export const getThreadMessages = async (threadKey, mailbox) => {
  const res = await api.get(`${ROOT}/threads/${encodeURIComponent(threadKey)}`, { params: mailbox ? { mailbox } : {} })
  return Array.isArray(res.data) ? res.data : (res.data?.data ?? [])
}

export const getExtractionsByEmail = async (emailId, mailbox) => {
  const params = { ...(mailbox ? { mailbox } : {}), ...(emailId ? { email_id: emailId } : {}) }
  const res = await api.get(`${ROOT}/extractions`, { params })
  return Array.isArray(res.data) ? res.data : (res.data?.data ?? [])
}

export const markRead = async ({ threadKey, emailId, mailbox }) => {
  return api.post(`${ROOT}/mark-read`, { thread_key: threadKey || undefined, email_id: emailId || undefined, mailbox: mailbox || undefined })
}

export const getMailboxes = async () => {
  const res = await api.get(`/customer-hub/configs/datatable/`, { params: { skip: 0, limit: 100 } })
  const data = res.data?.data || res.data || {}
  const rows = data.rows || []
  return Array.from(new Set(rows.map(r => r.mailbox_email).filter(Boolean)))
}

export const matchCustomerItems = async ({ quality_code, design, color, width }) => {
  const params = {}
  if (quality_code) params.quality_code = quality_code
  if (design) params.design = design
  if (color) params.color = color
  if (width) params.width = width
  const res = await api.get(`${ROOT}/customer-items/match/`, { params })
  return Array.isArray(res.data) ? res.data : (res.data?.data ?? [])
}

export const saveAirjetCosting = async (payload) => {
  const res = await api.post(`${ROOT}/airjet-costings/`, payload)
  return res.data?.data || res.data
}
