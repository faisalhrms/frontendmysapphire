import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Eye, HardHat} from "lucide-react";
import React, {useState} from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import {formatDate} from "@helpers/dateTime.js";
import {Link} from "react-router-dom";
import PdfModalViewer from "@modules/policies/components/PdfModalViewer.jsx";
import {useSecureFileViewer} from "@modules/media/hooks/mediaHooks.js";

const CivilVendorTenderDatatable = () => {
    const { fileState, showFile, hideFile } = useSecureFileViewer();

    const columns = [
        {
            Header: 'Actions',
            accessor: 'id',
            disableSortBy: true,
            Cell: ({ row }) => {
                const { id, status } = row.original;
                return (
                    <div className="flex justify-center space-x-2">
                        {status === "draft" && (
                            <Link to={`/module/civil/tender/edit/${id}`}
                                  title="Edit BOQ"
                                  className="ti-btn ti-btn-primary ti-btn-sm">
                                <i className="ri-edit-line"></i>
                            </Link>
                        )}
                        <Link
                            to={`/module/civil/vendor/tender/${id}`}
                            title="View BOQ"
                            className="ti-btn ti-btn-success ti-btn-sm">
                            <i className="ri-eye-line"></i>
                        </Link>
                    </div>
                );
            },
        },
        {
            Header: 'Project',
            accessor: 'boq.project.name',
        },
        {
            Header: 'BOQ #',
            accessor: 'boq.boq_no',
        },
        {
            Header: 'Title',
            accessor: 'title',
            filterType: 'text',
            filterable: true,
        },
        {
            Header: "Started At",
            accessor: "started_at",
            Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy") : ""),
        },
        {
            Header: "Closed At",
            accessor: "ended_at",
            Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy") : ""),
            getCellProps: (cellInfo) => {
                return {
                    className: `text-danger bg-danger/10`,
                };
            },
        },
        {
            Header: "Attachments",
            accessor: "attachments",
            width: 400,
            Cell: ({value}) => {
                return (
                    <div className="flex space-x-2">
                        {value?.length > 0 && (
                            <>
                                {value.map((id) => (
                                    <button
                                        key={id}
                                        onClick={() => showFile(id)}
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <Eye className="h-3 w-3 mr-1"/>
                                        View
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                )
            },
        },
    ]
    return (
        <>
            <IconPageHeader
                heading="Civil Management System - Vendor - Open Tenders"
                description="Manage civil projects, track progress, assign managers, and collaborate with team members."
                icon={HardHat}
            />
            <DataTable
                columns={columns}
                apiUrl="/civil/vendor/tenders/"
                needHeader={false}
                enableAdvancedFilters={false}
            />
            <PdfModalViewer
                isOpen={fileState.isVisible}
                fileId={fileState.fileId}
                onClose={hideFile}
            />
        </>
    );
};

export default CivilVendorTenderDatatable;
