// src/modules/recruitment/components/JobDescList.jsx
import React, { useRef, useState } from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link } from "react-router-dom";
import JobDescFormModal from "@modules/requisition/models/JobDescFormModal.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { Shield } from "lucide-react";

async function deleteJobDescription(id) {
    const res = await fetch(`/job-descriptions/${id}/delete/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || `Delete failed with status ${res.status}`);
    }
    return true;
}

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "N/A");

const JobDescList = ({ externalFilters = [] }) => {
    const tableRef = useRef(null);

    // Modal states
    const [isJDModalOpen, setIsJDModalOpen] = useState(false);
    const [editingJD, setEditingJD] = useState(null);

    const openCreate = () => {
        setEditingJD(null);
        setIsJDModalOpen(true);
    };

    const openEdit = (row) => {
        // ✅ IMPORTANT: only pass id; modal will fetch detail via GET endpoint
        const id = row?.original?.id;
        setEditingJD(id ? { id } : null);
        setIsJDModalOpen(true);
    };

    const closeModal = () => setIsJDModalOpen(false);

    const handleSuccess = () => {
        tableRef.current?.refetch();
    };

    const onDelete = async (id) => {
        const ok = window.confirm("Are you sure you want to delete this Job Description?");
        if (!ok) return;
        try {
            await deleteJobDescription(id);
            tableRef.current?.refetch();
        } catch (e) {
            console.error(e);
            alert(e.message || "Delete failed");
        }
    };

    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <button
                        className="ti-btn ti-btn-primary ti-btn-sm"
                        title="Edit"
                        onClick={() => openEdit(row)}
                    >
                        <i className="ri-edit-line"></i>
                    </button>

                    <Link to={`/module/requisition/job-description/detail/${row.original.id}`}>
                        <button className="ti-btn ti-btn-info ti-btn-sm" title="View">
                            <i className="ri-eye-line"></i>
                        </button>
                    </Link>

                    <button
                        className="ti-btn ti-btn-danger ti-btn-sm"
                        onClick={() => onDelete(row.original.id)}
                        title="Delete"
                    >
                        <i className="ri-delete-bin-line"></i>
                    </button>
                </div>
            ),
        },
        {
            Header: "Position Title",
            accessor: "position_title",
            filterable: true,
            filterType: "text",
            filterKey: "position_title",
            Cell: ({ value }) => <span className="font-semibold">{value || "-"}</span>,
        },
        {
            Header: "Company",
            accessor: "company.name",
            filterable: true,
            filterType: "text",
            filterKey: "company__name",
            Cell: ({ row }) => <span>{row.original.company?.name || "—"}</span>,
        },
        {
            Header: "Department",
            accessor: "department.name",
            filterable: true,
            filterType: "text",
            filterKey: "department__name",
            Cell: ({ row }) => <span>{row.original.department?.name || "—"}</span>,
        },
        {
            Header: "Sub Department",
            accessor: "sub_department.name",
            filterable: true,
            filterType: "text",
            filterKey: "sub_department__name",
            Cell: ({ row }) => <span>{row.original.sub_department?.name || "—"}</span>,
        },
        {
            Header: "Created",
            accessor: "created_at",
            filterable: true,
            filterType: "date",
            filterKey: "created_at",
            Cell: ({ value }) => formatDate(value),
        },
        {
            Header: "Updated",
            accessor: "updated_at",
            filterable: true,
            filterType: "date",
            filterKey: "updated_at",
            Cell: ({ value }) => formatDate(value),
        },
    ];

    const buttons = (
        <div className="grid grid-cols-1 sm:grid-cols-1">
            <button
                onClick={openCreate}
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i> Add JD
            </button>
        </div>
    );

    return (
        <>
            <IconPageHeader
                heading="Job Description"
                description="Manage and review organizational policies, their visibility, and related documents."
                icon={Shield}
            />

            <DataTable
                ref={tableRef}
                columns={columns}
                title="Job Descriptions"
                apiUrl={`/job-descriptions/datatable/`}
                buttons={buttons}
                enableAdvancedFilters={true}
                externalFilters={externalFilters}
                hiddenParameters={["tab"]}
            />

            <JobDescFormModal
                isOpen={isJDModalOpen}
                onClose={closeModal}
                jobDescData={editingJD} // {id} OR null
                onSuccess={handleSuccess}
            />
        </>
    );
};

export default JobDescList;
