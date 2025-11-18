import React from "react"
import { useIntegrations } from "@modules/customer-hub/integrations/hooks/useIntegrations.js"
import ExcelUploadCard from "@modules/customer-hub/integrations/components/ExcelUploadCard.jsx"

const ExcelUploadTab = () => {
  const {
    control,
    errors,
    isUploadModalOpen,
    openUpload,
    closeUpload,
    uploadFn,
    downloadAgreementsTemplate
  } = useIntegrations()
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="xl:col-span-8 col-span-12">
        <ExcelUploadCard
          control={control}
          errors={errors}
          isUploadModalOpen={isUploadModalOpen}
          openUpload={openUpload}
          closeUpload={closeUpload}
          uploadFn={uploadFn}
          downloadAgreementsTemplate={downloadAgreementsTemplate}
        />
      </div>
    </div>
  )
}

export default ExcelUploadTab
