import api from "@config/axiosConfig.js";


export const fetchStoreWiseSaleData = async (p_date, filters) => {
    try {
        const response = await api.get("/reporting/fetch_store_wise_sale_data/", {
            params: {
                p_date: p_date,
                ...filters
            }
        });

        return response.data?.data;
    } catch (error) {
        console.error("Error fetching executive summary:", error);
        throw error;
    }
};
export const fetchTargetSaleData = async (p_date, filters) => {
    try {
        const response = await api.get("/reporting/fetch_target_sale_data/", {
            params: {
                p_date: p_date,
                ...filters
            }
        });
        return response.data?.data;
    } catch (error) {
        console.error("Error fetching target sale data:", error);
        throw error;
    }
};


export const fetchGrossSaleBeforeReturnData = async (p_date, filters) => {
    try {
        const response = await api.get("/reporting/fetch_gross_sale_bf_return/", {
            params: {
                p_date: p_date,
                ...filters
            }
        });
        return response.data?.data;
    } catch (error) {
        console.error("Error fetching target sale data:", error);
        throw error;
    }
};
export const fetchSaleCvVsLyData = async (p_date, filters) => {
    try {
        const response = await api.get("/reporting/fetch_sale_cv_vs_ly_data/", {
            params: {
                p_date: p_date,
                ...filters
            }
        });
        return response.data?.data;
    } catch (error) {
        console.error("Error fetching sale CV vs LY data:", error);
        throw error;
    }
};
export const fetchSaleMtdLdDataLD = async (p_date, p_type = 'last_day') => {
    try {
        const response = await api.get("/reporting/fetch_sale_mtd_ld_data/", {
            params: {
                p_date: p_date,
                p_type: "last_day",
            }
        });
        return response.data?.data;
    } catch (error) {
        console.error("Error fetching sale MTD LD data:", error);
        throw error;
    }
};
export const fetchSaleMtdLdDataMT = async (p_date, p_type = 'MTD') => {
    try {
        const response = await api.get("/reporting/fetch_sale_mtd_ld_data/", {
            params: {
                p_date: p_date,
                p_type: "MTD",
            }
        });
        return response.data?.data;
    } catch (error) {
        console.error("Error fetching sale MTD LD data:", error);
        throw error;
    }
};

export const downloadDailySaleReport = async (filters) => {
    try {
        const response = await api.get("/reporting/download/daily-sale-report/", {
            params: {
                p_date: filters.date_from,
                ...filters
            },
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const downloadOfflineStorePerformance = async (filters) => {

    try {
        const response = await api.get("/reporting/download/offline-store-performance/", {
            params: {
                date: filters.date,

            },
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const downloadComparativeSaleReport = async (filters) => {

    try {
        const response = await api.get("/reporting/download/comparative-sales-report", {
            params: {
                date: filters.date,

            },
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}