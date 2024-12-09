import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import { Link } from "react-router-dom";
import SubscriptionCard from "@modules/dashboards/sms/components/SubscriptionCard.jsx";
import SubscriptionDataTable from "@modules/dashboards/sms/components/SubscriptionDataTable.jsx";
import { Basicechart, Basicline, Sourcedata } from "../subData/subData.jsx";
import { useSubscriptionCharts } from "@modules/dashboards/sms/hooks/subscriptionHook.js";
import SubscriptionListCard from "@modules/dashboards/sms/components/SubscriptionListCard.jsx";
import { useSubscriptionSummary, useActiveAndPendingSubscriptions } from "@modules/dashboards/sms/hooks/subscriptionHook.js";
import {BasiclineChart} from "@modules/dashboards/sms/components/BaselineChart.jsx";
import {DonatChart} from "@modules/dashboards/sms/components/DonatChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import {SUBSCRIPTION_ROUTES} from "@modules/subscription/routes.js";
import {formatAmountWithCommas} from "@helpers/formatters.js";

const SubscriptionDashboard = () => {
  const { summaryData, loading: summaryLoading } = useSubscriptionSummary();
  const { activeSubscriptions, pendingSubscriptions, loading: subscriptionsLoading } = useActiveAndPendingSubscriptions();
  const { lineChartData, donutChartData, loading: chartsLoading } = useSubscriptionCharts();
console.log(`activeSubscriptions`,activeSubscriptions);
  console.log(`pendingSubscriptions `,pendingSubscriptions);

  if (summaryLoading || subscriptionsLoading || chartsLoading) {
    return <LoadingSpinner/>; // Replace with your loading component if you have one
  }

  return (
      <>
          <PageHeader
              currentpage="Subscription Dahboard"
              activepage="Dashboard"
              mainpage="Subscription"
          />
          <div className="grid grid-cols-6 gap-x-6">
              {summaryData.map((data, index) => {
                  let route;
                  switch (data.name) {
                      case "Total Subscription":
                          route = SUBSCRIPTION_ROUTES.READ.path; // Redirect to all subscriptions
                          break;
                      case "Paid Subscription":
                          route = `${SUBSCRIPTION_ROUTES.READ.path}?filter=paid`; // Redirect to paid subscriptions
                          break;
                      case "Free Subscription":
                          route = `${SUBSCRIPTION_ROUTES.READ.path}?filter=free`; // Redirect to free subscriptions
                          break;
                      default:
                          route = SUBSCRIPTION_ROUTES.READ.path; // Default route
                  }

                  return (
                      <SubscriptionCard
                          key={index}
                          subscriptionData={data}
                          route={route} // Pass the dynamic route
                      />
                  );
              })}
          </div>

          <div className="grid grid-cols-12 gap-x-6">
              {/* Active and Pending Subscription Cards */}
              <SubscriptionListCard title="Active Subscriptions" totalCount={activeSubscriptions.totalCount}
                                    items={activeSubscriptions.items}/>
              <SubscriptionListCard title="Pending Subscriptions" totalCount={pendingSubscriptions.totalCount}
                                    items={pendingSubscriptions.items}/>
          </div>

          <div className="grid grid-cols-12 gap-x-6">
              <div className="xl:col-span-9 col-span-12 flex-grow box">
                  <div className="box custom-box">
                      <div className="box-header">
                          <div className="box-title">Subscription States</div>
                      </div>
                      <div className="box-body">
                          <BasiclineChart data={lineChartData}/>
                      </div>
                  </div>
              </div>

              <div className="xl:col-span-3 col-span-12 flex-grow box">
                  <div className="box">
                      <div className="box-header">
                          <div className="box-title">Subscription Status</div>
                      </div>
                      <div className="box-body overflow-hidden">
                          <div className="leads-source-chart flex items-center justify-center">

                              <DonatChart data={donutChartData.status_counts}/>

                              <div className="lead-source-value">
                                  <span className="block text-[0.875rem]">Total</span>
                                  <span className="block text-[1.5625rem] font-bold">{formatAmountWithCommas(donutChartData.total_count)}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </>
  );
};
export default SubscriptionDashboard;
