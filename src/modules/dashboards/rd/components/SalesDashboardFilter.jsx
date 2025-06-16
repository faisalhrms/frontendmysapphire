import React from 'react';
import WeeklyReportFilter from "@modules/ecom/components/weekly-report/WeeklyReportFilter.jsx";
import OrderExceptionFilter from "@modules/sf-order-exceptions/components/OrderExceptionFilter.jsx";
import SalesForceOrderStatusFilter from "@modules/sf-order-exceptions/components/SalesForceOrderStatusFilter.jsx";

const SalesDashboardFilter = ({
                                  activeTab,
                                  control,
                                  errors,
                                  filters
                              }) => {
    const ecomTabs = [
        "landing_page_performance",
        "hour_traffic_rate",
        "order_detail_from_cc",
        "top_selling_article",
        "top_selling_products"
    ];

    if (activeTab === "fo_status_summary" || activeTab==="hourly_order_report" || activeTab === 'order_recon_summary') {
        return <SalesForceOrderStatusFilter control={control} errors={errors} activeTab={activeTab} />;
    }


    if (activeTab === "sf_order_exceptions") {
        return <OrderExceptionFilter control={control} errors={errors}/>;
    }

    if (ecomTabs.includes(activeTab)) {
        return (
            <WeeklyReportFilter
                filters={filters}
                control={control}
                errors={errors}
                activeTab={activeTab}
            />
        );
    }

    return null;
};

export default SalesDashboardFilter;