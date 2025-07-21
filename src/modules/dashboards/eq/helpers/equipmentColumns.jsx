import {equipmentStatuses} from "@modules/inventory/services/inventoryService.js";
import {getBadgeClasses} from "@helpers/badges.js";
import {formatAmountWithCommas, toTitleCase} from "@helpers/formatters.js";
import React from "react";

export const equipmentColumns = [
    {
        Header: "Code",
        accessor: "code",
        filterable: true,
        filterType: "number",
    },
    {
        Header:"Asset Code",
        accessor: "asset_code",
        filterable: true,
        filterType: "text",
    },
    {
        Header: "Serial No",
        accessor: "serial_no",
        filterable: true,
        filterType: "text",
    },
    {
        Header: "Description",
        accessor: "description",
        filterable: true,
        filterType: "text",
        Cell: ({ row }) => (
            <span>
                {row.original.description?.length > 50
                    ? row.original.description.slice(0, 50) + "..."
                    : row.original.description}
            </span>
        ),
    },
    {
        Header: "Specification",
        accessor: "specs",
        filterable: true,
        filterType: "text",
        Cell: ({ row }) => (
            <span>
                {row.original.specs?.length > 40
                    ? row.original.specs.slice(0, 40) + "..."
                    : row.original.specs}
            </span>
        ),
    },
    {
        Header: "Status",
        accessor: "status",
        filterType: 'select',
        filterable: true,
        filterOptions: equipmentStatuses,
        Cell: ({ row }) => (
            <span className={getBadgeClasses(row.original.status)}>
                {toTitleCase(row.original.status)}
            </span>
        ),
    },
    {
        Header: "Asset Tag",
        accessor: "asset_tag_available",
        filterable: true,
        filterType: 'boolean',
        Cell: ({ value }) => (
            <span className={value ? "badge bg-success/20 text-success rounded-sm py-1" : "badge bg-danger/20 text-danger rounded-sm py-1"}>
                {value ? "Available" : "Not Available"}
            </span>
        ),
    },
    {
        Header: "Purchase Price",
        accessor: "purchase_price",
        filterable: true,
        filterType: 'text',
        Cell: ({ value }) =>
            value === null ? "Nill" : formatAmountWithCommas(value),
    },
    {
        Header: "Custodian",
        accessor: "custodian",
        filterable: true,
        filterType: "text",
        filterKey: 'custodian__full_name',
    },
    {
        Header: "Department",
        accessor: "department",
        filterable: true,
        filterType: "text",
        filterKey: 'department__name'
    },
    {
        Header: "Asset Site",
        accessor: "equipment_site",
        filterable: true,
        filterType: "text",
        filterKey: 'equipment_site__name'
    },
    {
        Header: "Asset Type",
        accessor: "equipment_type",
        filterable: true,
        filterType: "text",
        filterKey: 'equipment_type__name'
    },
    {
        Header: "Location",
        accessor: "location",
        filterable: true,
        filterType: "text",
        filterKey: 'location__name'
    },
    {
        Header: "Verified By",
        accessor: "verified_by",
        filterable: true,
        filterType: "text",
        Cell: ({ value }) => value || "Not Verified",
    },
    {
        Header: "Verified On",
        accessor: "verified_on",
        filterable: true,
        filterType: "date",
        Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : "N/A",
    },
    {
        Header: "Company",
        accessor: "company.name",
        filterable: false,
        Cell: ({ row }) => <span>{row.original.company?.name || "-"}</span>,
    },
    ]