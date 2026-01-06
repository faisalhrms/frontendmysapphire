import api from "@config/axiosConfig.js"

export async function createEmployeeChatSession() {
  const res = await api.post("/chatkit/employee/session/")
  return res.data
}

export async function hrRagAskTool(params = {}, { signal } = {}) {
  const res = await api.post("/chatkit/employee/rag/ask/", params, { signal })
  return res.data
}

export async function attendanceResolveTool(params = {}, { signal } = {}) {
  const res = await api.post("/chatkit/employee/attendance/resolve/", params, { signal })
  return res.data
}

export async function attendanceQueryTool(params = {}, { signal } = {}) {
  const res = await api.post("/chatkit/employee/attendance/query/", params, { signal })
  return res.data
}

export async function employeeSearchTool(params = {}, { signal } = {}) {
  const res = await api.post("/chatkit/employee/employee/search/", params, { signal })
  return res.data
}

export async function employeeGetTool(params = {}, { signal } = {}) {
  const res = await api.post("/chatkit/employee/employee/get/", params, { signal })
  return res.data
}

export async function employeeQueryTool(params = {}, { signal } = {}) {
  const res = await api.post("/chatkit/employee/employee/query/", params, { signal })
  return res.data
}
export async function chatkitWidgetActionTool(params = {}, { signal } = {}) {
  const res = await api.post("/chatkit/widget-action/", params, { signal })
  return res.data
}

export async function leaveBalanceResolveTool(params = {}, { signal } = {}) {
  const res = await api.post("/chatkit/employee/leave_balance/resolve/", params, { signal })
  return res.data
}

export async function leaveBalanceQueryTool(params = {}, { signal } = {}) {
  const res = await api.post("/chatkit/employee/leave_balance/query/", params, { signal })
  return res.data
}