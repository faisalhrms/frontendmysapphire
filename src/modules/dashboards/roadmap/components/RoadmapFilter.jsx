import React from 'react'
import FormSelect from '@components/form/FormSelect.jsx'
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx'
import FilterButton from '@components/form/FilterButton.jsx'
import {businessUnit} from '@modules/road-map/setup/unit-category/services/UnitCategoryService.js'

const RoadmapFilter = ({control, errors={}, selectedBU}) => (
  <div className="grid grid-cols-12 gap-6">
    <div className="col-span-12">
      <div className="box">
        <div className="box-body p-4">
          <div className="flex items-center gap-4">
            <FormSelect
              label={false}
              name="business_unit"
              control={control}
              errors={errors}
              placeholder="Business Unit"
              options={businessUnit}
            />
            <FormAsyncSelect
              label={false}
              name="quality"
              control={control}
              errors={errors}
              placeholder="Quality"
              apiUrl={`/select/roadmap/qualities?business_unit=${selectedBU}`}
              queryKeyBase={`qualities-${selectedBU}`}
              preselectedOptions={[]}
            />
            <FormAsyncSelect
              label={false}
              name="process_method"
              control={control}
              errors={errors}
              placeholder="Process Method"
              apiUrl={`/select/roadmap/process-methods?business_unit=${selectedBU}`}
              queryKeyBase={`pm-${selectedBU}`}
              preselectedOptions={[]}
            />
            <FormAsyncSelect
              label={false}
              name="product"
              control={control}
              errors={errors}
              placeholder="Product"
              apiUrl={`/select/roadmap/products?business_unit=${selectedBU}`}
              queryKeyBase={`pr-${selectedBU}`}
              preselectedOptions={[]}
            />
            <FilterButton/>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default React.memo(RoadmapFilter)
