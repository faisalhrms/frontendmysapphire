import { useQuery } from "@tanstack/react-query";
import {
    getPendingList,
    getInProgressList,
    getCompletedList,
    getClosedList, getAssignedUnreadCounts
} from "@modules/employee-self-services/services/work-desk/workDeskServices.js";

export const usePending = (page, size, search) => {
    const query = useQuery({
        queryKey: ["pendingList", page, size, search],
        queryFn: () => getPendingList(page, size, search),
        keepPreviousData: true,
        staleTime: 0,
    });
    return { ...query, pendingData: query.data };
};

export const useInProgress = (page, size, search) => {
    const query = useQuery({
        queryKey: ["inProgressList", page, size, search],
        queryFn: () => getInProgressList(page, size, search),
        keepPreviousData: true,
        staleTime: 0,
    });
    return { ...query, inProgressData: query.data };
};

export const useCompleted = (page, size, search) => {
    const query = useQuery({
        queryKey: ["completedList", page, size, search],
        queryFn: () => getCompletedList(page, size, search),
        keepPreviousData: true,
        staleTime: 0,
    });
    return { ...query, completedData: query.data };
};

export const useClosed = (page, size, search) => {
  const query = useQuery({
    queryKey: ["closedList", page, size, search],
    queryFn: () => getClosedList(page, size, search),
    keepPreviousData: true,
    staleTime: 0,
  });
  return { ...query, closedData: query.data };
};

export const useUnreadAssignedCounts = () => {
  const query = useQuery({
    queryKey: ["unreadAssignedCounts"],
    queryFn: getAssignedUnreadCounts,
    keepPreviousData: true,
    staleTime: 0,
  });
  return { ...query, unreadCounts: query.data || {} };
};