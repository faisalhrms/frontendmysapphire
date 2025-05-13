import React, { useState, useCallback } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FilterClearButton from "@components/form/FilterClearButton.jsx";

const OmsFilter = ({ control, errors, onClear, onDownloadExcel }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await onDownloadExcel();
    } finally {
      setIsDownloading(false);
    }
  }, [onDownloadExcel, isDownloading]);

  const disabled = isDownloading || Object.keys(errors).length > 0;

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <div className="box custom-box">
          <div className="box-body p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <FormInput
                  type="date"
                  name="startDate"
                  placeholder="From"
                  control={control}
                  errors={errors}
                />
              </div>
              <div className="flex-1">
                <FormInput
                  type="date"
                  name="endDate"
                  placeholder="To"
                  control={control}
                  errors={errors}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="ti-btn ti-btn-success !mb-0"
                  disabled={disabled}
                  onClick={handleDownload}
                >
                  <i
                    className="ri-file-excel-2-line text-lg"
                    style={isDownloading ? { animation: "spin 1s linear infinite" } : {}}
                  />
                </button>
                <FilterClearButton onClick={onClear} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OmsFilter);
