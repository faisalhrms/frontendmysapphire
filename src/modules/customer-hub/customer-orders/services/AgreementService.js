import api from "@config/axiosConfig.js"
import Notify from "@helpers/toastNotifications.js"

const ROOT = "/customer-hub"


export const isBackendUnreachable = (error) => {
  if (!error) return false

  if (error.code === "ERR_NETWORK") return true
  if (!error.response && error.request) return true

  const st = error.response?.status
  return st === 502 || st === 503 || st === 504
}

export const backendUnreachableMessage = (error) => {
  const st = error?.response?.status
  if (st) return `Backend is unavailable (HTTP ${st}). Please try again.`
  return "Unable to reach backend server. Check network/VPN and try again."
}

const normalizeServerError = (error, fallback) => {
  const data = error?.response?.data
  if (!data) return fallback
  if (typeof data.message === "string" && data.message.trim()) return data.message

  const errs = data.errors
  if (!errs) return fallback

  if (typeof errs === "string") return errs
  if (Array.isArray(errs)) return errs.filter(Boolean).join("\n")

  if (errs && typeof errs === "object") {
    const lines = []
    for (const [field, msgs] of Object.entries(errs)) {
      if (Array.isArray(msgs)) msgs.forEach((m) => lines.push(`${field}: ${m}`))
      else if (typeof msgs === "string") lines.push(`${field}: ${msgs}`)
      else lines.push(`${field}: ${JSON.stringify(msgs)}`)
    }
    if (lines.length) return lines.join("\n")
  }

  return fallback
}

const serverMessage = (error, fallback) => {
  if (error?._userMessage) return error._userMessage
  if (isBackendUnreachable(error)) return backendUnreachableMessage(error)
  return normalizeServerError(error, fallback)
}



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
    const params = {}
    if (opts.showCancelled) {
      params.cancelled = "true"
    }
    const res = await api.get(`${ROOT}/agreements/${id}/`, {
      signal: opts.signal,
      params,
    })
    return res.data?.data || res.data
  } catch (error) {
    console.log(error?.code, error?.message, error?.response?.status, error?.response?.data)

    Notify.error(serverMessage(error, "Failed to load agreement"))
    throw error
  }
}

export const deleteAgreement = async (id, opts = {}) => {
  try {
    const res = await api.delete(`${ROOT}/agreements/${id}/`, { signal: opts.signal })
    Notify.success("Agreement Cancelled")
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to delete agreement"))
    throw error
  }
}

export const datatableAgreements = async (
  { skip = 0, limit = 10, s = "", mailbox = "" } = {},
  opts = {}
) => {
  try {
    const params = {
      skip: String(skip),
      limit: String(limit),
      ...(s ? { s } : {}),
      ...(mailbox ? { mailbox } : {}),
    }
    const res = await api.get(`${ROOT}/agreements/datatable/`, {
      params,
      signal: opts.signal,
    })
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to load agreements"))
    throw error
  }
}

export const datatableAgreementsSidebar = async (
  { skip = 0, limit = 10, s = "", mailbox = "" } = {},
  opts = {}
) => {
  const params = {
    skip: String(skip),
    limit: String(limit),
    ...(s ? { s } : {}),
    ...(mailbox ? { mailbox } : {}),
  }

  const res = await api.get(`${ROOT}/agreements/datatable-sidebar/`, {
    params,
    signal: opts.signal,
  })
  return res.data?.data || res.data
}


export const submitAgreement = async (
  id,
  submissionTypeOrOpts = "new",
  maybeOpts = {}
) => {
  try {
    let submissionType = "new"
    let opts = {}

    if (typeof submissionTypeOrOpts === "string") {
      submissionType = submissionTypeOrOpts || "new"
      opts = maybeOpts || {}
    } else {
      opts = submissionTypeOrOpts || {}
      submissionType = opts.submission_type || "new"
    }

    const payload = {}
    if (submissionType) {
      payload.submission_type = submissionType
    }

    if (opts.execution_type) {
      payload.execution_type = opts.execution_type
    }

    if (Array.isArray(opts.hierarchies) && opts.hierarchies.length > 0) {
      payload.hierarchies = opts.hierarchies
    }

    const res = await api.post(`${ROOT}/agreements/${id}/submit/`, payload, {
      signal: opts.signal,
    })

    const msg =
      submissionType && submissionType !== "new"
        ? "Revision submitted for approval"
        : "Submitted for approval"

    Notify.success(msg)
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to submit"))
    throw error
  }
}

export const uploadAgreementsExcel = async (file, opts = {}) => {
  try {
    const form = new FormData()
    form.append("file", file)
    const res = await api.post(`${ROOT}/agreements/upload-excel/`, form, {
      signal: opts.signal,
    })
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

// now supports pagination via skip/limit while staying backward-compatible
export const getApprovalActivity = async (id, opts = {}) => {
  const { skip = 0, limit = 20, signal } = opts
  try {
    const params = {
      skip: String(skip),
      limit: String(limit),
    }
    const res = await api.get(`${ROOT}/agreements/${id}/approval-activity/`, {
      params,
      signal,
    })
    return res.data?.data || res.data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to load approval activity"))
    throw error
  }
}

export const resetAgreementPayload = async (id, opts = {}) => {
  try {
    const res = await api.post(`${ROOT}/agreements/${id}/reset-payload/`, null, {
      signal: opts.signal,
    })
    const data = res.data?.data || res.data
    Notify.success("Agreement payload reset successfully")
    return data
  } catch (error) {
    Notify.error(serverMessage(error, "Failed to reset agreement payload"))
    throw error
  }
}

export const getAgreementMentionUsers = async (id, opts = {}) => {
  const params = {}
  if (opts.showCancelled) {
    params.cancelled = "true"
  }

  const res = await api.get(`${ROOT}/agreements/${id}/mention-users/`, {
    signal: opts.signal,
    params,
  })
  return res.data?.data || res.data
}

export const exportReadAgreementsExcel = ({ ids, s, cancelled = false } = {}) => {
  const params = new URLSearchParams();

  if (ids && ids.length) params.set("ids", ids.join(","));
  if (s) params.set("s", s);
  if (cancelled) params.set("cancelled", "true");

  const qs = params.toString();
  const url = qs
    ? `customer-hub/agreements/read-export/?${qs}`
    : `customer-hub/agreements/read-export/`;

  return api.get(url, { responseType: "blob" });
};
