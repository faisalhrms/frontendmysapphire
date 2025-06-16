// SalesDashboardFilter.jsx
import React from 'react';
import WeeklyReportFilter from "@modules/ecom/components/weekly-report/WeeklyReportFilter.jsx";
import OrderExceptionFilter from "@modules/sf-order-exceptions/components/OrderExceptionFilter.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";

const SalesDashboardFilter = ({
                                  activeTab,
                                  control,
                                  errors,
                                  filters
                              }) => {
    // Define tabs that use the ecommerce weekly report filter
    const ecomTabs = [
        "landing_page_performance",
        "hour_traffic_rate",
        "order_detail_from_cc",
        "top_selling_article"
    ];

    // Salesforce Order Status specific filter
    if (activeTab === "sf_order_status"||activeTab==="sf_order_hourly_status") {
        return (
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                    <div className="box custom-box">
                        <div className="box-body p-4">
                            <div className="flex items-center justify-between gap-4">
                                {
                                    activeTab === "sf_order_status"?
                                        <>
                                            <div className="flex items-center gap-4 flex-1">
                                                <FormInput
                                                    type="datetime-local"
                                                    name="from_dt"
                                                    control={control}
                                                    errors={errors}
                                                />
                                            </div>
                                            <div className="flex items-center gap-4 flex-1">
                                                <FormInput
                                                    type="datetime-local"
                                                    name="to_dt"
                                                    control={control}
                                                    errors={errors}
                                                />
                                            </div>
                                        </>
                                        :
                                        <div className="flex items-center gap-4 flex-1">
                                        <FormInput
                                            type="date"
                                            placeholder="From Current Period"
                                            name="date"
                                            control={control}
                                            errors={errors}
                                            label={false}
                                        />
                                        </div>

                                }
                                <FilterButton/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    // Salesforce Order Exceptions filter
    if (activeTab === "sf_order_exceptions") {
        return <OrderExceptionFilter control={control} errors={errors}/>;
    }

    // Default filter for ecommerce tabs
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

    // Fallback for unknown tabs
    return null;
};

export default SalesDashboardFilter;