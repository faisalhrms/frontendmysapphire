import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

const exportData = {
  get(filters) {
    const modifiedFilters = { ...filters };
    if (Array.isArray(filters.date)) {
      modifiedFilters.date = filters.date.map(d => d.value);
    }

    return api
      .get("/dashboard/export-data/", { params: modifiedFilters })
      .then(res => res.data)
      .catch(error => {
        const msg = error.response?.data?.message || error.message;
        Notify.error(`Unable to load export data: ${msg}`);
        throw error;
      });
  }
};

export default exportData;
