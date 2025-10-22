import React from "react";
import UploadMasterModal from "@modules/customer-hub/master-data/components/UploadMasterModal.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";

const ExcelUploadCard = ({ control, errors, isUploadModalOpen, openUpload, closeUpload, uploadFn, downloadAgreementsTemplate }) => {
  return (
    <div className="box">
      <div className="box-header">
        <div className="box-title">Excel Upload</div>
      </div>
      <div className="box-body space-y-4">
        <div className="grid grid-cols-12 gap-3">
          <div className="xl:col-span-8 col-span-12">
            <FormAsyncSelect
              label
              name="channel_id"
              control={control}
              errors={errors}
              placeholder="Channel"
              apiUrl="/select/integration/channels/?type=excel&active=1"
              queryKeyBase="integration_channels_excel"
            />
          </div>
          <div className="xl:col-span-4 col-span-12 flex items-center justify-end gap-2">
            <button onClick={downloadAgreementsTemplate} className="ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]">
              <i className="ri-download-2-line" />
            </button>
            <button type="button" onClick={openUpload} className="ti-btn ti-btn-warning-full !py-1 !px-2 !text-[0.75rem]">
              <i className="ri-upload-cloud-2-line" />
            </button>
          </div>
        </div>
        {isUploadModalOpen && (
          <UploadMasterModal
            title="Upload Agreements"
            uploadFn={uploadFn}
            extraParams={{}}
            closeModal={closeUpload}
            onUploaded={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default ExcelUploadCard;
