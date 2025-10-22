import React from "react";
import { useIntegrations } from "@modules/customer-hub/integrations/hooks/useIntegrations.js";
import ApiIntegrationCard from "@modules/customer-hub/integrations/components/ApiIntegrationCard.jsx";
import ExcelUploadCard from "@modules/customer-hub/integrations/components/ExcelUploadCard.jsx";
import AddChannelCard from "@modules/customer-hub/integrations/components/AddChannelCard.jsx";

const IntegrationsForm = () => {
  const {
    control,
    errors,
    handleSubmit,
    onSubmit,
    itemsFA,
    isUploadModalOpen,
    openUpload,
    closeUpload,
    uploadFn,
    downloadAgreementsTemplate,
    newChannel,
    setNewChannel,
    headersText,
    setHeadersText,
    onTypeChange,
    saveNew,
    testSelected
  } = useIntegrations();

  return (
    <div>
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-8 col-span-12">
          <ApiIntegrationCard
            control={control}
            errors={errors}
            itemsFA={itemsFA}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            onTest={async()=>{ await testSelected(); }}
          />
        </div>
        <div className="xl:col-span-4 col-span-12 space-y-6">
          <ExcelUploadCard
            control={control}
            errors={errors}
            isUploadModalOpen={isUploadModalOpen}
            openUpload={openUpload}
            closeUpload={closeUpload}
            uploadFn={uploadFn}
            downloadAgreementsTemplate={downloadAgreementsTemplate}
          />
          <AddChannelCard
            newChannel={newChannel}
            setNewChannel={setNewChannel}
            headersText={headersText}
            setHeadersText={setHeadersText}
            onTypeChange={onTypeChange}
            saveNew={saveNew}
          />
        </div>
      </div>
    </div>
  );
};

export default IntegrationsForm;
