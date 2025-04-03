import {useQuery} from "@tanstack/react-query";
import {fetch404ErrorDetails} from "../services/Analysis_services.jsx";

export const useEcom404Error = (date) => {
    const { data = {}, isLoading } = useQuery({
        queryKey: ['useEcom404Error', date],
        queryFn: () => fetch404ErrorDetails(date),
        enabled: !!date,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    return { data, isLoading };
}