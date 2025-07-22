import React from 'react'
import FormSelect from '@components/form/FormSelect.jsx'
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx'
import FilterButton from '@components/form/FilterButton.jsx'
import { businessUnit } from '@modules/road-map/setup/unit-category/services/UnitCategoryService.js'

const RoadmapFilter = ({ control, errors = {}, selectedBU, labelCerts = [] }) => (
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
                apiUrl={`/select/roadmap/qualities?business_unit=${selectedBU}`}
                queryKeyBase={`qualities-${selectedBU}`}
                preselectedOptions={[]}
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
                apiUrl={`/select/roadmap/process-methods?business_unit=${selectedBU}`}
                queryKeyBase={`pm-${selectedBU}`}
                preselectedOptions={[]}
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
                apiUrl={`/select/roadmap/products?business_unit=${selectedBU}`}
                queryKeyBase={`pr-${selectedBU}`}
                preselectedOptions={[]}
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

export default React.memo(RoadmapFilter)
