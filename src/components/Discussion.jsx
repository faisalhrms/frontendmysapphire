import React, { useState, useRef } from "react";
import MediaModal from "@components/MediaModal.jsx";
import Avatar from "@components/Avatar.jsx";
import AttachmentsList from "@components/AttachmentsList";
import { useFileModal } from "@hooks/useFileModal";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PerfectScrollbar from "react-perfect-scrollbar";
import ProjectDiscussionItem from "@modules/project-management/components/project/ProjectDiscussionItem.jsx";
import { useSelector } from "react-redux";
import useDiscussion from "@hooks/useDiscussionHook.js";

const Discussion = ({ title = "Discussions", getEndPoint, storeEndPoint, users = [] }) => {
    const { user } = useSelector((state) => state.auth);
    const { isModalOpen, openModal, closeModal, selectedIds, attachments, handleSelectedFiles, handleDeleteAttachment, mediaType, clearAttachments } = useFileModal('discussionAttachments');
    const { discussions, isLoading, message, setMessage, isSubmitting, refetch, handleSubmit } = useDiscussion(selectedIds, clearAttachments, getEndPoint, storeEndPoint);

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const dropdownRef = useRef();

    const handleInputChange = (e) => {
        const input = e.target.value;
        setMessage(input);

        if (input.includes("@")) {
            const query = input?.split("@")?.pop()?.toLowerCase();

            const filteredUsers = users?.filter(
                (u) =>
                    u?.email?.toLowerCase()?.includes(query) || u?.name?.toLowerCase()?.includes(query)
            );
            console.log(filteredUsers);
            setSuggestions(filteredUsers);
            setShowSuggestions(filteredUsers.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (email) => {
        const parts = message.split("@");
        const beforeAt = parts.slice(0, -1).join("@");
        setMessage(`${beforeAt}${email} `);
        setShowSuggestions(false);
    };

    return (
        <div className="box">
            <div className="box-header">
                <div className="box-title">{title}</div>
                <div className="flex items-center space-x-2">
                    <div className="flex space-x-2">
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
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div>
                    <PerfectScrollbar className="box-body max-h-72 text-defaulttextcolor text-defaultsize !py--10 !px-4 ps--active-y">
                        <ul className="list-none profile-timeline">
                            {discussions?.length > 0 &&
                                discussions.map((discussion) => (
                                    <ProjectDiscussionItem key={discussion.id} discussion={discussion} userId={user.id} />
                                ))}
                        </ul>
                    </PerfectScrollbar>
                    <div className="box-footer">
                        <div className="!p-0 !border-0">
                            <div className="grid grid-cols-12 gap-4">
                                <AttachmentsList attachments={attachments} onDelete={handleDeleteAttachment} />
                            </div>
                            <div className="sm:flex items-center leading-none mt-1">
                                <div className="me-4">
                                    <Avatar avatar={user.avatar} size="md" />
                                </div>
                                <div className="flex-grow me-2">
                                    <div className="relative inline-flex !w-full">
                                        <input
                                            type="text"
                                            className="form-control w-full !rounded-e-none"
                                            placeholder="Post Anything"
                                            aria-label="Discussion message input"
                                            value={message}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleSubmit();
                                                }
                                            }}
                                            ref={dropdownRef}
                                        />
                                        {showSuggestions && (
                                            <div
                                                className={`absolute bg-white shadow-lg rounded-md z-10 max-h-32 w-72 overflow-y-auto top-full mt-2`}
                                            >
                                                {suggestions.length > 0 ? (
                                                    suggestions.map((user) => (
                                                        <div
                                                            key={user.id}
                                                            className="flex items-center p-2 cursor-pointer hover:bg-gray-100 text-sm"
                                                            onClick={() => handleSuggestionClick(user.email)}
                                                        >
                                                            <Avatar avatar={user.avatar} size="sm" />
                                                            <div className="ml-2">
                                                                <div className="font-semibold">{user.name}</div>
                                                                <div className="text-gray-500">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-2 text-gray-500 text-sm">
                                                        No users found.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => openModal("document")}
                                            aria-label="button"
                                            type="button"
                                            className="ti-btn ti-btn-light !rounded-none !mb-0"
                                        >
                                            <i className="bi bi-paperclip"></i>
                                        </button>
                                        <button
                                            onClick={() => openModal("image")}
                                            aria-label="button"
                                            type="button"
                                            className="ti-btn ti-btn-light !rounded-none !mb-0"
                                        >
                                            <i className="bi bi-camera"></i>
                                        </button>
                                        <button
                                            disabled={isSubmitting}
                                            onClick={handleSubmit}
                                            className="ti-btn bg-primary text-white !rounded-s-none !mb-0"
                                            type="button"
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && (
                <MediaModal
                    type={mediaType}
                    modalId="discussionAttachments"
                    multiple={true}
                    onClose={closeModal}
                    selectedFiles={handleSelectedFiles}
                />
            )}
        </div>
    );
};

export default Discussion;
