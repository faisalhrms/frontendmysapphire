// subscriptionHooks.js

import { useState, useEffect } from 'react';
import {
    getSubscriptionSummary,
    getActiveAndPendingSubscriptions,
    getChartData
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
                // Handle error if needed
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
                // Handle error if needed
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
                // Handle error if needed
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, []);

    return { lineChartData, donutChartData, loading };
};