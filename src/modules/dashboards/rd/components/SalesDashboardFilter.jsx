import React from 'react';
import WeeklyReportFilter from "@modules/ecom/components/weekly-report/WeeklyReportFilter.jsx";
import OrderExceptionFilter from "@modules/sf-order-exceptions/components/OrderExceptionFilter.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
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
        "top_selling_article"
    ];

    if (activeTab === "sf_order_status" || activeTab==="sf_order_hourly_status" || activeTab === 'order_recon_summary') {
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