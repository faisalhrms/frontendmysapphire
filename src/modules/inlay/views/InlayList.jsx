// src/modules/inlay/components/InlayList.jsx
import React, { useMemo, useRef, useCallback } from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link } from "react-router-dom";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { Layers } from "lucide-react";
import { INLAY_ROUTES } from "@modules/inlay/routes.js";
import { useUploadInlayModal } from "@modules/inlay/hooks/inlayHooks.js";
import UploadModal from "@modules/project-management/components/model/UploadModal.jsx";

// ✅ ideally use an inlay sample file (replace later if you have one)
import sampleFile from "@assets/files/inlay_upload_sample.xlsx";

const InlayList = ({ externalFilters = [] }) => {
    const tableRef = useRef(null);

    const refetchTable = useCallback(() => {
        tableRef.current?.refetch?.();
    }, []);

    const {
        openUploadModal,
        closeUploadModal,
        control,
        errors,
        isSubmitting,
        handleSubmit,
        onSubmit,
        isUploadModalOpen,
    } = useUploadInlayModal(refetchTable);

    const columns = useMemo(
        () => [
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
                        <a href={row.original.public_url} target="_blank" rel="noreferrer">
                            <div className="font-semibold text-primary underline">
                                {row.original?.public_url}
                            </div>
                        </a>
                    </div>
                ),
            },
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
                    const fullUrl = `${window.location.origin}${
                        to.startsWith("/") ? to : `/${to}`
                    }`;

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
            {
                Header: "Active",
                accessor: "is_active",
                filterType: "boolean",
                filterable: true,
                Cell: ({ value }) => (value ? "Yes" : "No"),
                getCellProps: (cellInfo) => ({
                    className: cellInfo.value
                        ? "bg-success text-white"
                        : "bg-info text-white",
                }),
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
        ],
        []
    );

    const buttons = (
        <div className="flex gap-2">
            <button
                type="button"
                onClick={openUploadModal}
                className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-upload-2-line mr-1"></i> Upload Inlays
            </button>

            <a
                href={sampleFile}
                download="sample_upload_inlays.xlsx"
                className="ti-btn ti-btn-light !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-download-2-line mr-1"></i> Sample File
            </a>

            <Link to={INLAY_ROUTES.ADD.path}>
                <button className="ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]">
                    <i className="ri-add-line mr-1"></i> Add Inlay
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
                ref={tableRef}
                columns={columns}
                title=""
                apiUrl={`/inlay/inlays/datatable/`}
                buttons={buttons}
                enableAdvancedFilters={true}
                externalFilters={externalFilters}
                hiddenParameters={["tab"]}
            />

            {isUploadModalOpen && (
                <UploadModal
                    // ⚠️ IMPORTANT: UploadModal must render a container with id="uploadInlayModal"
                    // If your UploadModal has a fixed id, update it or create a dedicated InlayUploadModal.
                    id="uploadInlayModal"
                    control={control}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    closeModal={closeUploadModal}
                    heading="Upload Inlays"
                />
            )}
        </>
    );
};

export default InlayList;
