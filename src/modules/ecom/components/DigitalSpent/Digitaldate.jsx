import React from "react"
import FormInput from "@components/form/FormInput.jsx"
import FilterButton from "@components/form/FilterButton.jsx"

const DigitalDate = ({ control, errors, clearFilter, filters, onDownload, isDownloading }) => (
  <div className="grid grid-cols-12 gap-6">
    <div className="col-span-12">
      <div className="box custom-box">
        <div className="box-body p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <FormInput
                type="date"
                placeholder="Till Date"
                name="till_date"
                control={control}
                errors={errors}
                label={true}
              />
            </div>
            <div className="flex items-center gap-4 mt-6 flex-2">
              <FilterButton />
              <button
                type="button"
                onClick={onDownload}
                disabled={isDownloading}
                className="ti-btn ti-btn-success !mb-0"
              >
                <i
                  className="bi bi-file-earmark-pdf"
                  style={isDownloading ? { animation: "spin 1s linear infinite" } : {}}
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default React.memo(DigitalDate)
