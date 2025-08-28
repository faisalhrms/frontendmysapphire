import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { Layers } from "lucide-react";
import React, { useMemo, useCallback } from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import Avatar from "@components/Avatar.jsx";
import { ArrowRight } from "lucide-react";
import DynamicFormsApprovalSetupModal from "@modules/forms/components/modals/DynamicFormsApprovalSetupModal.jsx";
import {useFormApprovalSetupModel} from "@modules/forms/hooks/useFormApprovalSetupModal.js";

const MemoizedAvatar = React.memo(Avatar);

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
    } = useFormApprovalSetupModel(dataTableRef);

    const handleOpenModal = useCallback((id = null, isEdit = false) => {
        openModal(id, isEdit);
    }, [openModal]);

    const handleOpenAddModal = useCallback(() => {
        openModal(null, false);
    }, [openModal]);

    const columns = useMemo(() => [
        {
            Header: 'Form',
            accessor: 'title',
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
    ), [handleOpenAddModal]);

    const modalProps = useMemo(() => ({
        control,
        errors,
        closeModal,
        handleSubmit,
        onSubmit,
        isSubmitting,
        setValue
    }), [
        control,
        errors,
        closeModal,
        handleSubmit,
        onSubmit,
        isSubmitting,
        setValue
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
                apiUrl="/forms/setups/approval-hierarchy/datatable/"
                needHeader={false}
                enableAdvancedFilters={false}
                buttons={buttons}
            />

            <DynamicFormsApprovalSetupModal {...modalProps} />
        </>
    );
};

export default React.memo(DynamicFormsApprovalSetup);
