import React from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormInput from "@components/form/FormInput.jsx";
import { useFileModal } from "@hooks/useFileModal.js";
import MediaModal from "@components/MediaModal.jsx";
import FilePreview from "@modules/road-map/setup/unit/components/FilePreview.jsx";

const makePreset = (row, idKey) =>
  row[idKey] && row[`${idKey}_label`]
    ? [{ value: row[idKey], label: row[`${idKey}_label`] }]
    : [];

export default function CertificateRow({
  row,
  index,
  control,
  errors,
  selectedBU,
  remove,
  watch,
  setValue
}) {
  const {
    isModalOpen,
    openModal,
    closeModal,
    attachments,
    handleSelectedFiles,
    handleDeleteAttachment,
    mediaType
  } = useFileModal(`certificateAttachments-${index}`, false);

  const certificateType = watch(`certificates.${index}.certificateType`);

  const onFilesSelected = selection => {
    handleSelectedFiles(selection);
    const id = selection.ids[0] || null;
    setValue(`certificates.${index}.attachment`, id);
  };

  const onDelete = id => {
    handleDeleteAttachment(id);
    setValue(`certificates.${index}.attachment`, null);
  };

  return (
    <>
      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md border">
        <FormAsyncSelect
          label={false}
          name={`certificates.${index}.certificateType`}
          control={control}
          errors={errors}
          placeholder="Certificate Type"
          apiUrl="/select/roadmap/certificate-types"
          queryKeyBase={`certificate-types-${selectedBU}-${index}`}
          className="flex-1"
          preselectedOptions={makePreset(row, "certificateType")}
          onSelectChange={() => setValue(`certificates.${index}.certificateList`, null)}
        />
        <FormAsyncSelect
          label={false}
          name={`certificates.${index}.certificateList`}
          control={control}
          errors={errors}
          placeholder="Certificate List"
          apiUrl={`/select/roadmap/certificates?certificate_type=${certificateType || ""}`}
          queryKeyBase={`certificates-${selectedBU}-${certificateType || "none"}-${index}`}
          className="flex-1"
          preselectedOptions={makePreset(row, "certificateList")}
        />
        <FormSelect
          label={false}
          name={`certificates.${index}.optionType`}
          control={control}
          errors={errors}
          placeholder="Certificate Status"
          options={[
            { value: "Active", label: "Active" },
            { value: "Renewal", label: "Renewal" },
            { value: "N/A", label: "N/A" },
            { value: "Membership", label: "Membership" }
          ]}
          className="flex-1"
        />
        <FormInput
          name={`certificates.${index}.expiryDate`}
          type="date"
          control={control}
          errors={errors}
          className="flex-1"
        />
        <FilePreview attachments={attachments} onDelete={onDelete} />
        {row.mediaUrl && (
          <button
            title={"view attachment"}
            type="button"
            onClick={() => window.open(row.mediaUrl, "_blank")}
            className="ti-btn ti-btn-info ti-btn-sm"
          >
            <i className="ri-eye-line"></i>
          </button>
        )}
        <button
          type="button"
          title={"Select Attachment"}
          onClick={() => openModal("document")}
          className="ti-btn ti-btn-light !rounded-none !mb-0"
        >
          <i className="bi bi-paperclip text-primary" />
        </button>
        <button
          type="button"
          onClick={() => remove(index)}
          className="ti-btn ti-btn-danger ti-btn-sm flex items-center"
        >
          <i className="ti ti-trash" />
        </button>
      </div>
      {isModalOpen && (
        <MediaModal
          type={mediaType}
          modalId={`certificateAttachments-${index}`}
          multiple={false}
          onClose={closeModal}
          selectedFiles={onFilesSelected}
        />
      )}
    </>
  );
}
