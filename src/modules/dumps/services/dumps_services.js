import api from "@config/axiosConfig.js";

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

export const downloadOrderSummaryExcel = async ({ startDate, endDate }) => {
  const { data } = await api.get("/dumps/oms/fetch_order_summary_data/", {
    params: { date_from: startDate, date_to: endDate },
    responseType: "blob"
  });
  return data;
};

export const downloadWmsExcel = async ({ startDate, endDate }) => {
  const { data } = await api.get("/dumps/oms/fetch_wms_data/", {
    params: { date_from: startDate, date_to: endDate },
    responseType: "blob"
  });
  return data;
};
