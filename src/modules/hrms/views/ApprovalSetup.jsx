import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {CalendarRange} from "lucide-react";
import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import {useYearSetupModal} from "@modules/hrms/hooks/useYearSetupModal.js";
import DynamicDropdownChain from "@modules/hrms/components/modals/ApprovalSetupModel.jsx";
import Avatar from "@components/Avatar.jsx";
import { ArrowRight } from "lucide-react";

const ApprovalSetup = () => {
    const dataTableRef = React.useRef();
    const columns = [
        {
            Header: 'Name',
            accessor: 'user.full_name',
            Cell: ({ row }) => {
                const user = row.original.user
                return (
                    <div className="flex items-center">
                        <Avatar
                            avatar={user.avatar ? user.avatar : null}
                            full_name={user.full_name || 'N/A'}
                            size='md'
                            parentClasses='dark:text-gray-200 dark:bg-bodybg'
                        />
                        <div className='ms-2'>
                            <p className="font-semibold mb-0 flex items-center">
                                {user.full_name || 'N/A'}
                            </p>
                            <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                {user?.email || 'N/A'}
                            </p>
                        </div>
                    </div>
                )
            }
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
            Cell: ({ row }) => {
                const approvers = row.original.approvers || [];

                return (
                    <div className="flex items-center gap-1 flex-wrap">
                        {approvers.map((user, index) => (
                            <React.Fragment key={user.approver.id || index}>
                                <Avatar
                                    avatar={user.approver.avatar || null}
                                    full_name={user.approver.full_name || 'N/A'}
                                    size="sm"
                                    parentClasses="dark:text-gray-200 dark:bg-bodybg"
                                />
                                {index < approvers.length - 1 && (
                                    <ArrowRight className="mx-1 text-gray-700 w-2 h-2" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                );
            }
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
            Cell: ({ value }) => (
                <div className="flex space-x-2">
                    <button
                        className="ti-btn ti-btn-primary ti-btn-sm"
                        title="Edit User"
                        onClick={() => openModal(value, true)}
                    >
                        <i className="ri-edit-line"></i>
                    </button>
                </div>
            ),

        },
    ]

    const {
        openModal,
        closeModal,
        control,
        errors,
        isSubmitting,
        handleSubmit,
        onSubmit,
        isEditMode,
    } = useYearSetupModal(() => dataTableRef.current?.refetch());

    const buttons = (
        <div className="flex space-x-2">
            <button
                type="button"
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                onClick={() => openModal()}
            >
                <i className="ri-add-line font-semibold align-middle"></i>
            </button>
        </div>
    );
    return (
        <>
            <IconPageHeader
                heading="Approval Setup"
                description="Configure fiscal or operational year settings in the PMS."
                icon={CalendarRange}
            />
            <DataTable
                ref={dataTableRef}
                columns={columns}
                apiUrl="/hrms/setups/approval-hierarchy/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
                buttons={buttons}
            />

            <DynamicDropdownChain
                control={control}
                errors={errors}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                closeModal={closeModal}
                isEditMode={isEditMode}
            />

        </>
    );
};

export default ApprovalSetup;
