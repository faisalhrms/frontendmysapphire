import React from "react"
import { Controller } from "react-hook-form"
import FormSelect from "@components/form/FormSelect.jsx"
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx"
import DateDropdownCalendar from "@modules/beirholm-bi/components/DateDropdownCalendar.jsx"
import { productCountry } from "@modules/beirholm-bi/services/DataSanitizeService.js"
import FilterClearButton from "@components/form/FilterClearButton.jsx"
import FilterButton from "@components/form/FilterButton.jsx"

export default function DataSanitizeFilter({ control, errors, clearFilter }) {
  return (
    <div className="grid grid-cols-12 gap-6 mt-3">
      <div className="col-span-12">
        <div className="box custom-box">
          <div className="box-body p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 flex-wrap">
                <div className="flex items-center gap-4 flex-1">
                  <FormSelect
                    label={false}
                    name="product_country"
                    control={control}
                    errors={errors}
                    placeholder="Select Country"
                    options={productCountry}
                  />
                </div>
                <div className="flex items-center gap-4 flex-1">
                  <FormAsyncSelect
                    label={false}
                    name="data_category"
                    control={control}
                    errors={errors}
                    placeholder="Select Data Category"
                    apiUrl="/select/data/categories/"
                    queryKeyBase="data_category"
                    preselectedOptions={[]}
                    saveOptionEndpoint="/select/data/category/"
                    allowSaveNewOption
                  />
                </div>
                <div className="flex items-center gap-4 flex-1">
                  <Controller
                    name="months"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <DateDropdownCalendar value={field.value} onChange={field.onChange} />
                    )}
                  />
                  {errors?.months && (
                    <p className="text-red-500 text-sm mt-1">{errors.months.message}</p>
                  )}
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <FilterButton />
                <FilterClearButton onClick={clearFilter} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
