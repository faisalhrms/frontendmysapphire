import '@assets/css/custom/file-upload.css';
import React from 'react';
import HiddenFormInput from '@components/form/HiddenFormInput.jsx';
import MediaModal from '@components/MediaModal.jsx';
import { generateFile } from "@helpers/media.js";
import FileSvg from "@components/FileSvg.jsx";
import { isEmptyObject } from "@helpers/validations.js";
import { useFileModal } from '@hooks/useFileModal';

const FileUpload = ({
                        type = 'image',
                        modalId = 'fileUploadModal',
                        inputName = 'avatar_id',
                        currentValue = null,
                        file = {},
                        control,
                        errors,
                    }) => {
    const {
        isModalOpen,
        openModal,
        closeModal,
        selectedIds,
        attachments,
        handleSelectedFiles,
        handleDeleteAttachment
    } = useFileModal(modalId, false, currentValue ? [currentValue] : [], [file]);

    return (
        <>
            <div className="img-upload-box">
                <div className={`img-upload-box-body bg-slate-200 text-center border dark:border-defaultborder/10 ${selectedIds.length ? `active` : ``}`}>
                    {!selectedIds.length ? (
                        <div className="p-4 text-center border-b border-dashed dark:border-defaultborder/10">
                            <FileSvg />
                            <button
                                className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                                type="button"
                                onClick={() => openModal(type)}
                            >
                                {attachments[0]?.file_name ? 'Change File' : 'Upload'}
                            </button>
                        </div>
                    ) : (
                        <>
                            {attachments[0] && !isEmptyObject(attachments[0]) && (
                                <span dangerouslySetInnerHTML={{ __html: generateFile(attachments[0]) }} />
                            )}
                            <div className="actions">
                                <button
                                    aria-label="edit"
                                    className="ti-btn ti-btn-icon ti-btn-primary-full ti-btn-wave"
                                    type="button"
                                    onClick={() => openModal(type)}
                                >
                                    <i className="bx bx-edit"></i>
                                </button>
                                <button
                                    aria-label="delete"
                                    className="ti-btn ti-btn-icon ti-btn-danger-full ti-btn-wave edit"
                                    type="button"
                                    onClick={() => handleDeleteAttachment(selectedIds[0])}
                                >
                                    <i className="bx bx-trash"></i>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <HiddenFormInput
                name={inputName}
                control={control}
                errors={errors}
                value={selectedIds[0] || null}
                valueType='number'
            />

            {isModalOpen && (
                <MediaModal
                    type={type}
                    modalId={modalId}
                    multiple={false}
                    onClose={closeModal}
                    selectedFiles={handleSelectedFiles}
                />
            )}
        </>
    );
};

export default FileUpload;
