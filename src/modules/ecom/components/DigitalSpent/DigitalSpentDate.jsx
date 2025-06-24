import React from "react"
import FormInput from "@components/form/FormInput.jsx"
import FilterButton from "@components/form/FilterButton.jsx"

const DigitalSpentDate = ({ control, errors, clearFilter, filters, setValue, onDownload, isDownloading }) => {
  const ensure = (key, offset) => {
    if (!filters[key]) {
      const d = new Date()
      d.setDate(d.getDate() - offset)
      const v = d.toISOString().split("T")[0]
      setValue(key, v, { shouldValidate: false })
      filters[key] = v
    }
  }
  ensure("ds_from", 30)
  ensure("ds_to", 1)

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <div className="box custom-box">
          <div className="box-body p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-1">
                  <FormInput
                    type="date"
                    placeholder="From Date"
                    name="ds_from"
                    control={control}
                    errors={errors}
                  />
                </div>
                <div className="flex-1">
                  <FormInput
                    type="date"
                    placeholder="To Date"
                    name="ds_to"
                    control={control}
                    errors={errors}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <FilterButton />
                <button
                  type="button"
                  onClick={onDownload}
                  disabled={isDownloading}
                  className="ti-btn ti-btn-success !mb-0"
                >
                  <i className={`bi bi-file-earmark-pdf`} style={isDownloading ? { animation: "spin 1s linear infinite" } : {}}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(DigitalSpentDate)
