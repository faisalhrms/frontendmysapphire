import React, { useEffect } from 'react'
import { useWatch } from 'react-hook-form'
import FormSelect from '@components/form/FormSelect.jsx'
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx'
import FilterButton from '@components/form/FilterButton.jsx'
import { businessUnit } from '@modules/road-map/setup/unit-category/services/UnitCategoryService.js'

const RoadmapFilter = ({ control, setValue, errors = {}, selectedBU, labelCerts = [],tds_file }) => {
  const watchedBU  = useWatch({ control, name: 'business_unit' })
  const watchedQ   = useWatch({ control, name: 'quality' })
  const watchedPM  = useWatch({ control, name: 'process_method' })
  console.log(tds_file, "tds")
  const bu = watchedBU ?? selectedBU ?? ''

  useEffect(() => {
    setValue('quality', null)
    setValue('process_method', null)
    setValue('product', null)
  }, [watchedBU])

  useEffect(() => {
    setValue('process_method', null)
    setValue('product', null)
  }, [watchedQ])

  useEffect(() => {
    setValue('product', null)
  }, [watchedPM])

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <div className="box">
          <div className="box-body p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <FormSelect
                  className="w-full"
                  label={false}
                  name="business_unit"
                  control={control}
                  errors={errors}
                  placeholder="Business Unit"
                  options={businessUnit}
                />
              </div>

              <div className="flex-1 min-w-0">
                <FormAsyncSelect
                  className="w-full"
                  label={false}
                  name="quality"
                  control={control}
                  errors={errors}
                  placeholder="Quality"
                  apiUrl={`/select/roadmap/qualities?business_unit=${bu}&ref=dashboard`}
                  queryKeyBase={`qualities-${bu}-dashboard`}
                  preselectedOptions={[]}
                  onSelectChange={(selected) => {
                    setValue('quality', selected ?? null)
                    setValue('process_method', null)
                    setValue('product', null)
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <FormAsyncSelect
                  className="w-full"
                  label={false}
                  name="process_method"
                  control={control}
                  errors={errors}
                  placeholder="Process Method"
                  apiUrl={`/select/roadmap/process-methods?business_unit=${bu}&quality=${watchedQ || ''}&ref=dashboard`}
                  queryKeyBase={`pm-${bu}-${watchedQ || ''}-dashboard`}
                  preselectedOptions={[]}
                  onSelectChange={(selected) => {
                    setValue('process_method', selected ?? null)
                    setValue('product', null)
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <FormAsyncSelect
                  className="w-full"
                  label={false}
                  name="product"
                  control={control}
                  errors={errors}
                  placeholder="Product"
                  apiUrl={`/select/roadmap/products?business_unit=${bu}&quality=${watchedQ || ''}&process_method=${watchedPM || ''}&ref=dashboard`}
                  queryKeyBase={`pr-${bu}-${watchedQ || ''}-${watchedPM || ''}-dashboard`}
                  preselectedOptions={[]}
                  onSelectChange={(selected) => setValue('product', selected ?? null)}
                />
              </div>

              <div className="flex-none">
                <FilterButton />
              </div>
              {tds_file && (
                <a
                href={tds_file}
                target="_blank"
                rel="noopener noreferrer"
                title={"TDS File"}
                  className="ti-btn ti-btn-outline-info inline-flex items-center"
                >
                  <i className="ri-file-pdf-fill text-danger"></i>
                </a>
              )}
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
