import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Package, Edit} from "lucide-react";
import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import UserWithAvatar from "@components/UserWithAvatar.jsx";
import ItemSetupModal from "@modules/civil_mgmt/modals/ItemSetupModal.jsx";
import {useItemSetupModal} from "@modules/civil_mgmt/setup/hooks/useItemSetupModal.js";
import {formatDate} from "@helpers/dateTime.js";

const ItemSetupDatatable = () => {
    const dataTableRef = React.useRef();
    const columns = [
        {
            Header: 'Item No',
            accessor: 'item_no',
            filterable: true,
            filterType: 'text',
            Cell: ({ row }) => {
                const name = row.original.item_no;
                const id = row.original.id;
                return (
                    <button
                        className="text-primary hover:underline flex items-center justify-center space-x-1"
                        title="Edit Item"
                        onClick={() => openModal(id, true)}
                    >
                        <span>{name}</span>
                        <Edit className="h-3.5 w-3.5" />
                    </button>
                );
            },
        },
        {
            Header: 'Name',
            accessor: 'name',
            filterable: true,
            filterType: 'text',
        },
        {
            Header: 'Category',
            accessor: 'category.name',
            filterable: true,
            filterType: 'text',
            filterKey: "category__name"
        },
        {
            Header: 'Unit',
            accessor: 'unit.name',
            filterable: true,
            filterType: 'text',
            filterKey: "unit__name"
        },
        {
            Header: 'Description',
            accessor: 'description',
            filterable: true,
            filterType: 'text',
        },
        {
            Header: "Created At",
            accessor: "created_at",
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
    } = useItemSetupModal(() => dataTableRef.current?.refetch());

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
                heading="Civil Management System - Item Setup"
                description="Configure items including name, description, category, and unit."
                icon={Package}
            />
            <DataTable
                ref={dataTableRef}
                columns={columns}
                apiUrl="/civil/item/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
                buttons={buttons}
            />

            <ItemSetupModal
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

export default ItemSetupDatatable;
