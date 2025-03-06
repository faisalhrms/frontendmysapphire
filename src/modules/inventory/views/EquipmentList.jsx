import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { INVENTORY_ROUTES } from "@modules/inventory/routes.js";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import EquipmentListFilter from "@modules/inventory/components/EquipmentListFilter.jsx";
import useFilters from "@hooks/useFilters.js";

const EquipmentList = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const statusFilter = params.get('status') || '';

    const {
        control,
        handleSubmit,
        errors,
        getFilters,
        resetFilters,
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: "company_id" },
                    { name: "department_id" },
                    { name: "equipment_site_id" },
                    { name: "location_id" },
                    { name: "equipment_type_id" },
                    { name: "status" },
                    { name: "custodian_id" },
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters);

    // Apply status filter from the URL
    useEffect(() => {
        if (statusFilter) {
            setFilters((prevFilters) => ({
                ...prevFilters,
                status: statusFilter,
            }));
        }
    }, [statusFilter]);

    const onSubmit = useCallback((formData) => {
        setFilters(formData);
    }, []);

    const onClear = useCallback(() => {
        resetFilters();
        setFilters(getFilters());
    }, [resetFilters, getFilters]);

    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Link to={`/module/equipment/edit/${row.original.id}`}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line"></i>
                        </button>
                    </Link>
                    <Link to={`/module/equipment/detail/${row.original.id}`}>
                        <button className="ti-btn ti-btn-info ti-btn-sm">
                            <i className="ri-eye-line"></i>
                        </button>
                    </Link>
                </div>
            ),
        },
        { Header: "Code", accessor: "code" },
        { Header: "Serial No", accessor: "serial_no" },
        { Header: "Description", accessor: "description" },
        { Header: "Specification", accessor: "specs" },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({ row }) => (
                <span className={getBadgeClasses(row.original.status)}>
                    {toTitleCase(row.original.status)}
                </span>
            ),
        },
        { Header: "Custodian", accessor: "custodian" },
        { Header: "Department", accessor: "department" },
        { Header: "Equipment Site", accessor: "equipment_site" },
        { Header: "Equipment Type", accessor: "equipment_type" },
        { Header: "Location", accessor: "location" },
    ];

    const buttons = (
        <div className="grid grid-cols-1 sm:grid-cols-1">
            <Link
                to={INVENTORY_ROUTES.ADD.path}
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i> Add Equipment
            </Link>
        </div>
    );

    return (
        <>
            <PageHeader currentpage="Equipments" mainpage="Equipments" />
            <form onSubmit={handleSubmit(onSubmit)}>
                <EquipmentListFilter control={control} errors={errors} onClear={onClear} />
            </form>
            <DataTable
                columns={columns}
                title="Equipments"
                apiUrl={`/equipments/datatable/?status=${statusFilter}`}
                buttons={buttons}
                filter={filters}
            />
        </>
    );
};

export default EquipmentList;
