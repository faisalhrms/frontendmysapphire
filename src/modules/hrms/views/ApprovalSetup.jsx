import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Pyramid} from "lucide-react";
import React, { useMemo, useCallback } from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import Avatar from "@components/Avatar.jsx";
import { ArrowRight } from "lucide-react";
import {useApprovalSetupModel, useUploadApprovalSetupModal} from "@modules/hrms/hooks/useApprovalSetupModal.js";
import ApprovalSetupModal from "@modules/hrms/components/modals/ApprovalSetupModal.jsx";
import UploadModal from "@modules/hrms/components/modals/UploadModel.jsx";

// Memoized Avatar component to prevent unnecessary re-renders
const MemoizedAvatar = React.memo(Avatar);

// Memoized cell components
const UserCell = React.memo(({ user }) => (
    <div className="flex items-center">
        <MemoizedAvatar
            avatar={user?.avatar || null}
            full_name={user?.full_name || 'N/A'}
            size='md'
            parentClasses='dark:text-gray-200 dark:bg-bodybg'
        />
        <div className='ms-2'>
            <p className="font-semibold mb-0 flex items-center">
                {user?.full_name || 'N/A'}
            </p>
            <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                {user?.email || 'N/A'}
            </p>
        </div>
    </div>
));

UserCell.displayName = 'UserCell';

const HierarchyCell = React.memo(({ approvers }) => (
    <div className="flex items-center gap-1 flex-wrap">
        {approvers.map((approver, index) => (
            <React.Fragment key={approver.id || index}>
                <MemoizedAvatar
                    avatar={approver.avatar || null}
                    full_name={approver.full_name || 'N/A'}
                    size="sm"
                    parentClasses="dark:text-gray-200 dark:bg-bodybg"
                />
                {index < approvers.length - 1 && (
                    <ArrowRight className="mx-1 text-gray-700 w-2 h-2" />
                )}
            </React.Fragment>
        ))}
    </div>
));

HierarchyCell.displayName = 'HierarchyCell';

const ActionCell = React.memo(({ id, onEdit }) => (
    <div className="flex space-x-2">
        <button
            className="ti-btn ti-btn-primary ti-btn-sm"
            title="Edit User"
            onClick={() => onEdit(id, true)}
        >
            <i className="ri-edit-line"></i>
        </button>
    </div>
));

ActionCell.displayName = 'ActionCell';

const ApprovalSetup = () => {
    const dataTableRef = React.useRef();

    // Memoized refetch callback
    const refetchCallback = useCallback(() => {
        dataTableRef.current?.refetch();
    }, []);

    // Upload modal hook
    const uploadApprovalSetupModel = useUploadApprovalSetupModal(refetchCallback);

    // Main approval setup hook with drag and drop functionality
    const approvalSetupModel = useApprovalSetupModel(refetchCallback);

    // Destructure all needed properties from the main hook
    const {
        openModal,
        closeModal,
        control,
        errors,
        isSubmitting,
        handleSubmit,
        onSubmit,
        isEditMode,
        setValue,
        moveApprover,
        addApprover,
        removeApprover,
    } = approvalSetupModel;

    // Destructure upload modal properties
    const {
        openUploadModal,
        isUploadModalOpen,
        control: uploadControl,
        errors: uploadErrors,
        isSubmitting: uploadIsSubmitting,
        handleSubmit: uploadHandleSubmit,
        onSubmit: uploadOnSubmit,
        closeUploadModal
    } = uploadApprovalSetupModel;

    // Memoize the openModal callbacks
    const handleOpenModal = useCallback((id = null, isEdit = false) => {
        openModal(id, isEdit);
    }, [openModal]);

    const handleOpenAddModal = useCallback(() => {
        openModal(null, false);
    }, [openModal]);

    // Memoize columns to prevent recreation on every render
    const columns = useMemo(() => [
        {
            Header: 'Name',
            accessor: 'user.full_name',
            Cell: ({ row }) => <UserCell user={row.original.user} />
        },
        {
            Header: 'Designation',
            accessor: 'user.designation',
        },
        {
            Header: 'Position',
            accessor: 'user.position',
        },
        {
            Header: 'Department',
            accessor: 'user.department',
        },
        {
            Header: 'Hierarchy',
            accessor: 'approvers',
            Cell: ({ row }) => <HierarchyCell approvers={row.original.approvers || []} />
        },
        {
            Header: 'Type',
            accessor: 'type',
            getCellProps: (cellInfo) => {
                const value = cellInfo.value;
                let bgClass = "";
                if (value.includes("objective")) {
                    bgClass = "bg-success";
                } else {
                    bgClass = "bg-primary";
                }
                return {
                    className: `text-white ${bgClass}`,
                };
            },
        },
        {
            Header: 'Actions',
            accessor: 'id',
            disableSortBy: true,
            Cell: ({ value }) => <ActionCell id={value} onEdit={handleOpenModal} />
        },
    ], [handleOpenModal]);

    // Memoize buttons to prevent recreation
    const buttons = useMemo(() => (
        <div className="flex space-x-2">
            <button
                type="button"
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                onClick={handleOpenAddModal}
            >
                <i className="ri-add-line font-semibold align-middle"></i>
            </button>
            <button
                type="button"
                className="hs-dropdown-toggle ti-btn ti-btn-secondary-full !py-1 !px-2 !text-[0.75rem]"
                onClick={openUploadModal}
            >
                <i className="ri-upload-2-line font-semibold align-middle"></i>
                <span className="ms-1">Upload</span>
            </button>
        </div>
    ), [handleOpenAddModal, openUploadModal]);

    // Memoize modal props to prevent unnecessary re-renders
    const modalProps = useMemo(() => ({
        control,
        errors,
        closeModal,
        handleSubmit,
        onSubmit,
        isSubmitting,
        moveApprover,
        addApprover,
        removeApprover,
    }), [
        control,
        errors,
        closeModal,
        handleSubmit,
        onSubmit,
        isSubmitting,
        moveApprover,
        addApprover,
        removeApprover,
    ]);

    const uploadModalProps = useMemo(() => ({
        control: uploadControl,
        errors: uploadErrors,
        isSubmitting: uploadIsSubmitting,
        handleSubmit: uploadHandleSubmit,
        onSubmit: uploadOnSubmit,
        closeModal: closeUploadModal,
        heading: "Upload Approval Setup"
    }), [
        uploadControl,
        uploadErrors,
        uploadIsSubmitting,
        uploadHandleSubmit,
        uploadOnSubmit,
        closeUploadModal
    ]);

    return (
        <>
            <IconPageHeader
                heading="Approval hierarchy"
                description="Establish structured approval levels for users."
                icon={Pyramid}
            />
            <DataTable
                ref={dataTableRef}
                columns={columns}
                apiUrl="/hrms/setups/approval-hierarchy/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
                buttons={buttons}
            />

            {/* Main Approval Setup Modal with drag and drop functionality */}
            <ApprovalSetupModal {...modalProps} />

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <UploadModal {...uploadModalProps} />
            )}
        </>
    );
};

// Export memoized component
export default React.memo(ApprovalSetup);