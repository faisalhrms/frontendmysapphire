import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import Pagination from "@components/Pagination.jsx";
import TaskApprovalCard from "@modules/approvals/task/views/TaskApprovalCard.jsx";
import { useState } from "react";
import {useTaskApprovalForm, useTaskApprovals} from "@modules/approvals/task/hooks/taskApprovalHooks.js";
import AlertModal from "@components/AlertModal.jsx";

const TaskApprovalList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, refetch } = useTaskApprovals(currentPage, 6);
    const totalPages = Math.ceil(data?.total / 8) || 0;
    const { handleTaskApprovalSubmit } = useTaskApprovalForm();
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const [selectedId, setSelectedId] = useState(null);
    const [actionType, setActionType] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getModalType = (actionType) => {
        switch (actionType) {
            case "approved":
                return "success";
            case "changes_suggested":
                return "primary";
            case "rejected":
                return "danger";
            default:
                return "secondary";
        }
    };

    const getModalTitle = (actionType) => {
        switch (actionType) {
            case "approved":
                return "Approve Task";
            case "rejected":
                return "Reject Task";
            case "changes_suggested":
                return "Suggest Changes";
            default:
                return "Confirm Action";
        }
    };

    const getModalMessage = (actionType) => {
        switch (actionType) {
            case "approved":
                return "Are you sure you want to approve this task?";
            case "rejected":
                return "Are you sure you want to reject this task?";
            case "changes_suggested":
                return "Are you sure you want to suggest changes to this task?";
            default:
                return "Are you sure you want to proceed with this action?";
        }
    };

    const getModalButtonText = (actionType) => {
        switch (actionType) {
            case "approved":
                return "Approve";
            case "rejected":
                return "Reject";
            case "changes_suggested":
                return "Suggest";
            default:
                return "Confirm";
        }
    };

    const handleActionClick = (id, type) => {
        setSelectedId(id);
        setActionType(type);
        setIsModalOpen(true);
    };

    const handleSubmit = async (comments) => {
        setIsSubmitting(true);
        try {
           await handleTaskApprovalSubmit(selectedId, actionType, comments);
            setIsModalOpen(false);
            refetch();
        } catch (error) {
            console.error("Action failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <PageHeader currentpage="Tasks Approvals" mainpage="Approvals" />
            <div className="grid grid-cols-12 gap-x-6">
                {isLoading ? (
                    <div className="col-span-12">
                        <LoadingSpinner />
                    </div>
                ) : (
                    data?.rows?.map((approval) => (
                        <div className="xxl:col-span-4 xl:col-span-4 md:col-span-6 col-span-12" key={approval.id}>
                            <TaskApprovalCard
                                key={approval.id}
                                approval={approval}
                                onApprove={() => handleActionClick(approval.id, "approved")}
                                onSuggestion={() => handleActionClick(approval.id, "changes_suggested")}
                                onReject={() => handleActionClick(approval.id, "rejected")}
                            />
                        </div>
                    ))
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginationDisabled={isLoading}
                onPageChange={handlePageChange}
            />

            {selectedId && (
                <AlertModal
                    id="task-approval"
                    isOpen={isModalOpen}
                    type={getModalType(actionType)}
                    title={getModalTitle(actionType)}
                    message={getModalMessage(actionType)}
                    btnTxt={getModalButtonText(actionType)}
                    isSubmitting={isSubmitting}
                    needInput={true}
                    inputLabel="Comments"
                    onConfirm={handleSubmit}
                    onClose={setIsModalOpen}
                />
            )}
        </>
    );
};

export default TaskApprovalList;
