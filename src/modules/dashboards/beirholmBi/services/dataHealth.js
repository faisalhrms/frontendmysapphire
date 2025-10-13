import api from "@config/axiosConfig.js"
import Notify from "@helpers/toastNotifications.js"

const dataHealth = {
  get(filters = {}) {
    return api
      .get("/dashboard/data-health/", { params: filters })
      .then(res => res.data)
      .catch(error => {
        const msg = error.response?.data?.message || error.message
        Notify.error(`Unable to load data health: ${msg}`)
        throw error
      })
  }
}

export default dataHealth
