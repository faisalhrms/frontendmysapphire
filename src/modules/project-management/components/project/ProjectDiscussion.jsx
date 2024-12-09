// import React, {useEffect, useState} from 'react';
// import MediaModal from "@components/MediaModal.jsx";
// import Avatar from "@components/Avatar.jsx";
// import AttachmentsList from "@components/AttachmentsList";
// import { useFileModal } from "@hooks/useFileModal";
// import LoadingSpinner from "@components/LoadingSpinner.jsx";
// import PerfectScrollbar from "react-perfect-scrollbar";
// import ProjectDiscussionItem from "@modules/project-management/components/project/ProjectDiscussionItem.jsx";
// import { useSelector } from "react-redux";
// import { storeProjectDiscussion } from "@modules/project-management/services/projectService.js";
// import {useProjectDiscussions} from "@modules/project-management/hooks/projectHooks.js";
// import Notify from "@helpers/toastNotifications.js";
//
// const ProjectDiscussion = ({ projectId }) => {
//     const { discussions: initialDiscussions = [], isLoading, refetch } = useProjectDiscussions(projectId);
//     const { user } = useSelector((state) => state.auth);
//     const [message, setMessage] = useState("");
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [discussions, setDiscussions] = useState(initialDiscussions || []);
//     const {
//         isModalOpen,
//         openModal,
//         closeModal,
//         selectedIds,
//         attachments,
//         handleSelectedFiles,
//         handleDeleteAttachment,
//         mediaType,
//         clearAttachments
//     } = useFileModal('discussionAttachments');
//
//     useEffect(() => {
//         setDiscussions(initialDiscussions || []);
//     }, [initialDiscussions]);
//
//     const handleSubmit = async () => {
//         if (!message.trim()) {
//             Notify.error('Message is required')
//             return;
//         }
//         try {
//             setIsSubmitting(true);
//             const newDiscussion = await storeProjectDiscussion(projectId, { message, attachment_ids: selectedIds });
//             setDiscussions((prevDiscussions) => {
//                 const discussionsArray = Array.isArray(prevDiscussions) ? prevDiscussions : [];
//                 return [...discussionsArray, newDiscussion];
//             });
//             clearAttachments();
//             setMessage("");
//         } catch (error) {
//             console.error("Error posting discussion:", error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
//
//     return (
//         <>
//             <div className="box">
//                 <div className="box-header">
//                     <div className="box-title">Project Discussions</div>
//                 </div>
//                 {isLoading ? (
//                     <LoadingSpinner />
//                 ) : (
//                     <>
//                         <PerfectScrollbar
//                             className="box-body max-h-72 text-defaulttextcolor text-defaultsize !py--10 !px-4 ps--active-y">
//                             <ul className="list-none profile-timeline">
//                                 {
//                                     discussions.length > 0 &&
//                                     (
//                                         discussions?.map((discussion) => (
//                                             <ProjectDiscussionItem
//                                                 key={discussion.id}
//                                                 discussion={discussion}
//                                                 userId={user.id}
//                                             />
//                                         ))
//                                     )
//                                 }
//                             </ul>
//                         </PerfectScrollbar>
//                         <div className='box-footer'>
//                             <div className="!p-0 !border-0">
//                                 <div className="grid grid-cols-12 gap-4">
//                                     <AttachmentsList attachments={attachments} onDelete={handleDeleteAttachment} />
//                                 </div>
//                                 <div className="sm:flex items-center leading-none mt-1">
//                                     <div className="me-4">
//                                         <Avatar avatar={user.avatar} size='md' />
//                                     </div>
//                                     <div className="flex-grow me-2">
//                                         <div className="inline-flex !w-full">
//                                             <input
//                                                 type="text"
//                                                 className="form-control w-full !rounded-e-none"
//                                                 placeholder="Post Anything"
//                                                 aria-label="Discussion message input"
//                                                 value={message}
//                                                 onChange={(e) => setMessage(e.target.value)}
//                                                 onKeyDown={(e) => {
//                                                     if (e.key === 'Enter') {
//                                                         e.preventDefault();
//                                                         handleSubmit();
//                                                     }
//                                                 }}
//                                             />
//                                             <button onClick={() => openModal('document')}
//                                                     aria-label="button" type="button"
//                                                     className="ti-btn ti-btn-light !rounded-none !mb-0"><i
//                                                 className="bi bi-paperclip"></i></button>
//                                             <button onClick={() => openModal('image')} aria-label="button"
//                                                     type="button"
//                                                     className="ti-btn ti-btn-light !rounded-none !mb-0"><i
//                                                 className="bi bi-camera"></i></button>
//                                             <button
//                                                 disabled={isSubmitting}
//                                                 onClick={handleSubmit}
//                                                 className="ti-btn bg-primary text-white !rounded-s-none !mb-0"
//                                                 type="button">Post
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//             {
//                 isModalOpen && (
//                     <MediaModal type={mediaType} modalId='discussionAttachments' multiple={true} onClose={closeModal}
//                                 selectedFiles={handleSelectedFiles} />
//                 )}
//         </>
//     );
// };
//
// export default ProjectDiscussion;