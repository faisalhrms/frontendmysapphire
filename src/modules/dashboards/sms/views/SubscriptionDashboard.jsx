import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import SubscriptionCard from "@modules/dashboards/sms/components/SubscriptionCard.jsx";
import {
    useCountByDepartment,
    useCountByVendor,
    useSubscriptionCharts, useUpcomingRenewals
} from "@modules/dashboards/sms/hooks/subscriptionHook.js";
import SubscriptionListCard from "@modules/dashboards/sms/components/SubscriptionListCard.jsx";
import { useSubscriptionSummary, useActiveAndPendingSubscriptions } from "@modules/dashboards/sms/hooks/subscriptionHook.js";
import {PieChart} from "@modules/dashboards/sms/components/PieChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { SUBSCRIPTION_ROUTES } from "@modules/subscription/routes.js";
import {BasicBarChart} from "@modules/dashboards/sms/components/BasicBarChart.jsx";
import {VendorBasicBarChart} from "@modules/dashboards/sms/components/VendorBasicBarChart.jsx";
import MonthlySpendingChart from "@modules/dashboards/sms/components/MonthlySpendingChart.jsx";
import {BasicLineChart} from "@modules/dashboards/sms/components/BaselineChart.jsx";

const SubscriptionDashboard = () => {
    const { summaryData, loading: summaryLoading } = useSubscriptionSummary();
    const { activeSubscriptions, pendingSubscriptions, loading: subscriptionsLoading } = useActiveAndPendingSubscriptions();
    const { lineChartData, donutChartData, loading: chartsLoading } = useSubscriptionCharts();
    const { countByDepartment, loading: departmentLoading } = useCountByDepartment();
    const { countByVendor, loading: vendorLoading } = useCountByVendor();
    const { upcomingRenewals, loading } = useUpcomingRenewals(10);
    if (summaryLoading || subscriptionsLoading || chartsLoading) {
        return <LoadingSpinner/>;
    }

    const subscriptionRoutesMap = {
        "Total Active": `${SUBSCRIPTION_ROUTES.READ.path}?filter=total-active`,
        "Paid": `${SUBSCRIPTION_ROUTES.READ.path}?filter=paid`,
        "Free": `${SUBSCRIPTION_ROUTES.READ.path}?filter=free`,
        "Canceled (YTD)": `${SUBSCRIPTION_ROUTES.READ.path}?filter=canceled`,
        "New (YTD)": `${SUBSCRIPTION_ROUTES.READ.path}?filter=new`,
    };

    return (
        <>
            <PageHeader
                currentpage="Subscription Dashboard"
                activepage="Dashboard"
                mainpage="Subscription"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                {summaryData.map((data, index) => {
                    const route = subscriptionRoutesMap[data.name] || SUBSCRIPTION_ROUTES.READ.path;

                    return (
                        <SubscriptionCard
                            key={index}
                            subscriptionData={data}
                            route={route}
                        />
                    );
                })}
            </div>

            <div className="grid grid-cols-12 gap-x-6 ">

                <div className="xl:col-span-4 col-span-12 flex-grow  ">

                    <SubscriptionListCard
                        color="bg-secondary/10"
                        title="Active Subscriptions"
                        totalCount={activeSubscriptions.totalCount}
                        items={activeSubscriptions.items}
                        enableSearch={true}
                    />
                </div>
                <div className="xl:col-span-4 col-span-8 flex-grow">
                    <SubscriptionListCard
                        color="bg-purple/10"
                        title="Pending Subscriptions"
                        totalCount={pendingSubscriptions.totalCount}
                        items={pendingSubscriptions.items}
                        
                    />
                </div>

                <div className="xl:col-span-4 col-span-8 flex-grow">
                    <SubscriptionListCard
                        color="bg-orange/10"
                        title="Upcoming Renewals (Next 10 Days)"
                        totalCount={upcomingRenewals.totalCount}
                        items={upcomingRenewals.items}
                    />

                </div>
            </div>
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xl:col-span-4 col-span-12 flex-grow  ">
                    <div className="box overflow-hidden h-full flex flex-col shadow-xl">
                        <div className="box-header bg-primary/10">
                            <div className="box-title dark:text-white">Subscription Count by Status</div>
                        </div>
                        <div className="box-body overflow-hidden">
                            <div className="leads-source-chart flex items-center justify-center">
                                <PieChart data={donutChartData.status_counts}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-8 col-span-12 flex-grow ">
                    <div className="box overflow-hidden h-full flex flex-col shadow-xl">
                        <div className="box-header bg-secondary/10">
                            <div className="box-title dark:text-white">Subscription Count by Department</div>
                        </div>
                        <div className="box-body">
                            <BasicBarChart data={countByDepartment}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-x-6  mt-8 ">
                <div className="xl:col-span-5 col-span-12 flex-grow  ">
                    <div className="box overflow-hidden h-full flex flex-col shadow-xl">
                        <div className="box-header bg-green/10">
                            <div className="box-title dark:text-white">Monthly Spending</div>
                        </div>
                        <div className="box-body overflow-hidden">
                            <div className="leads-source-chart">
                                <MonthlySpendingChart/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="xl:col-span-7 col-span-12 flex-grow  ">
                    <div className="box overflow-hidden h-full flex flex-col shadow-xl">
                        <div className="box-header bg-primary/10">
                            <div className="box-title dark:text-white">Subscription Spending by Department</div>
                        </div>
                        <div className="box-body">
                            <BasicLineChart data={lineChartData}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-x-6 mt-8 mb-8">
                <div className="xl:col-span-12 col-span-12 flex-grow ">
                    <VendorBasicBarChart data={countByVendor}/>
                </div>
            </div>


        </>
    );
};

export default SubscriptionDashboard;