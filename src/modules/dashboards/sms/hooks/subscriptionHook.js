// subscriptionHooks.js

import { useState, useEffect } from 'react';
import {
    getSubscriptionSummary,
    getActiveAndPendingSubscriptions,
    getChartData, getMonthlySpend, getCountByDepartment, getCountByVendor, getUpcomingRenewals
} from '@modules/dashboards/sms/services/subscriptionService.js';

export const useSubscriptionSummary = () => {
    const [summaryData, setSummaryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await getSubscriptionSummary();
                setSummaryData(data);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    return { summaryData, loading };
};

export const useActiveAndPendingSubscriptions = () => {
    const [activeSubscriptions, setActiveSubscriptions] = useState([]);
    const [pendingSubscriptions, setPendingSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const data = await getActiveAndPendingSubscriptions();
                setActiveSubscriptions(data.activeSubscriptions);
                setPendingSubscriptions(data.pendingSubscriptions);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    return { activeSubscriptions, pendingSubscriptions, loading };
};

export const useSubscriptionCharts = () => {
    const [lineChartData, setLineChartData] = useState([]);
    const [donutChartData, setDonutChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const data = await getChartData();
                setLineChartData(data.lineChartData);
                setDonutChartData(data.donutChartData);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, []);

    return { lineChartData, donutChartData, loading };
};
export const useMonthlySpend = () => {
    const [monthlySpend, setMonthlySpend] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMonthlySpend = async () => {
            try {
                const data = await getMonthlySpend();
                setMonthlySpend(data);
            } catch (error) {

            } finally {
                setLoading(false);
            }
        };

        fetchMonthlySpend();
    }, []);

    return { monthlySpend, loading };
};

export const useCountByDepartment = () => {
    const [countByDepartment, setCountByDepartment] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCountByDepartment();
                setCountByDepartment(data);
            } catch (error) {

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { countByDepartment, loading };
};

export const useCountByVendor = () => {
    const [countByVendor, setCountByVendor] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCountByVendor();
                setCountByVendor(data);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { countByVendor, loading };
};
export const useUpcomingRenewals = (days = 10) => {
    const [upcomingRenewals, setUpcomingRenewals] = useState({ totalCount: 0, items: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRenewals = async () => {
            try {
                const data = await getUpcomingRenewals(days);
                setUpcomingRenewals({
                    totalCount: data.totalCount || 0,
                    items: Array.isArray(data.items) ? data.items : [],
                });
            } catch (error) {
                setUpcomingRenewals({ totalCount: 0, items: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchRenewals();
    }, [days]);

    return { upcomingRenewals, loading };
};
