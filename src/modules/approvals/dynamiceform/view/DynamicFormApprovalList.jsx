import React, { useRef } from "react";
import { FileCheck2 } from "lucide-react";
import { Link } from "react-router-dom";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatDate } from "@helpers/dateTime.js";
import AlertModal from "@components/AlertModal.jsx";
import Avatar from "@components/Avatar.jsx";
import useFormApproval from "@modules/approvals/dynamiceform/hooks/useFormApproval.js";


const DynamicFormApprovalList = () => {
    const dataTableRef = useRef();


    const {
        selectedId,
        actionType,
        isModalOpen,
        isSubmitting,
        getModalType,
        getModalTitle,
        getModalMessage,
        getModalButtonText,
        handleActionClick,
        handleSubmit,
        setIsModalOpen,
    } = useFormApproval(() => {
        dataTableRef.current?.refetch();
    });

    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,

            Cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleActionClick(row.original.id, "approved")}
                        className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-emerald-500 hover:bg-emerald-600"
                        title="Approve Objective"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => handleActionClick(row.original.id, "rejected")}
                        className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-rose-500 hover:bg-rose-600"
                        title="Reject Objective"
                    >
                        Reject
                    </button>

                    <Link
                        to={`/module/forms/detail/${row.original.id}`}
                        className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-primary hover:bg-primary"
                        title="Edit Form"
                    >
                        View
                    </Link>
                </div>

            ),
        },
        {
            Header: "Form",
            accessor: "form.title",
        },
        {
            Header: "Submitter",
            accessor: "created_by",
            Cell: ({value}) => (
                <div className="flex items-center">
                    <Avatar
                        avatar={value?.avatar || null}
                        full_name={value?.full_name || "N/A"}
                        size="md"
                        parentClasses="dark:text-gray-200 dark:bg-bodybg"
                    />
                    <div className="ms-2">
                        <p className="font-semibold text-slate-900 text-left dark:text-gray-200 ">{value?.full_name || "N/A"}</p>
                        <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                            {value?.email || "N/A"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            Header: "Created At",
            accessor: "created_at",
            Cell: ({ value }) => formatDate(value),
        },
    ];

    return (
        <>
            <IconPageHeader
                heading="Dynamic Form List"
                description="Manage and streamline multi-level form approval workflows with ease."
                icon={FileCheck2}
            />

            <DataTable
                ref={dataTableRef}
                columns={columns}
                apiUrl="/forms/que/approvals/"
                needHeader={false}
                enableAdvancedFilters={false}
            />


            {selectedId && (
                <AlertModal
                    id="objective-approval"
                    isOpen={isModalOpen}
                    type={getModalType(actionType)}
                    title={getModalTitle(actionType)}
                    message={getModalMessage(actionType)}
                    btnTxt={getModalButtonText(actionType)}
                    isSubmitting={isSubmitting}
                    needInput={true}
                    inputLabel="Remarks"
                    onConfirm={handleSubmit}
                    onClose={setIsModalOpen}
                />
            )}
        </>
    );
};

export default DynamicFormApprovalList;
