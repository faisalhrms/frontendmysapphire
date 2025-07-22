import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import RoadmapFilter from '@modules/dashboards/roadmap/components/RoadmapFilter.jsx'
import { useFetchWithFilters } from '@hooks/useFetchWithFilters.js'
import {roadmapFiltersSchema} from "@modules/dashboards/roadmap/schema/filtersSchema.js";
import InteractiveMap from "@modules/dashboards/roadmap/components/InteractiveMap.jsx";

const RoadmapDashboard = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(roadmapFiltersSchema),
    defaultValues: {
      business_unit: "",
      quality: undefined,
      process_method: undefined,
      product: undefined,
    }
  })

  const values = watch()
  const filters = useMemo(() => ({
    business_unit: values.business_unit,
    quality: values.quality,
    process_method: values.process_method,
    product: values.product,
  }), [values])

  const { data, isLoading, error, refetch } = useFetchWithFilters(
    '/chain/dashboard-chain',
    filters,
    { enabled: false }
  )

  const onSubmit = () => {
    refetch()
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RoadmapFilter
          control={control}
          errors={errors}
          selectedBU={values.business_unit}
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
