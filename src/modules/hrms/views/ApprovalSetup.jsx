import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Pyramid} from "lucide-react";
import React, { useMemo, useCallback } from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import Avatar from "@components/Avatar.jsx";
import { ArrowRight } from "lucide-react";
import {useApprovalSetupModel, useUploadApprovalSetupModal} from "@modules/hrms/hooks/useApprovalSetupModal.js";
import ApprovalSetupModal from "@modules/hrms/components/modals/ApprovalSetupModal.jsx";
import UploadModal from "@modules/hrms/components/modals/UploadModel.jsx";
import sampleFile from "@assets/files/pms_approval_upload_sample.xlsx";
import {equipmentStatuses} from "@modules/inventory/services/inventoryService.js";

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

const ApprovalSetup = () => {
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
            Header: 'Name',
            accessor: 'user.full_name',
            width: 300,
            filterable: true,
            filterType: 'text',
            filterKey: 'user__full_name',
            Cell: ({ row }) => <UserCell user={row.original.user} />
        },
        {
            Header: 'Designation',
            accessor: 'user.designation',
            filterable: true,
            filterType: 'text',
            filterKey: 'user__employee__designation__name',
        },
        {
            Header: 'Position',
            accessor: 'user.position',
            filterable: true,
            filterType: 'text',
            filterKey: 'user__employee__position__name',
        },
        {
            Header: 'Department',
            accessor: 'user.department',
            filterable: true,
            filterType: 'text',
            filterKey: 'user__employee__department__name',
        },
        {
            Header: 'Hierarchy',
            accessor: 'approvers',
            width: 300,
            filterable: true,
            filterType: 'text',
            filterKey: 'approvers__full_name',
            Cell: ({ row }) => <HierarchyCell approvers={row.original.approvers || []} />
        },
        {
            Header: 'Type',
            accessor: 'type',
            filterable: true,
            filterType: 'select',
            filterKey: 'type',
            filterOptions: [
                { value: 'objective', label: 'Objective' },
                { value: 'appraisal', label: 'Appraisal' },
            ],
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
            <a
                href={sampleFile}
                download="sample_upload_tasks_against_milestone.xlsx"
                className="hs-dropdown-toggle ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i class="ri-file-excel-2-line font-semibold align-middle"></i>
            </a>
            <button
                type="button"
                className="hs-dropdown-toggle ti-btn ti-btn-secondary-full !py-1 !px-2 !text-[0.75rem]"
                onClick={openUploadModal}
            >
                <i className="ri-upload-2-line font-semibold align-middle"></i>
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

            <ApprovalSetupModal {...modalProps} />

            {isUploadModalOpen && (
                <UploadModal {...uploadModalProps} />
            )}
        </>
    );
};

export default React.memo(ApprovalSetup);