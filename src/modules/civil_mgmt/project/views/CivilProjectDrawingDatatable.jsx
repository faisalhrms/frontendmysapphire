import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Package, Edit, Eye} from "lucide-react";
import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import UserWithAvatar from "@components/UserWithAvatar.jsx";
import {formatDate} from "@helpers/dateTime.js";
import CivilProjectDrawingModal from "@modules/civil_mgmt/modals/CivilProjectDrawingModal.jsx";
import {useCivilProjectDrawingModal} from "@modules/civil_mgmt/project/hooks/useCivilProjectDrawingModal.js";
import {toTitleCase} from "@helpers/formatters.js";
import DatatableFilesList from "@components/datatable/DatatableFilesList.jsx";

const CivilProjectDrawingDatatable = () => {
    const dataTableRef = React.useRef();
    const columns = [
        {
            Header: '#',
            accessor: 'drawing_no',
            filterable: true,
            filterType: 'text',
            Cell: ({ row }) => {
                const { id, drawing_no, status } = row.original;
                const isEditable = ["draft", "rejected"].includes(status);

                return isEditable ? (
                    <button
                        className="text-primary hover:underline flex items-center justify-center space-x-1"
                        title="Edit Drawing"
                        onClick={() => openModal(id, true)}
                    >
                        <span>{drawing_no}</span>
                        <Edit className="h-3.5 w-3.5" />
                    </button>
                ) : (
                    <span className="text-gray-500 flex items-center justify-center space-x-1">
                {drawing_no}
            </span>
                );
            },
        },
        {
            Header: 'Title',
            accessor: 'title',
            filterable: true,
            filterType: 'text',
        },
        {
            Header: 'Version',
            accessor: 'version',
            filterable: true,
            filterType: 'number',
            Cell: ({ value }) => (value ? `V ${value}` : ""),
        },
        {
            Header: 'Files',
            accessor: 'files',
            disableSortBy: true,
            Cell: ({ value }) => {
                return (
                    <DatatableFilesList files={value} />
                );
            },
        },
        {
            Header: 'Status',
            accessor: 'status',
            filterable: true,
            filterType: 'select',
            filterKey: 'status',
            filterOptions: [
                {value: 'approved', label: 'Approved'},
                {value: 'under_approval', label: 'Under Approval'},
                {value: 'rejected', label: 'Rejected'},
            ],
            Cell: ({value}) => toTitleCase(value),
            getCellProps: (cellInfo) => {
                const value = cellInfo.value;
                let bgClass = "";
                let textClass = "";

                if (value === "under_approval") {
                    bgClass = "bg-warning/30";
                    textClass = "text-warning";
                } else if (value === "approved") {
                    bgClass = "bg-success/30";
                    textClass = "text-success";
                } else if (value === "rejected") {
                    bgClass = "bg-danger/30";
                    textClass = "text-danger";
                } else {
                    bgClass = "bg-primary/30";
                    textClass = "text-primary";
                }

                return {
                    className: `capitalize px-2 py-1 rounded ${bgClass} ${textClass}`,
                };
            },
        },
        {
            Header: 'Pending At',
            accessor: 'current_approver',
            disableSortBy: true,
            Cell: ({value}) => (
                <UserWithAvatar user={value} />
            )
        },
        {
            Header: 'Description',
            accessor: 'description',
            filterable: true,
            filterType: 'text',
        },
        {
            Header: 'Site',
            accessor: 'site.name',
            filterable: true,
            filterType: 'text',
            filterKey: "project__site__name"
        },
        {
            Header: 'Project',
            accessor: 'project.name',
            filterable: true,
            filterType: 'text',
            filterKey: "project__name"
        },
        {
            Header: "Created At",
            accessor: "created_at",
            Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy - HH:mm") : ""),
            filterType: 'date',
            filterable: true,
        },
        {
            Header: "Updated At",
            accessor: "updated_at",
            Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy - HH:mm") : ""),
            filterType: 'date',
            filterable: true,
        },
        {
            Header: 'Created by',
            accessor: 'created_by',
            Cell: ({value}) => (
                <UserWithAvatar user={value} />
            )
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
        formData,
    } = useCivilProjectDrawingModal(() => dataTableRef.current?.refetch());

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
                heading="Civil Management System - Drawings"
                description="Configure items including name, description, category, and unit."
                icon={Package}
            />
            <DataTable
                ref={dataTableRef}
                columns={columns}
                apiUrl="/civil/project-drawing/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
                buttons={buttons}
            />

            <CivilProjectDrawingModal
                control={control}
                errors={errors}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                closeModal={closeModal}
                isEditMode={isEditMode}
                formData={formData}
            />
        </>
    );
};

export default CivilProjectDrawingDatatable;
