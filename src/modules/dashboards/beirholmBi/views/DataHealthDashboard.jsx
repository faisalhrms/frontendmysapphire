import React, { useMemo } from "react"
import { useWatch } from "react-hook-form"
import useFilters from "@hooks/useFilters"
import PageHeader from "@modules/layouts/includes/PageHeader.jsx"
import useDataHealth from "@modules/dashboards/beirholmBi/hooks/useDataHealth.js"
import DataHealthDashboardFilter from "@modules/dashboards/beirholmBi/components/data-health/DataHealthDashboardFilter.jsx"
import HealthKpis from "@modules/dashboards/beirholmBi/components/data-health/HealthKpis.jsx"
import HealthPeriodTable from "@modules/dashboards/beirholmBi/components/data-health/HealthPeriodTable.jsx"
import HealthOperatorBar from "@modules/dashboards/beirholmBi/components/data-health/HealthOperatorBar.jsx"
import HealthHeatmap from "@modules/dashboards/beirholmBi/components/data-health/HealthHeatmap.jsx"
import HealthTrend from "@modules/dashboards/beirholmBi/components/data-health/HealthTrend.jsx"
import HealthSeverityDonut from "@modules/dashboards/beirholmBi/components/data-health/HealthSeverityDonut.jsx"
import HealthIssuesStacked from "@modules/dashboards/beirholmBi/components/data-health/HealthIssuesStacked.jsx"
import HealthTopHeaders from "@modules/dashboards/beirholmBi/components/data-health/HealthTopHeaders.jsx"
import HealthUniqueValuesHeatmap from "@modules/dashboards/beirholmBi/components/data-health/HealthUniqueValuesHeatmap.jsx"

export default function DataHealthDashboard() {
  const { control, errors } = useFilters(useMemo(() => ({ initialFilters: [] }), []))
  const filters = useWatch({ control })
  const { data, isLoading } = useDataHealth(filters)
  return (
    <>
      <PageHeader currentpage="Data Health Dashboard" activepage="Dashboards" mainpage="Data Health Dashboard" />
      <DataHealthDashboardFilter control={control} errors={errors} />
      <HealthKpis kpis={data?.kpis} trend={data?.trend} loading={isLoading} />
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-12 xl:col-span-4">
          <HealthIssuesStacked rows={data?.table || []} />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <HealthTrend trend={data?.trend || {}} />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <HealthSeverityDonut data={data?.severity || []} />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <HealthHeatmap series={data?.heatmap || []} />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <HealthUniqueValuesHeatmap series={data?.unique_heatmap || []} />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <HealthTopHeaders items={data?.headers_top || []} />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <HealthOperatorBar data={data?.operators || []} />
        </div>
        <div className="col-span-12">
          <HealthPeriodTable rows={data?.table || []} />
        </div>
      </div>
    </>
  )
}
