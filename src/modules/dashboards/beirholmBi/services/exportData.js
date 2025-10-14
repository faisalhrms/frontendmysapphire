import api from "@config/axiosConfig.js"
import Notify from "@helpers/toastNotifications.js"

const exportData = {
  get(filters = {}) {
    const modifiedFilters = { ...filters }
    if (Array.isArray(modifiedFilters.date)) modifiedFilters.date = modifiedFilters.date.map(d => d?.value ?? d)
    return api
      .get("/dashboard/export-data/", { params: modifiedFilters })
      .then(res => res.data)
      .catch(error => {
        const msg = error.response?.data?.message || error.message
        Notify.error(`Unable to load export data: ${msg}`)
        throw error
      })
  }
}

export default exportData
