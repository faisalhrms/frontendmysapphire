import React, { useRef } from "react";
import { FileCheck2 } from "lucide-react";
import { Link } from "react-router-dom";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatDate } from "@helpers/dateTime.js";
import AlertModal from "@components/AlertModal.jsx";
import UserWithAvatar from "@components/UserWithAvatar.jsx";
import useGlobalApproval from "@modules/approvals/global/hooks/useGlobalApproval.js";


const GlobalApprovalList = () => {
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
    } = useGlobalApproval(() => {
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
                        onClick={() =>
                            handleActionClick(row.original.id, "approved", row.original.approval_type.label)
                        }
                        className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-emerald-500 hover:bg-emerald-600"
                        title="Approve"
                    >
                        Approve
                    </button>

                    <button
                        onClick={() =>
                            handleActionClick(row.original.id, "rejected", row.original.approval_type.label)
                        }
                        className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-rose-500 hover:bg-rose-600"
                        title="Reject"
                    >
                        Reject
                    </button>

                    <Link
                        to={row.original.detail_url}
                        className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-primary hover:bg-primary"
                        title="View"
                    >
                        View
                    </Link>
                </div>

            ),
        },
        {
            Header: "Approval Type",
            accessor: "approval_type.label",
        },
        {
            Header: "Requester",
            accessor: "requester",
            Cell: ({value}) => (
                <UserWithAvatar user={value}/>
            ),
        },
        {
            Header: "Created At",
            accessor: "created_at",
            Cell: ({value}) => formatDate(value),
        },
    ];

    return (
        <>
            <IconPageHeader
                heading="Global Approvals"
                description="Approve or Reject Approval."
                icon={FileCheck2}
            />

            <DataTable
                ref={dataTableRef}
                columns={columns}
                apiUrl="/approvals/request/"
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

export default GlobalApprovalList;
