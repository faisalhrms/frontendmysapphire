import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import RoadmapFilter from '@modules/dashboards/roadmap/components/RoadmapFilter.jsx'
import { useFetchWithFilters } from '@hooks/useFetchWithFilters.js'
import { roadmapFiltersSchema } from '@modules/dashboards/roadmap/schema/filtersSchema.js'
import InteractiveMap from '@modules/dashboards/roadmap/components/InteractiveMap.jsx'
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { LineSquiggle } from "lucide-react";

const asId = v => (v && typeof v === 'object' && 'value' in v ? v.value : v ?? '')

const RoadmapDashboard = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(roadmapFiltersSchema),
    defaultValues: {
      business_unit: '',
      quality: null,
      process_method: null,
      product: null
    }
  })

  const values = watch()

  const filters = useMemo(() => ({
    business_unit : values.business_unit || '',
    quality       : asId(values.quality) || '',
    process_method: asId(values.process_method) || '',
    product       : asId(values.product) || ''
  }), [values])

  const { data, isLoading, error, refetch } = useFetchWithFilters(
    '/chain/dashboard-chain/',
    filters,
    { enabled: false }
  )

  const onSubmit = () => refetch()

  const payload      = data?.data || data
  const labelCerts   = payload?.quality_detail?.label_certificates || []
  const tds_file   = payload?.quality_detail?.tds_pdf_url || ""
  return (
    <div>
        <IconPageHeader
            heading="RoadMap Dashboard"
            description="RoadMap Sourcing: Your Supply Chain at a Glance"
            icon={LineSquiggle}
        />
      <form onSubmit={handleSubmit(onSubmit)}>
        <RoadmapFilter
          control={control}
          setValue={setValue}
          errors={errors}
          selectedBU={values.business_unit}
          labelCerts={labelCerts}
          tds_file={tds_file}
        />
      </form>

      {isLoading && (
        <div className="p-8 text-center text-sm text-gray-500">Loading…</div>
      )}
      {!isLoading && error && (
        <div className="p-8 text-center text-sm text-red-500">Failed to load.</div>
      )}
      {!isLoading && !error && data && (
        <InteractiveMap chain={data} />
      )}
    </div>
  )
}

export default RoadmapDashboard
