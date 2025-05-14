import { useMemo } from "react";

const useComparativeReportDates = () => {
    return useMemo(() => {
        const date = new Date();


        const yesterday = new Date(date);
        yesterday.setDate(date.getDate() - 1);
        const today = yesterday.toISOString().split('T')[0];


        const formattedStartOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        formattedStartOfMonth.setHours(0, 0, 0, 0);
        const startOfMonth = formattedStartOfMonth.toLocaleDateString('en-CA');


        const prevYearYesterday = new Date(date);
        prevYearYesterday.setFullYear(date.getFullYear() - 1);
        prevYearYesterday.setDate(date.getDate() - 1);
        const formattedPrevYearYesterday = prevYearYesterday.toISOString().split('T')[0];


        const prevYearStartOfMonth = new Date(date.getFullYear() - 1, date.getMonth(), 1);
        prevYearStartOfMonth.setHours(0, 0, 0, 0);
        const startOfPrevYear = prevYearStartOfMonth.toLocaleDateString('en-CA');

        return {
            today,
            startOfMonth,
            formattedPrevYearYesterday,
            startOfPrevYear
        };
    }, []);
};

export default useComparativeReportDates;
