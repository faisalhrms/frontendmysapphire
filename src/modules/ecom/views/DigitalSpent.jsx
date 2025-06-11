import React, { useState, useMemo, useCallback } from "react"
import PageHeader from "@modules/layouts/includes/PageHeader.jsx"
import useFilters from "@hooks/useFilters.js"
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js"
import IconTabs from "@components/IconTabs.jsx"
import api from "@config/axiosConfig.js"

import DigitalDate from "@modules/ecom/components/DigitalSpent/Digitaldate.jsx"
import DigitalSpentDate from "@modules/ecom/components/DigitalSpent/DigitalSpentDate.jsx"

import ObjectiveWiseSpentSummary from "@modules/ecom/components/DigitalSpent/ObjectiveWiseSpentSummary.jsx"
import CategoryWiseSpent            from "@modules/ecom/components/DigitalSpent/CategoryWiseSpent.jsx"
import DigitalSpentCCSale           from "@modules/ecom/components/DigitalSpent/DigitalSpentCCSale.jsx"
import DayWiseSalesSpent            from "@modules/ecom/components/DigitalSpent/DayWiseSalesSpent.jsx"
import CategoryDayWiseLocalSpent    from "@modules/ecom/components/DigitalSpent/CategoryDayWiseLocalSpent.jsx"
import DailyWebsiteVisitors         from "@modules/ecom/components/DigitalSpent/DailyWebsiteVisitors.jsx"
import CategoryOrdersCount          from "@modules/ecom/components/DigitalSpent/CategoryOrdersCount.jsx"

const DigitalSpent = () => {
  const [activeTab, setActiveTab] = useState("ObjectiveWiseSpentSummary")
  const [isDownloading, setIsDownloading] = useState(false)
  const today = new Date()
  const yesterday = useMemo(() => {
    const d = new Date(today)
    d.setDate(d.getDate() - 1)
    return d.toISOString().split("T")[0]
  }, [today])
  const thirtyDaysAgo = useMemo(() => {
    const d = new Date(today)
    d.setDate(d.getDate() - 30)
    return d.toISOString().split("T")[0]
  }, [today])

  const {
    control,
    handleSubmit,
    errors,
    getFilters,
    clearFilter,
    setValue
  } = useFilters(
    useMemo(() => ({
      initialFilters: [
        { name: "till_date", defaultValue: yesterday },
        { name: "ds_from",   defaultValue: thirtyDaysAgo },
        { name: "ds_to",     defaultValue: yesterday }
      ]
    }), [thirtyDaysAgo, yesterday])
  )

  const [filters, setFilters] = useState(getFilters())

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
    : activeTab === "DailyWebsiteVisitors"
      ? "/digital_spent/fetch_cc_order_summary/"
    : activeTab === "CategoryOrdersCount"
      ? "/digital_spent/fetch_category_orders_count/"
    : ""

  const params = useMemo(() => {
    if (
      activeTab === "ObjectiveWiseSpentSummary" ||
      activeTab === "CategoryWiseSpent"      ||
      activeTab === "DigitalSpentCCSale"     ||
      activeTab === "CategoryOrdersCount"
    ) {
      return { till_date: filters.till_date }
    }
    return { ds_from: filters.ds_from, ds_to: filters.ds_to }
  }, [activeTab, filters])

  const { data: rawData, isLoading } = useFetchWithFilters(endpoint, params)
  const data = rawData || {}

  const onSubmit = useCallback(formData => {
    setFilters(formData)
  }, [])

  const handleTabChange = tabId => {
    setActiveTab(tabId)
    setFilters(getFilters())
  }

 const handleDownload = async () => {
   setIsDownloading(true)
   try {
     const response = await api.get(
       "/reporting/digital_spent/pdf_all_spent/",
       {
         params: {
           ds_from: filters.ds_from,
           ds_to: filters.ds_to
         },
         responseType: "blob"
       }
     )
     const blob = new Blob([response.data], { type: "application/pdf" })
     const link = document.createElement("a")
     link.href = window.URL.createObjectURL(blob)
     link.download = `DigitalSpent_${filters.ds_from}_to_${filters.ds_to}.pdf`
     document.body.appendChild(link)
     link.click()
     document.body.removeChild(link)
   } finally {
     setIsDownloading(false)
   }
 }



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
        )
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
        )
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
        )
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
        )
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
        )
    },
    {
      id: "DailyWebsiteVisitors",
      label: "Daily Website Visitors & Conversion",
      icon: <i className="bx bx-bar-chart" />,
      content:
        activeTab === "DailyWebsiteVisitors" && (
          <DailyWebsiteVisitors
            filters={filters}
            loading={isLoading}
            data={data}
          />
        )
    },
    {
      id: "CategoryOrdersCount",
      label: "Category Orders Count",
      icon: <i className="bx bx-list-ul" />,
      content:
        activeTab === "CategoryOrdersCount" && (
          <CategoryOrdersCount
            filters={filters}
            loading={isLoading}
            data={data}
          />
        )
    }
  ]

  return (
    <>
      <PageHeader currentpage="Digital Spent" />
      <form onSubmit={handleSubmit(onSubmit)}>
        {(activeTab === "ObjectiveWiseSpentSummary" ||
          activeTab === "CategoryWiseSpent"      ||
          activeTab === "DigitalSpentCCSale"     ||
          activeTab === "CategoryOrdersCount") ? (
          <DigitalDate
            control={control}
            errors={errors}
            clearFilter={clearFilter}
            filters={filters}
            onDownload={handleDownload}
            isDownloading={isDownloading}
          />
        ) : (
          <DigitalSpentDate
            control={control}
            errors={errors}
            clearFilter={clearFilter}
            filters={filters}
            setValue={setValue}
            onDownload={handleDownload}
            isDownloading={isDownloading}
          />
        )}
      </form>
      <IconTabs tabs={tabs} onTabChange={handleTabChange} />
    </>
  )
}

export default DigitalSpent
