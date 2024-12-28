import React, {useState} from "react";
import MediaModal from "@components/MediaModal.jsx";
import Avatar from "@components/Avatar.jsx";
import AttachmentsList from "@components/AttachmentsList";
import {useFileModal} from "@hooks/useFileModal";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PerfectScrollbar from "react-perfect-scrollbar";
import {useSelector} from "react-redux";
import useDiscussion from "@hooks/useDiscussionHook.js";
import {useForm} from "react-hook-form";
import SRDiscussionItem from "@modules/sr-management/component/SRDiscussionItem.jsx";
import EmailComposeModal from "@modules/sr-management/component/EmailComposeModal.jsx";

const SRDiscussion = ({title, getEndPoint, storeEndPoint = getEndPoint, serviceRequest}) => {
    const {user} = useSelector((state) => state.auth);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const {control, formState: {errors}} = useForm();
    const {
        isModalOpen,
        openModal,
        closeModal,
        selectedIds,
        attachments,
        handleSelectedFiles,
        handleDeleteAttachment,
        mediaType,
        clearAttachments,
    } = useFileModal("discussionAttachments");
    const {
        discussions,
        isLoading,
        message,
        setMessage,
        isSubmitting,
        refetch,
        handleSubmit,
    } = useDiscussion(selectedIds, clearAttachments, getEndPoint, storeEndPoint);
    const handleOpenEmailModal = () => {
        setIsEmailModalOpen(true);
    };
    const handleCloseEmailModal = () => {
        setIsEmailModalOpen(false);
    };
    return (
        <div className="box">
            <div className="box-header">
                <div className="box-title">{title || "Discussions"}</div>
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={refetch}
                        disabled={isLoading || isSubmitting}
                        className="hs-dropdown-toggle ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]"
                    >
                        <i className="ri-refresh-line font-semibold align-middle"></i> Refresh
                    </button>
                </div>
            </div>
            {isLoading ? (
                <LoadingSpinner/>
            ) : (
                <>
                    <PerfectScrollbar
                        className="box-body max-h-72 text-defaulttextcolor text-defaultsize !py--10 !px-4 ps--active-y">
                        <ul className="list-none profile-timeline">
                            {discussions?.length > 0 &&
                                discussions.map((discussion) => (
                                    <SRDiscussionItem
                                        key={discussion.id}
                                        discussion={discussion}
                                        userId={user?.id}
                                        control={control}
                                        errors={errors}
                                    />
                                ))}
                        </ul>
                    </PerfectScrollbar>
                    <div className="box-footer">
                        <div className="!p-0 !border-0">
                            <div className="grid grid-cols-12 gap-4">
                                <AttachmentsList
                                    attachments={attachments}
                                    onDelete={handleDeleteAttachment}
                                />
                            </div>
                            <div className="sm:flex items-center leading-none mt-1">
                                <div className="me-4">
                                    <Avatar avatar={user?.avatar} size="md"/>
                                </div>
                                <div className="flex-grow me-2">
                                    <div className="inline-flex !w-full">
                                        <input
                                            type="text"
                                            className="form-control w-full !rounded-e-none"
                                            placeholder="Post Anything"
                                            aria-label="Discussion message input"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleSubmit();
                                                }
                                            }}
                                        />
                                        <button
                                            disabled={isSubmitting}
                                            onClick={handleSubmit}
                                            className="ti-btn bg-primary text-white !rounded-s-none !ml-1 !mb-0"
                                            type="button"
                                        >
                                            Post
                                        </button>
                                        <button
                                            type="button"
                                            className="ti-btn ti-btn-primary-full !ml-1"
                                            onClick={handleOpenEmailModal}
                                        >
                                            <i className="bi bi-envelope-check font-semibold align-middle"></i>
                                            Email
                                        </button>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <EmailComposeModal
                isOpen={isEmailModalOpen}
                serviceRequest={serviceRequest}
                onClose={handleCloseEmailModal}
            />
        </div>
    );
};

export default SRDiscussion;
