// RoadmapDashboard.jsx
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import RoadmapFilter from "@modules/dashboards/roadmap/components/RoadmapFilter.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import { roadmapFiltersSchema } from "@modules/dashboards/roadmap/schema/filtersSchema.js";
import InteractiveMap from "@modules/dashboards/roadmap/components/InteractiveMap.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { LineSquiggle, GitBranch } from "lucide-react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import CertificateAlerts from "@modules/dashboards/roadmap/components/CertificateAlerts.jsx";
import HasPermission from "@components/HasPermission.jsx";
import PdfModalViewerBase from "@modules/dashboards/roadmap/components/PdfModalViewerBase.jsx";

const asId = (v) => (v && typeof v === "object" && "value" in v ? v.value : v ?? "");

const PROCESS_FLOW_URL =
  "https://be.mysapphire.co/media/uploads/2026/01/09/RoadMapFlowcharts.pdf";

const RoadmapDashboard = () => {
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roadmapFiltersSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      business_unit: "",
      quality: null,
      process_method: null,
      product: null,
    },
  });

  const values = watch();

  const draftFilters = useMemo(
    () => ({
      business_unit: values.business_unit || "",
      quality: asId(values.quality) || "",
      process_method: asId(values.process_method) || "",
      product: asId(values.product) || "",
    }),
    [values],
  );

  const [appliedFilters, setAppliedFilters] = useState(null);

  const { data, isLoading, error } = useFetchWithFilters(
    "/chain/dashboard-chain/",
    appliedFilters || {},
    { enabled: !!appliedFilters },
  );

  const onSubmit = () => setAppliedFilters(draftFilters);

  const payload = data?.data || data;
  const labelCerts = payload?.quality_detail?.label_certificates || [];
  const tds_file = payload?.quality_detail?.tds_pdf_url || "";

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState("");
  const [viewerTitle, setViewerTitle] = useState("Document");

  const openDoc = (url, title = "Document") => {
    if (!url) return;
    setViewerUrl(url);
    setViewerTitle(title);
    setViewerOpen(true);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-4 gap-4">
        <IconPageHeader
          heading="RoadMap Dashboard"
          description="RoadMap Sourcing: Your Supply Chain at a Glance"
          icon={LineSquiggle}
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openDoc(PROCESS_FLOW_URL, "RoadMap Process Flow")}
            className="inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors shadow-sm border-sky-500/40 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-300"
            title="View process flow"
          >
            <GitBranch className="h-4 w-4 mr-1.5" />
            <span>Process Flow</span>
          </button>

          <HasPermission permission="auth.view_certificates_insight">
            <CertificateAlerts />
          </HasPermission>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <RoadmapFilter
          control={control}
          setValue={setValue}
          clearErrors={clearErrors}
          errors={errors}
          selectedBU={values.business_unit}
          labelCerts={labelCerts}
          tds_file={tds_file}
        />
      </form>

      <PdfModalViewerBase
        isOpen={viewerOpen}
        fileUrl={viewerUrl}
        mimeType="application/pdf"
        loading={false}
        onClose={() => setViewerOpen(false)}
        title={viewerTitle}
        subtitle="PDF Document"
        isConfidential={false}
      />

      {isLoading && <LoadingSpinner />}

      {!isLoading && error && (
        <div className="p-8 text-center text-sm text-red-500">Failed to load.</div>
      )}

      {!isLoading && !error && data && <InteractiveMap chain={data} />}
    </div>
  );
};

export default RoadmapDashboard;
