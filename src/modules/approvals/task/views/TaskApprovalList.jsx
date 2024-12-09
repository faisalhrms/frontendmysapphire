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
    const totalPages = Math.ceil(data?.total / 6) || 0;
    const { handleTaskApprovalSubmit } = useTaskApprovalForm();
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const [selectedId, setSelectedId] = useState(null);
    const [actionType, setActionType] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                    type={actionType === "approved" ? "success" : "danger"}
                    title={actionType === "approved" ? "Approve Task" : "Reject Task"}
                    message={`Are you sure you want to ${actionType} this task?`}
                    btnTxt={actionType === "approved" ? "Approve" : "Reject"}
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
