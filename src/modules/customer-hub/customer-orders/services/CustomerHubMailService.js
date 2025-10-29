import api from "@config/axiosConfig.js"
import Notify from "@helpers/toastNotifications.js"
const ROOT = "/customer-hub"

const serverMessage = (error, fallback) =>
  error?.response?.data?.errors ||
  error?.response?.data?.message ||
  fallback

export const getThreadsPage = async (mailbox, skip = 0, limit = 20, s = "", opts = {}) => {
  try {
    const params = { skip, limit }
    if (mailbox) params.mailbox = mailbox
    if (s) params.s = s
    const res = await api.get(`${ROOT}/threads`, { params, signal: opts.signal })
    const data = res.data?.data || res.data || {}
    const rows = data.rows || []
    const current_page = data.current_page ?? (limit ? skip / limit + 1 : 1)
    const total_pages = data.total_pages ?? 1
    return { rows, current_page, total_pages }
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to load threads"))
    throw error
  }
}

export const getThreadMessages = async (threadKey, mailbox, opts = {}) => {
  try {
    const params = mailbox ? { mailbox } : {}
    const res = await api.get(`${ROOT}/threads/${encodeURIComponent(threadKey)}`, { params, signal: opts.signal })
    return Array.isArray(res.data) ? res.data : res.data?.data ?? []
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to load messages"))
    throw error
  }
}

export const getExtractionsByEmail = async (emailId, mailbox, opts = {}) => {
  try {
    const params = {}
    if (mailbox) params.mailbox = mailbox
    if (emailId) params.email_id = emailId
    const res = await api.get(`${ROOT}/extractions`, { params, signal: opts.signal })
    return Array.isArray(res.data) ? res.data : res.data?.data ?? []
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to load extractions"))
    throw error
  }
}

export const markRead = async ({ threadKey, emailId, mailbox }, opts = {}) => {
  try {
    const body = {
      thread_key: threadKey || undefined,
      email_id: emailId || undefined,
      mailbox: mailbox || undefined,
    }
    const res = await api.post(`${ROOT}/mark-read`, body, { signal: opts.signal })
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to mark as read"))
    throw error
  }
}

export const getMailboxes = async (opts = {}) => {
  try {
    const res = await api.get(`/customer-hub/configs/datatable/`, { params: { skip: 0, limit: 100 }, signal: opts.signal })
    const data = res.data?.data || res.data || {}
    const rows = data.rows || []
    return Array.from(new Set(rows.map((r) => r.mailbox_email).filter(Boolean)))
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to load mailboxes"))
    throw error
  }
}

export const matchCustomerItems = async ({ quality_code, design, color, width }, opts = {}) => {
  try {
    const params = {}
    if (quality_code) params.quality_code = quality_code
    if (design) params.design = design
    if (color) params.color = color
    if (width) params.width = width
    const res = await api.get(`${ROOT}/customer-items/match/`, { params, signal: opts.signal })
    return Array.isArray(res.data) ? res.data : res.data?.data ?? []
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to match items"))
    throw error
  }
}

const clean = (o) => Object.fromEntries(Object.entries(o || {}).filter(([_, v]) => v !== undefined && v !== null && v !== ""))
const coerceIds = (o) => {
  const x = { ...o }
  if (x.email_id !== undefined && x.email_id !== null && x.email_id !== "") x.email_id = Number(x.email_id)
  if (x.agreement_id !== undefined && x.agreement_id !== null && x.agreement_id !== "") x.agreement_id = Number(x.agreement_id)
  return clean(x)
}
const cleanQuery = (o = {}) => coerceIds(clean(o))

const inflightBase = new Map()
const inflightBaseData = new Map()
const dedupeGet = async (map, url, params, opts = {}) => {
  const k = JSON.stringify(params || {})
  if (map.has(k)) return map.get(k)
  const p = api.get(url, { params, signal: opts.signal }).then(r => r.data?.data ?? r.data ?? null).finally(() => map.delete(k))
  map.set(k, p)
  return p
}

export const getAirjetCostingBaseSaved = async (params = {}, opts = {}) => {
  try {
    const p = cleanQuery(params)
    return await dedupeGet(inflightBase, `${ROOT}/airjet-costing/base/`, p, opts)
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to load saved costing"))
    throw error
  }
}

export const getAirjetCostingBaseComputed = async (params = {}, opts = {}) => {
  try {
    const p = cleanQuery(params)
    return await dedupeGet(inflightBaseData, `${ROOT}/airjet-costing/base-data/`, p, opts)
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to compute costing base"))
    throw error
  }
}

export const getAirjetCostingBasePreferSaved = async (params = {}, opts = {}) => {
  const p = cleanQuery(params)
  const saved = await getAirjetCostingBaseSaved(p, opts)
  if (saved) return saved
  return await getAirjetCostingBaseComputed(p, opts)
}

export const upsertAirjetCostingBase = async (keys, patch, opts = {}) => {
  try {
    const payload = { keys: coerceIds(keys), patch: { ...clean(patch), payload: clean(patch) } }
    const res = await api.post(`${ROOT}/airjet-costing/base/upsert/`, payload, { signal: opts.signal })
    Notify.success("Costing saved")
    return res.data?.data ?? res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to save costing"))
    throw error
  }
}
