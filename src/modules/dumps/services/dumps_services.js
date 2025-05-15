import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const fetchOciDumps = async (date) => {
    try {
        const response = await api.get("/dumps/oci/", {
            params: {
                date: date,
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching OCI dumps:", error);
        throw error;
    }
};

const handleError = async (error, message) => {
  if (error?.response?.data instanceof Blob) {
    try {
      const text = await error.response.data.text();
      const json = JSON.parse(text);
      Notify.error(json?.detail || json?.errors || message);
      return;
    } catch {}
  }
  Notify.error(message);
};

const downloadExcel = async (url, { startDate, endDate }, message) => {
  try {
    const { data } = await api.get(url, {
      params: { date_from: startDate, date_to: endDate },
      responseType: "blob"
    });
    return data;
  } catch (error) {
    await handleError(error, message);
  }
};

export const downloadOrderSummaryExcel = payload =>
  downloadExcel("/dumps/oms/fetch_order_summary_data/", payload, "Failed to download Order Summary");

export const downloadReturnOrderExcel = payload =>
  downloadExcel("/dumps/oms/fetch_return_order_data/", payload, "Failed to download Return Order");

export const downloadWmsExcel = payload =>
  downloadExcel("/dumps/oms/fetch_wms_data/", payload, "Failed to download WMS");
