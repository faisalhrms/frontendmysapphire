import { useQuery } from "@tanstack/react-query";
import {
    fetchExecutiveSummary,
    fetchPendingOrders,
    fetchPendingOrdersLib,
    fetchSalesforceData
} from "../services/saleapi_service.js";


export const useExecutiveSummary = (filters) => {
    const { data = {}, isLoading } =  useQuery({
        queryKey: ['executiveSummary'],
        queryFn: ()=>fetchExecutiveSummary(filters),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
    return { data, isLoading };
};


export const usePendingOrders = () => {
    return useQuery({
        queryKey: ['pendingOrders'],
        queryFn: fetchPendingOrders,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
};


export const usePendingOrdersLib = () => {
    return useQuery({
        queryKey: ['pendingOrdersLib'],
        queryFn: fetchPendingOrdersLib,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
};


// export const useSalesforceData = (dateFrom, dateTo, filters = {}, p_type) => {
//     return useQuery({
//         queryKey: ['salesforceData', dateFrom, dateTo, filters, p_type],
//         queryFn: () => fetchSalesforceData(dateFrom, dateTo, filters, p_type),
//         enabled: !!dateFrom && !!dateTo,
//         keepPreviousData: true,
//         refetchOnWindowFocus: false,
//     });
// };
export const useSalesforceData = (dateFrom, dateTo, filters = {}, p_type) => {
    return useQuery({
        queryKey: ['salesforceData', dateFrom, dateTo, filters, p_type],
        queryFn: () => fetchSalesforceData(dateFrom, dateTo, filters, p_type),
        enabled: !!dateFrom && !!dateTo && !!p_type, // Prevent unnecessary calls
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
};