import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { Layers } from "lucide-react";
import React, { useMemo, useCallback } from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import Avatar from "@components/Avatar.jsx";
import { ArrowRight } from "lucide-react";
import { useApprovalSetupModel, useUploadApprovalSetupModal } from "@modules/hrms/hooks/useApprovalSetupModal.js";
import FormApprovalSetupModal from "@modules/forms/components/modals/DynamicFormsApprovalSetupModal.jsx";
import DynamiceFormUploadModal from "@modules/forms/components/modals/DynamiceFormUploadModel.jsx";

const MemoizedAvatar = React.memo(Avatar);

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

const DynamicFormsApprovalSetup = () => {
    const dataTableRef = React.useRef();

    const refetchCallback = useCallback(() => {
        dataTableRef.current?.refetch();
    }, []);

    const uploadApprovalSetupModel = useUploadApprovalSetupModal(refetchCallback);
    const approvalSetupModel = useApprovalSetupModel(refetchCallback);

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

    const handleOpenModal = useCallback((id = null, isEdit = false) => {
        openModal(id, isEdit);
    }, [openModal]);

    const handleOpenAddModal = useCallback(() => {
        openModal(null, false);
    }, [openModal]);

    const columns = useMemo(() => [
        {
            Header: 'Form',
            accessor: 'form',
            disableSortBy: true,
            filterable: true,
            filterType: 'text',
            filterKey: 'form__name',
            // Cell: ({ row }) => <FormCell form={row.original.form} />
        },
        {
            Header: 'Hierarchy',
            accessor: 'approvers',
            disableSortBy: true,
            width: 300,
            filterable: true,
            filterType: 'text',
            filterKey: 'approvers__full_name',
            Cell: ({ row }) => <HierarchyCell approvers={row.original.approvers || []} />
        },
        {
            Header: 'Actions',
            accessor: 'id',
            disableSortBy: true,
            filterable: false,
            Cell: ({ value }) => <ActionCell id={value} onEdit={handleOpenModal} />
        },
    ], [handleOpenModal]);

    const buttons = useMemo(() => (
        <div className="flex space-x-2">
            <button
                type="button"
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                onClick={handleOpenAddModal}
            >
                <i className="ri-add-line font-semibold align-middle"></i>
            </button>
        </div>
    ), [handleOpenAddModal, openUploadModal]);

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
                heading="Dynamic Forms Approval hierarchy"
                description="Set up and manage multi-level approval workflows for forms, assigning users to each level dynamically."
                icon={Layers}
            />
            <DataTable
                ref={dataTableRef}
                columns={columns}
                apiUrl="/hrms/setups/approval-hierarchy/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
                buttons={buttons}
            />

            <FormApprovalSetupModal {...modalProps} />

            {isUploadModalOpen && (
                <DynamiceFormUploadModal {...uploadModalProps} />
            )}
        </>
    );
};

export default React.memo(DynamicFormsApprovalSetup);
