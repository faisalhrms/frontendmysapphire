// src/modules/recruitment/components/JobDescList.jsx
import React, { useRef, useState } from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link } from "react-router-dom";
import JobDescFormModal from "@modules/requisition/models/JobDescFormModal.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Shield} from "lucide-react"; // if you still need it for detail page

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
        // row.original already contains nested responsibilities from datatable payload
        setEditingJD(row?.original || null);
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

    const getTotalWeightage = (row) => {
        const list = row?.original?.core_responsibilities || [];
        const total = list.reduce((sum, r) => sum + Number(r?.weightage ?? 0), 0);
        return Math.round((total + Number.EPSILON) * 100) / 100;
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
            Header: "Brief Overview",
            accessor: "brief_role_overview",
            filterable: true,
            filterType: "text",
            filterKey: "brief_role_overview",
            Cell: ({ value }) => (value ? (value.length > 80 ? value.slice(0, 80) + "…" : value) : "—"),
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
            Header: "Responsibilities",
            accessor: "core_responsibilities",
            disableSortBy: true,
            filterable: false,
            Cell: ({ row }) => {
                const list = row.original.core_responsibilities || [];
                return (
                    <span className="badge bg-primary/20 text-primary rounded-sm py-1">
            {list.length} items
          </span>
                );
            },
        },
        {
            Header: "Total Weightage",
            accessor: "total_weightage",
            disableSortBy: true,
            filterable: false,
            Cell: ({ row }) => {
                const total = getTotalWeightage(row);
                const ok = Number(total) === 100;
                return (
                    <span
                        className={
                            ok
                                ? "badge bg-success/20 text-success rounded-sm py-1"
                                : "badge bg-danger/20 text-danger rounded-sm py-1"
                        }
                        title="Sum of responsibilities' weightage"
                    >
            {total.toFixed(2)}
          </span>
                );
            },
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
                apiUrl={`/job-descriptions/datatable`}
                buttons={buttons}
                enableAdvancedFilters={true}
                externalFilters={externalFilters}
                hiddenParameters={["tab"]}
            />

            {/* Create/Edit JD Modal */}
            <JobDescFormModal
                isOpen={isJDModalOpen}
                onClose={closeModal}
                jobDescData={editingJD}
                onSuccess={handleSuccess}
            />
        </>
    );
};

export default JobDescList;
