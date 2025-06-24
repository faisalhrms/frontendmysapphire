import React, { useMemo, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useFilters from "@hooks/useFilters";
import useExportData from "@modules/dashboards/beirholmBi/hooks/useExportData.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ExportDashboardFilter from "@modules/dashboards/beirholmBi/components/ExportDashboardFilter.jsx";
import ExporterImporterChart from "@modules/dashboards/beirholmBi/components/ExporterImporterChart.jsx";
import SplitTable from "@modules/dashboards/beirholmBi/components/SplitTable.jsx";

export default function ExportData() {
  const navigate = useNavigate();
  const { control, errors } = useFilters(
    useMemo(() => ({ initialFilters: [] }), [])
  );
  const filters = useWatch({ control });
  const { data, isLoading } = useExportData(filters);

  useEffect(() => {
    const onKeyDown = e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        navigate("/module/chat/bot");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [navigate]);

  return (
    <>
      <PageHeader
        currentpage="Export Analysis Dashboard"
        activepage="Dashboards"
        mainpage="Export Analysis Dashboard"
      />
      <ExportDashboardFilter control={control} errors={errors} />
      <div className="grid sm:grid-cols-2 gap-6 mb-3">
        <ExporterImporterChart
          title="Top Exporters"
          data={data?.exporter || []}
          labelKey="exporter"
          valueKey="value_usd"
          isLoading={isLoading}
          maxItems={10}
        />
        <ExporterImporterChart
          title="Top Importers"
          data={data?.importer || []}
          labelKey="importer"
          valueKey="value_usd"
          isLoading={isLoading}
          maxItems={10}
        />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
        <SplitTable
          title="Classification Split"
          data={data?.classification || []}
          labelKey="classification"
          valueKey="value_usd"
          isLoading={isLoading}
        />
        <SplitTable
          title="Continent Split"
          data={data?.continent || []}
          labelKey="continent"
          valueKey="value_usd"
          isLoading={isLoading}
        />
        <SplitTable
          title="Country Split"
          data={data?.country || []}
          labelKey="country"
          valueKey="value_usd"
          isLoading={isLoading}
        />
        <SplitTable
          title="Product Split"
          data={data?.product || []}
          labelKey="product"
          valueKey="value_usd"
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
