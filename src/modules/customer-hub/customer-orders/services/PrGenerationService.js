import api from "@config/axiosConfig.js"
import Notify from "@helpers/toastNotifications.js"

const ROOT = "/customer-hub"

const serverMessage = (error, fallback) =>
  error?.response?.data?.errors ||
  error?.response?.data?.message ||
  fallback

export const getPrGenerationBase = async (params, opts = {}) => {
  try {
    const res = await api.get(`${ROOT}/pr-generation/base/`, {
      params,
      signal: opts.signal,
    })
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to load PR generation"))
    throw error
  }
}

export const upsertPrGeneration = async ({ keys, patch }, opts = {}) => {
  try {
    const res = await api.post(
      `${ROOT}/pr-generation/base/upsert/`,
      { keys, patch },
      { signal: opts.signal },
    )
    Notify.success("PR generation saved")
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to save PR generation"))
    throw error
  }
}
