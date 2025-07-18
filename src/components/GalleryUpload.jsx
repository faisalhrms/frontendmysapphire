import React, {useEffect} from 'react';
import MediaModal from "@components/MediaModal.jsx";
import "@assets/css/custom/gallery.css";
import HiddenFormInput from "@components/form/HiddenFormInput.jsx";
import { useFileModal } from "@hooks/useFileModal";
import AttachmentsList from "@components/AttachmentsList";
import ReactDOM from "react-dom";

const GalleryUpload = ({
                           btnTxt = 'Choose Attachments',
                           modalId = 'mediaModal',
                           inputName = 'attachment_ids',
                           placeholder = 'Attachments',
                           currentValue = [],
                           files = [],
                           control,
                           errors,
                           portal = false,
                           clearFiles = false
                       }) => {
    const {
        isModalOpen,
        openModal,
        closeModal,
        selectedIds,
        attachments,
        handleSelectedFiles,
        handleDeleteAttachment,
        mediaType,
        clearAttachments
    } = useFileModal(modalId, true, currentValue, files);

    useEffect(() => {
        if (clearFiles) {
            clearAttachments()
        }
    }, [clearFiles]);

    return (
        <>
            <div className="grid grid-cols-12 gap-4">
                <div className="xl:col-span-12 col-span-12">
                    {
                        placeholder &&
                        <div>
                            <label htmlFor={inputName} className="form-label">{placeholder}</label>
                        </div>
                    }
                    <button
                        onClick={openModal}
                        className={`ti-btn !py-1 !px-2 !text-[0.75rem] ${errors[inputName] ? 'ti-btn-danger-full' : 'ti-btn-primary-full'}`}
                        type="button"
                        aria-label={`Upload attachments`}
                    >
                        <i className="ri-image-add-fill"></i>{btnTxt}
                    </button>
                    <HiddenFormInput
                        name={inputName}
                        control={control}
                        errors={errors}
                        value={selectedIds}
                    />
                </div>
                <AttachmentsList attachments={attachments} onDelete={handleDeleteAttachment}/>
            </div>
            {isModalOpen && (
                 portal ?
                     ReactDOM.createPortal(
                         <MediaModal modalId={modalId} multiple={true} onClose={closeModal} selectedFiles={handleSelectedFiles}/>,
                         document.getElementById('modal-root'))
                     :
                     <MediaModal modalId={modalId} multiple={true} onClose={closeModal} selectedFiles={handleSelectedFiles}/>
            )}
        </>
    );
};

export default GalleryUpload;
