import React, { useState, useMemo, useCallback } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import useFilters from "@hooks/useFilters.js";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import IconTabs from "@components/IconTabs.jsx";
import DigitalDate from "@modules/ecom/components/DigitalSpent/Digitaldate.jsx";
import getComparativeReportDates from "@modules/DailyReport/views/utils.js";
import ObjectiveWiseSpentSummary from "@modules/ecom/components/DigitalSpent/ObjectiveWiseSpentSummary.jsx";
import CategoryWiseSpent            from "@modules/ecom/components/DigitalSpent/CategoryWiseSpent.jsx";
import DigitalSpentCCSale        from "@modules/ecom/components/DigitalSpent/DigitalSpentCCSale.jsx";
import DayWiseSalesSpent           from "@modules/ecom/components/DigitalSpent/DayWiseSalesSpent.jsx";
import CategoryDayWiseLocalSpent   from "@modules/ecom/components/DigitalSpent/CategoryDayWiseLocalSpent.jsx";

const DigitalSpent = () => {
  const [activeTab, setActiveTab] = useState("ObjectiveWiseSpentSummary");
  const { today } = getComparativeReportDates();
  const { control, handleSubmit, errors, getFilters } = useFilters(
    useMemo(() => ({ initialFilters: [{ name: "till_date", defaultValue: today }] }), [])
  );
  const [filters, setFilters] = useState(getFilters());

  const endpoint =
    activeTab === "ObjectiveWiseSpentSummary"
      ? "/digital_spent/fetch_objective_wise_summary/"
    : activeTab === "CategoryWiseSpent"
      ? "/digital_spent/fetch_category_wise_summary/"
    : activeTab === "DigitalSpentCCSale"
      ? "/digital_spent/fetch_digital_spent_cc_sales/"
    : activeTab === "DayWiseSalesSpent"
      ? "/digital_spent/fetch_day_wise_sales_spent/"
    : activeTab === "CategoryDayWiseLocalSpent"
      ? "/digital_spent/fetch_category_day_wise_local_spent/"
    : "";

  const { data: rawData, isLoading } = useFetchWithFilters(endpoint, filters);
  const data = rawData || {};

  const onSubmit = useCallback((formData) => setFilters(formData), []);
  const handleTabChange = (tabId) => setActiveTab(tabId);

  const tabs = [
    {
      id: "ObjectiveWiseSpentSummary",
      label: "Objective Wise Spent",
      icon: <i className="bx bx-chart" />,
      content:
        activeTab === "ObjectiveWiseSpentSummary" && (
          <ObjectiveWiseSpentSummary
            filters={filters}
            loading={isLoading}
            data={data}
          />
        ),
    },
    {
      id: "CategoryWiseSpent",
      label: "Category Wise Spent",
      icon: <i className="bx bx-pie-chart-alt" />,
      content:
        activeTab === "CategoryWiseSpent" && (
          <CategoryWiseSpent
            filters={filters}
            loading={isLoading}
            data={data}
          />
        ),
    },
    {
      id: "DigitalSpentCCSale",
      label: "Digital Spent CC Sales",
      icon: <i className="bx bx-bar-chart-alt" />,
      content:
        activeTab === "DigitalSpentCCSale" && (
          <DigitalSpentCCSale
            filters={filters}
            loading={isLoading}
            data={data}
          />
        ),
    },
    {
      id: "DayWiseSalesSpent",
      label: "DayWise Sales & Spent",
      icon: <i className="bx bx-calendar-alt" />,
      content:
        activeTab === "DayWiseSalesSpent" && (
          <DayWiseSalesSpent
            filters={filters}
            loading={isLoading}
            data={data}
          />
        ),
    },
    {
      id: "CategoryDayWiseLocalSpent",
      label: "Category DayWise Local Spent",
      icon: <i className="bx bx-grid-alt" />,
      content:
        activeTab === "CategoryDayWiseLocalSpent" && (
          <CategoryDayWiseLocalSpent
            filters={filters}
            loading={isLoading}
            data={data}
          />
        ),
    },
  ];

  return (
    <>
      <PageHeader currentpage="Digital Spent" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DigitalDate control={control} errors={errors} filters={filters} />
      </form>
      <IconTabs tabs={tabs} onTabChange={handleTabChange} />
    </>
  );
};

export default DigitalSpent;
