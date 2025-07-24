import React, {useState} from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import {formatDate} from "@helpers/dateTime.js";
import Avatar from "@components/Avatar.jsx";
import QRCode from "qrcode";
import {QRCodeCanvas} from "qrcode.react";
import {Link} from "react-router-dom";
import { FilePlus } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

const DatatableDynamicForm = () => {

    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    const openQRModal = (row) => {
        setModalData(row);
        setQrModalOpen(true);
    };

    const closeQRModal = () => {
        setQrModalOpen(false);
        setModalData(null);
    };

    const downloadQRCode = async (row) => {
        try {
            const fullURL = `${window.location.origin}/forms/${row.slug}`;
            const dataUrl = await QRCode.toDataURL(fullURL, {
                width: 512,
                margin: 2,
                scale: 8,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            })
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = `${row.title}(QR).png`;
            a.click();
        } catch (error) {
        }
    };

    const columns = [
        {
            Header: "QR Code",
            disableSortBy: true,
            Cell: ({ row }) => {
                const rowData = row.original;
                return (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => openQRModal(rowData)}
                            className="ti-btn ti-btn-primary-full ti-btn-sm"
                        >
                            <i class="bi bi-qr-code"></i>
                        </button>
                        <button
                            onClick={() => downloadQRCode(rowData)}
                            className="ti-btn ti-btn-secondary ti-btn-sm"
                        >
                            <i className="ri-download-line"></i>
                        </button>
                    </div>
                );
            },
        },
        {
            Header: 'Actions',
            accessor: 'id',
            disableSortBy: true,
            Cell: ({ row }) => {
                const rowData = row.original;
                return (
                    <div className="flex space-x-2">
                        <Link to={`/module/forms/edit/${rowData.id}`}>
                            <button
                                className="ti-btn ti-btn-primary ti-btn-sm"
                                title="Edit Form">
                                <i className="ri-edit-line"></i>
                            </button>
                        </Link>
                        <Link to={`/forms/${rowData.slug}`}>
                            <button
                                className="ti-btn ti-btn-success ti-btn-sm"
                                title="View Public Form">
                                <i class="bi bi-file-earmark"></i>
                            </button>
                        </Link>
                        <Link to={`/module/forms/submissions/${rowData.id}`}>
                            <button
                                className="ti-btn ti-btn-success-gradient ti-btn-sm"
                                title="View Form Submissions">
                                <i class="bi bi-send-check"></i>
                            </button>
                        </Link>
                    </div>
            )},
        },
        {
            Header: 'Title',
            accessor: 'title',
            filterType: 'text',
            filterable: true,
        },
        {
            Header: "Expired Date",
            accessor: "expired_at",
            Cell: ({ value }) => formatDate(value),
            filterType: 'date',
            filterable: true,
        },
        {
            Header: 'Company',
            accessor: 'company.name',
            disableSortBy: true,
            Cell: ({ value }) => {
                return <span className="badge badge-md !rounded-full bg-primary/10 text-primary"> {value ?? 'N/A'}</span>
            },
            filterType: 'text',
            filterable: true,
            filterKey: 'company__name'
        },
        {
            Header: 'Department',
            accessor: 'department.name',
            disableSortBy: true,
            Cell: ({ value }) => {
                return <span className="badge badge-md !rounded-full bg-warning/10 text-warning"> {value ?? 'N/A'}</span>
            },
            filterType: 'text',
            filterable: true,
            filterKey: 'department__name'
        },
        {
            Header: "Created Date",
            accessor: "created_at",
            Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy - HH:mm") : ""),
            filterType: 'datetime',
            filterable: true,
        },
        { Header: "Active",
            accessor: "is_active",
            filterType: 'boolean',
            filterable: true,
            Cell: ({value}) => (value ? 'Yes': 'No')
        },
        { Header: "Alerts",
            accessor: "enable_alerts",
            filterType: 'boolean',
            filterable: true,
            Cell: ({value}) => (value ? 'Yes': 'No')
        },
        {
            Header: 'Notification Emails',
            accessor: 'notification_emails',
            filterType: 'text',
            filterable: true,
            Cell: ({ value }) => (
                value &&
                <span className="badge !rounded-full bg-light text-default">
                    {toTitleCase(value)}
                 </span>
            ),
        },
        {
            Header: 'Created by',
            accessor: 'created_by',
            Cell: ({value}) => (
                <div className="flex items-center">
                    <Avatar
                        avatar={value?.avatar ? value?.avatar : null}
                        full_name={value?.full_name || 'N A'}
                        size='md'
                        parentClasses='dark:text-gray-200 dark:bg-bodybg'
                    />
                    <div className='ms-2'>
                        <p className="font-semibold mb-0 flex items-center">
                            {value?.full_name || 'N/A'}
                        </p>
                        <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                            {value?.email || 'N/A'}
                        </p>
                    </div>
                </div>
            )
        },
    ];

    return (
        <>
            <IconPageHeader
                heading="Dynamic Form List"
                description="View and manage dynamically generated forms"
                icon={FilePlus}
            />
            <DataTable
                columns={columns}
                title="Forms"
                apiUrl="/forms/datatable/"
                enableAdvancedFilters={true}
                needHeader={false}
            />
            {qrModalOpen && modalData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded">
                        <QRCodeCanvas
                            value={`${window.location.origin}/forms/${modalData.slug}`}
                            size={512}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="H"
                            includeMargin={true}
                            />
                        <div className="mt-4 flex space-x-2 justify-end">
                            <button
                                onClick={() => downloadQRCode(modalData)}
                                className="ti-btn ti-btn-secondary ti-btn-sm"
                            >
                                <i className="ri-download-line"></i>
                            </button>
                            <button
                                onClick={closeQRModal}
                                className="ti-btn ti-btn-secondary ti-btn-sm"
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DatatableDynamicForm;
