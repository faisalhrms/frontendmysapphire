import React, { useEffect } from 'react'
import { useWatch } from 'react-hook-form'
import FormSelect from '@components/form/FormSelect.jsx'
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx'
import FilterButton from '@components/form/FilterButton.jsx'
import { businessUnit } from '@modules/road-map/setup/unit-category/services/UnitCategoryService.js'

/**
 * Props:
 *  - control (required): RHF control from parent useForm
 *  - setValue (required): RHF setValue from parent useForm
 *  - errors (optional)
 *  - selectedBU (optional): legacy; will be ignored if form has business_unit selected
 *  - labelCerts (optional): array of label certificate objects
 */
const RoadmapFilter = ({ control, setValue, errors = {}, selectedBU, labelCerts = [] }) => {
  // Watch current selections
  const watchedBU  = useWatch({ control, name: 'business_unit' })
  const watchedQ   = useWatch({ control, name: 'quality' })
  const watchedPM  = useWatch({ control, name: 'process_method' })

  // Compute params for endpoints
  const bu = watchedBU ?? selectedBU ?? ''

  // Hard resets when parent value changes (covers manual changes, programmatic sets, etc.)
  useEffect(() => {
    // BU changed → reset deeper filters
    setValue('quality', null)
    setValue('process_method', null)
    setValue('product', null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedBU])

  useEffect(() => {
    // Quality changed → reset process + product
    setValue('process_method', null)
    setValue('product', null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedQ])

  useEffect(() => {
    // Process method changed → reset product only
    setValue('product', null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedPM])

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <div className="box">
          <div className="box-body p-4">
            <div className="flex items-center gap-4">
              {/* Business Unit */}
              <div className="flex-1 min-w-0">
                <FormSelect
                  className="w-full"
                  label={false}
                  name="business_unit"
                  control={control}
                  errors={errors}
                  placeholder="Business Unit"
                  options={businessUnit}
                  // If your FormSelect supports onChange/onSelectChange, you can also add:
                  // onSelectChange={(val) => {
                  //   setValue('business_unit', val ?? null)
                  //   setValue('quality', null)
                  //   setValue('process_method', null)
                  //   setValue('product', null)
                  // }}
                />
              </div>

              {/* Quality (by chains for BU) */}
              <div className="flex-1 min-w-0">
                <FormAsyncSelect
                  className="w-full"
                  label={false}
                  name="quality"
                  control={control}
                  errors={errors}
                  placeholder="Quality"
                  apiUrl={`/select/roadmap/qualities?business_unit=${bu}`}
                  queryKeyBase={`qualities-${bu}`}
                  preselectedOptions={[]}
                  onSelectChange={(selected) => {
                    setValue('quality', selected ?? null)
                    setValue('process_method', null)
                    setValue('product', null)
                  }}
                />
              </div>

              {/* Process (by chains for BU + Quality) */}
              <div className="flex-1 min-w-0">
                <FormAsyncSelect
                  className="w-full"
                  label={false}
                  name="process_method"
                  control={control}
                  errors={errors}
                  placeholder="Process Method"
                  apiUrl={`/select/roadmap/process-methods?business_unit=${bu}&quality=${watchedQ || ''}`}
                  queryKeyBase={`pm-${bu}-${watchedQ || ''}`}
                  preselectedOptions={[]}
                  onSelectChange={(selected) => {
                    setValue('process_method', selected ?? null)
                    setValue('product', null)
                  }}
                />
              </div>

              {/* Product (by chains for BU + Quality + Process) */}
              <div className="flex-1 min-w-0">
                <FormAsyncSelect
                  className="w-full"
                  label={false}
                  name="product"
                  control={control}
                  errors={errors}
                  placeholder="Product"
                  apiUrl={`/select/roadmap/products?business_unit=${bu}&quality=${watchedQ || ''}&process_method=${watchedPM || ''}`}
                  queryKeyBase={`pr-${bu}-${watchedQ || ''}-${watchedPM || ''}`}
                  preselectedOptions={[]}
                  onSelectChange={(selected) => setValue('product', selected ?? null)}
                />
              </div>

              <div className="flex-none">
                <FilterButton />
              </div>

              {labelCerts.length > 0 && (
                <div className="flex items-center space-x-2 ml-8 flex-none">
                  {labelCerts.map(cert => (
                    <span key={cert.id} className="flex-shrink-0 transition-transform duration-150 hover:scale-110">
                      <img
                        src={cert.media.medium_url}
                        alt={cert.name}
                        title={cert.name}
                        className="h-14 w-14 object-contain"
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(RoadmapFilter)
