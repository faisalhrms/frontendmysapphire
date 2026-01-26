// src/modules/inlay/components/InlayList.jsx
import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link } from "react-router-dom";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { Layers } from "lucide-react";
import {INLAY_ROUTES} from "@modules/inlay/routes.js";

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "N/A");

const renderDescription = (desc) => {
    if (!desc) return "—";
    const items = Array.isArray(desc) ? desc : [desc];

    const text = items
        .filter((x) => x && (x.label || x.value))
        .map((x) => `${x.label ?? ""}${x.label ? ": " : ""}${x.value ?? ""}`.trim())
        .filter(Boolean)
        .join(", ");

    return text || "—";
};

const InlayList = ({ externalFilters = [] }) => {
    const columns = [

        {
            Header: "Thumbnail",
            accessor: "thumbnail",
            disableSortBy: true,
            width: 100,
            Cell: ({ row }) => {
                const t = row.original.thumbnail;
                const src = t?.small_url || t?.medium_url || t?.file_url;
                return (
                    <div className="flex items-center">
                        {src ? (
                            <img
                                src={src}
                                alt={row.original.name || "thumbnail"}
                                className="h-10 w-10 rounded object-cover border"
                            />
                        ) : (
                            <span className="text-xs text-gray-500">—</span>
                        )}
                    </div>
                );
            },
        },
        {
            Header: "URL",
            accessor: "public_url",
            width: 300,
            Cell: ({ row }) => (
                <div className="flex items-center">
                    <a href={row.original.public_url} target='_blank'>
                        <div className="font-semibold text-primary underline">{row.original?.public_url}</div>
                    </a>
                </div>
            )
        },

        // ✅ Design Code as clickable link to /inlay/:code
        {
            Header: "Design Code",
            accessor: "design_code",
            filterable: true,
            filterType: "text",
            filterKey: "design_code",
            Cell: ({ row, value }) => {
                const code = value || row?.original?.design_code;
                if (!code) return <span className="font-semibold">—</span>;

                const base = import.meta.env.BASE_URL || "/";
                const to = `${base}inlay/${encodeURIComponent(code)}`;
                const fullUrl = `${window.location.origin}${to.startsWith("/") ? to : `/${to}`}`;

                return (
                    <Link
                        to={to}
                        className="font-semibold text-blue-600 hover:text-blue-800 underline"
                        title={fullUrl}
                    >
                        {code}
                    </Link>
                );
            },
        },

        {
            Header: "Name",
            accessor: "name",
            filterable: true,
            filterType: "text",
            filterKey: "name",
            width: 300,
            Cell: ({ value }) => <span>{value || "—"}</span>,
        },
        { Header: "Active",
            accessor: "is_active",
            filterType: 'boolean',
            filterable: true,
            Cell: ({value}) => (value ? 'Yes': 'No'),
            getCellProps: (cellInfo) => {
                return {
                    className: cellInfo.value ? 'bg-success text-white' : 'bg-info text-white',
                }
            },
        },

        {
            Header: "Created",
            accessor: "created_at",
            filterable: true,
            filterType: "date",
            filterKey: "created_at",
        },
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Link to={`/module/inlay/edit/${row.original.id}`}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm" title="Edit">
                            <i className="ri-edit-line"></i>
                        </button>
                    </Link>

                    <Link to={`/module/inlay/detail/${row.original.id}`}>
                        <button className="ti-btn ti-btn-info ti-btn-sm" title="View">
                            <i className="ri-eye-line"></i>
                        </button>
                    </Link>
                </div>
            ),
        },
    ];

    const buttons = (
        <div className="grid grid-cols-1 sm:grid-cols-1">
            <Link to={INLAY_ROUTES.ADD.path}>
                <button className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
                    <i className="ri-add-line font-semibold align-middle"></i> Add Inlay
                </button>
            </Link>
        </div>
    );

    return (
        <>
            <IconPageHeader
                heading="Inlay"
                description="Manage inlay designs, thumbnails, and attachments."
                icon={Layers}
            />

            <DataTable
                columns={columns}
                title="Inlays"
                apiUrl={`/inlay/inlays/datatable/`}
                buttons={buttons}
                enableAdvancedFilters={true}
                externalFilters={externalFilters}
                hiddenParameters={["tab"]}
            />
        </>
    );
};

export default InlayList;
