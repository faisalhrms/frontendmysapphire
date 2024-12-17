import face5 from "@assets/images/faces/5.jpg";
import React, { useEffect, useState } from "react";

const ServiceRequestCard = ({ serviceData, currentUser, control, setValue, errors }) => {
    const [files, setFiles] = useState([]);
    const [existingAttachments, setExistingAttachments] = useState([]);

    useEffect(() => {
        if (serviceData?.attachments) {
            setExistingAttachments(serviceData.attachments);
            // Initialize form attachments with existing attachment IDs
            setValue("attachments", serviceData.attachments.map(att => att.id));
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
            const base64Content = reader.result.split(",")[1]; // Extract Base64 content
            newFiles[index] = { ...newFiles[index], file, file_content: base64Content };

            setFiles(newFiles);

            // Update attachments: Keep existing IDs + new files
            setValue("attachments", [
                ...existingAttachments.map((att) => att.id), // Keep existing attachments as IDs
                ...newFiles.map((f) => ({
                    file_name: f.file?.name,
                    file_content: f.file_content,
                })),
            ]);
        };

        reader.onerror = () => {
            console.error("Failed to read file:", file.name);
        };

        reader.readAsDataURL(file); // Convert file to Base64
    };

    const removeFileInput = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);

        // Update attachments without removed file
        setValue("attachments", [
            ...existingAttachments.map((att) => att.id), // Keep existing attachments as IDs
            ...newFiles.map((f) => ({
                file_name: f.file?.name,
                file_content: f.file_content,
            })),
        ]);
    };

    const removeExistingAttachment = (attachmentId) => {
        const updatedAttachments = existingAttachments.filter((att) => att.id !== attachmentId);
        setExistingAttachments(updatedAttachments);

        // Update attachments without the removed attachment
        setValue("attachments", [
            ...updatedAttachments.map((att) => att.id), // Send remaining existing attachments as IDs
            ...files.map((f) => ({
                file_name: f.file?.name,
                file_content: f.file_content,
            })),
        ]);
    };

    return (
        <div className="xl:col-span-3 col-span-12">
            <div className="box bg-primary">
                <div className="flex items-start bg-primary p-4 rounded-xl shadow-md">
                    <span className="avatar avatar-xl avatar-rounded mr-4">
                        <img src={face5} alt="Profile" className="rounded-full w-16 h-16"/>
                    </span>
                    <div className="flex-grow text-white">
                        <h6 className="font-semibold text-lg mb-1">
                            {serviceData?.reporter_user?.full_name || currentUser?.full_name}
                        </h6>
                        <p className="opacity-70 mb-1">
                            {serviceData?.reporter_user?.company?.name || currentUser?.company?.name}
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
                <div className="box-body p-4">
                    {/* Existing Attachments */}
                    {existingAttachments.map((attachment) => (
                        <div
                            key={attachment.id}
                            className="flex items-center justify-between bg-gray-100 rounded-md mb-3"
                        >
                            <span className="flex-grow py-1 px-2">{attachment.file_name}</span>
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

                    {/* New Files */}
                    {files.map((fileEntry, index) => (
                        <div
                            key={fileEntry.id}
                            className="flex items-center justify-between bg-gray-100 rounded-md mb-3"
                        >
                            <input
                                type="file"
                                className="flex-grow border-none rounded-l-md mr-2 py-1"
                                onChange={(event) => handleFileChange(event, index)}
                            />
                            <div className="flex items-center rounded-r-md">
                                <i
                                    className="ri-eye-fill text-success mr-2 cursor-pointer"
                                    onClick={() => {
                                        if (fileEntry.file) {
                                            const url = URL.createObjectURL(fileEntry.file);
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

                    {/* Add New File */}
                    <div className="flex justify-start w-20">
                        <i
                            className="bi bi-plus-square text-success px-3 py-2 rounded-md cursor-pointer hover:bg-success-dark"
                            onClick={addFileInput}
                        ></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceRequestCard;
