import React, { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import RoadmapFilter from "@modules/dashboards/roadmap/components/RoadmapFilter.jsx"
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js"
import { roadmapFiltersSchema } from "@modules/dashboards/roadmap/schema/filtersSchema.js"
import InteractiveMap from "@modules/dashboards/roadmap/components/InteractiveMap.jsx"
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx"
import { LineSquiggle } from "lucide-react"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import CertificateAlerts from "@modules/dashboards/roadmap/components/CertificateAlerts.jsx"
import HasPermission from "@components/HasPermission.jsx";

const asId = v => (v && typeof v === "object" && "value" in v ? v.value : v ?? "")

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
  })

  const values = watch()

  const draftFilters = useMemo(
    () => ({
      business_unit: values.business_unit || "",
      quality: asId(values.quality) || "",
      process_method: asId(values.process_method) || "",
      product: asId(values.product) || "",
    }),
    [values],
  )

  const [appliedFilters, setAppliedFilters] = useState(null)

  const { data, isLoading, error } = useFetchWithFilters(
    "/chain/dashboard-chain/",
    appliedFilters || {},
    { enabled: !!appliedFilters },
  )

  const onSubmit = () => setAppliedFilters(draftFilters)

  const payload = data?.data || data
  const labelCerts = payload?.quality_detail?.label_certificates || []
  const tds_file = payload?.quality_detail?.tds_pdf_url || ""

  return (
    <div>
      <div className="flex items-start justify-between mb-4 gap-4">
        <IconPageHeader
          heading="RoadMap Dashboard"
          description="RoadMap Sourcing: Your Supply Chain at a Glance"
          icon={LineSquiggle}
        />
          <HasPermission permission='auth.view_certificates_insight'>
         <CertificateAlerts />
          </HasPermission>
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

      {isLoading && <LoadingSpinner />}

      {!isLoading && error && (
        <div className="p-8 text-center text-sm text-red-500">Failed to load.</div>
      )}

      {!isLoading && !error && data && <InteractiveMap chain={data} />}
    </div>
  )
}

export default RoadmapDashboard
