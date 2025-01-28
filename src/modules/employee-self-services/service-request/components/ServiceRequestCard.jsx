import face5 from "@assets/images/faces/5.jpg";
import React, { useEffect, useState } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { formatOptions } from "@helpers/formatters.js";

const ServiceRequestCard = ({
  serviceData,
  currentUser,
  control,
  setValue,
  errors,
}) => {
  const [files, setFiles] = useState([
    { id: `${Date.now()}-${Math.random()}`, file: null, file_content: "" },
  ]);
  const [existingAttachments, setExistingAttachments] = useState([]);

  useEffect(() => {
    if (serviceData?.attachments) {
      setExistingAttachments(serviceData.attachments);

      setValue(
        "attachments",
        serviceData.attachments.map((att) => att.id)
      );
    }
  }, [serviceData, setValue]);

  const addFileInput = () => {
    setFiles((prevFiles) => [
      ...prevFiles,
      { id: `${Date.now()}-${Math.random()}`, file: null, file_content: "" },
    ]);
  };

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    const newFiles = [...files];
    const reader = new FileReader();

    reader.onload = () => {
      const base64Content = reader.result.split(",")[1];
      newFiles[index] = {
        ...newFiles[index],
        file,
        file_content: base64Content,
      };

      setFiles(newFiles);

      setValue("attachments", [
        ...existingAttachments.map((att) => att.id),
        ...newFiles.map((f) => ({
          file_name: f.file?.name,
          file_content: f.file_content,
        })),
      ]);
    };

    reader.onerror = () => {
      console.error("Failed to read file:", file.name);
    };

    reader.readAsDataURL(file);
  };

const removeFileInput = (index) => {
  const newFiles = files.filter((_, i) => i !== index);
  setFiles(newFiles);

  setValue("attachments", [
    ...existingAttachments.map((att) => att.id), // Only include IDs for existing attachments
    ...newFiles.filter((f) => f.file).map((f) => ({
      file_name: f.file?.name,
      file_content: f.file_content,
    })), // Include valid file objects for new files
  ]);
};


const removeExistingAttachment = (attachmentId) => {
  const updatedAttachments = existingAttachments.filter(
    (att) => att.id !== attachmentId
  );
  setExistingAttachments(updatedAttachments);

  setValue("attachments", [
    ...updatedAttachments.map((att) => att.id), // Only include remaining IDs for existing attachments
    ...files.filter((f) => f.file).map((f) => ({
      file_name: f.file?.name,
      file_content: f.file_content,
    })), // Include valid file objects for new files
  ]);
};

  return (
    <div className="xl:col-span-3 col-span-12">
      <div className="box bg-primary">
        <div className="flex items-start bg-primary p-4 rounded-xl shadow-md">
          <span className="avatar avatar-xl avatar-rounded mr-4">
            <img src={face5} alt="Profile" className="rounded-full w-16 h-16" />
          </span>
          <div className="flex-grow text-white">
            <h6 className="font-semibold text-lg mb-1">
              {serviceData?.reporter_user?.full_name || currentUser?.full_name}
            </h6>
            <p className="opacity-70 mb-1">
              {serviceData?.reporter_user?.company?.name ||
                currentUser?.company?.name}
            </p>
            <div className="flex items-center mb-2">
              <div>
                <p className="text-sm opacity-50 mb-0">{serviceData?.name}</p>
                <p className="text-md font-normal mb-0 text-shadow">
                  {(serviceData?.created_at
                    ? new Date(serviceData.created_at)
                    : new Date()
                  ).toLocaleString() || "No Date"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm">{serviceData?.status || "In Service"}</p>
              <p className="text-sm">
                {serviceData?.startDate || "Mar 08, 2023"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="box">
        <div className="box-body p-4 rounded-md cursor-pointer">
          {existingAttachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between bg-gray-100 rounded-md mb-3"
            >
              <span className="flex-grow py-1 px-2">
                {attachment.file_name}
              </span>
              <div className="flex items-center rounded-r-md">
                <i
                  className="ri-eye-fill text-success mr-2 cursor-pointer"
                  onClick={() => window.open(attachment.file, "_blank")}
                ></i>
                <i
                  className="ri-delete-bin-5-fill text-danger cursor-pointer"
                  onClick={() => removeExistingAttachment(attachment.id)}
                ></i>
              </div>
            </div>
          ))}

          {files.map((file, index) => (
            <div
              key={file.id}
              className="flex items-center justify-between bg-gray-100 rounded-md mb-3 p-2"
            >
              <input
                type="file"
                className="block w-full border border-gray-200 focus:shadow-sm dark:focus:shadow-white/10 rounded-sm text-sm focus:z-10 focus:outline-0 focus:border-gray-200 dark:focus:border-white/10 dark:border-white/10 dark:text-[#8c9097] dark:text-white/50 file:me-4 file:py-2 file:px-4 file:rounded-s-sm file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary focus-visible:outline-none"
                onChange={(event) => handleFileChange(event, index)}
              />
              <div className="flex items-center flex-shrink-0 ml-2">
                <i
                  className="ri-eye-fill text-success mr-2 cursor-pointer"
                  onClick={() => {
                    if (file.file) {
                      const url = URL.createObjectURL(file.file);
                      window.open(url, "_blank");
                    }
                  }}
                ></i>
                <i
                  className="ri-delete-bin-5-fill text-danger cursor-pointer"
                  onClick={() => removeFileInput(index)}
                ></i>
              </div>
            </div>
          ))}

          <div className="flex justify-start mt-4">
            <i
              className="bi bi-plus-square text-success px-3 py-2 rounded-md cursor-pointer hover:bg-success-dark"
              onClick={addFileInput}
            ></i>
          </div>
        </div>
      </div>

      <div className="box">
        <div className="box-body p-4">
          <div className="xl:col-span-4 col-span-12 mt-4">
            <FormInput
              name="to_email"
              control={control}
              errors={errors}
              placeholder="To"
              readOnly
            />
          </div>
          <div className="xl:col-span-4 col-span-12 mt-2 md-2">
            <FormAsyncSelect
              label="CC"
              isMulti={true}
              name="cc_email"
              control={control}
              errors={errors}
              placeholder="CC"
              apiUrl="/select/users/email"
              queryKeyBase="users-email"
              allowSaveNewOption={false}
              preselectedOptions={formatOptions(
                serviceData,
                "cc_email",
                "value",
                "label"
              )}
              onOptionSelect={(selectedOption) => {
                const emails = selectedOption.map((option) => option.value);
                setValue("cc_email", emails);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestCard;
