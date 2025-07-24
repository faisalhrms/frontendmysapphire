import React, { useEffect } from "react"
import { useWatch } from "react-hook-form"
import FormInput from "@components/form/FormInput.jsx"
import FilterButton from "@components/form/FilterButton.jsx"

const DigitalSpentDate = ({ control, errors, filters, setValue, onDownload, isDownloading }) => {
  const iso = d => d.toISOString().split("T")[0]
  const till = useWatch({ control, name: "till_date" })

  useEffect(() => {
    if (!till) return
    setValue("ds_to", till, { shouldValidate: false })
    const f = new Date(till)
    f.setDate(f.getDate() - 30)
    setValue("ds_from", iso(f), { shouldValidate: false })
  }, [till, setValue])

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <div className="box custom-box">
          <div className="box-body p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-1">
                  <FormInput type="date" placeholder="From Date" name="ds_from" control={control} errors={errors} />
                </div>
                <div className="flex-1">
                  <FormInput type="date" placeholder="To Date" name="ds_to" control={control} errors={errors} />
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
}

export default React.memo(DigitalSpentDate)
