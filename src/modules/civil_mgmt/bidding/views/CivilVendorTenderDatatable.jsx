import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Eye, HardHat} from "lucide-react";
import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import {formatDate} from "@helpers/dateTime.js";
import {Link} from "react-router-dom";
import PdfModalViewer from "@modules/policies/components/PdfModalViewer.jsx";
import {useSecureFileViewer} from "@modules/media/hooks/mediaHooks.js";
import {toTitleCase} from "@helpers/formatters.js";

const CivilVendorTenderDatatable = () => {
    const { fileState, showFile, hideFile } = useSecureFileViewer();

    const columns = [
        {
            Header: 'Actions',
            accessor: 'id',
            disableSortBy: true,
            Cell: ({ row }) => {
                const { tender } = row.original;
                return (
                    <div className="flex justify-center space-x-2">
                        <Link
                            to={`/module/civil/vendor/tender/${tender.id}`}
                            title="View Tender"
                            className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-emerald-500 hover:bg-emerald-600">
                            View
                        </Link>
                    </div>
                );
            },
        },
        {
            Header: 'Title',
            accessor: 'tender.title',
        },
        {
            Header: 'Proposal Status',
            accessor: 'status',
            Cell: ({ value }) => (
                toTitleCase(value)
            ),
            getCellProps: (cellInfo) => {
                const value = cellInfo.value || "";
                let bgClass;
                    switch (value) {
                        case "rejected":
                            bgClass = "bg-danger";
                            break;
                        case "awarded":
                            bgClass = "bg-green";
                            break;
                        case "submitted":
                            bgClass = "bg-yellow";
                            break;
                        default:
                            bgClass = "bg-info";
                }
                return {
                    className: `text-white ${bgClass}`,
                };
            },
        },
        {
            Header: "Started At",
            accessor: "tender.started_at",
            Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy") : ""),
        },
        {
            Header: "Closed At",
            accessor: "tender.ended_at",
            Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy") : ""),
        },
        {
            Header: "Submitted At",
            accessor: "submitted_at",
            Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy - HH:mm") : ""),
        },
        {
            Header: "Attachments",
            accessor: "tender.attachments",
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
                heading="Civil Management System - Vendor - Tenders"
                description="Vendors can view active tenders, submit proposals and track submission status."
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
