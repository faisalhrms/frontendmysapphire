import React, {useState} from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import DataSanitizeModel from "@modules/beirholm-bi/components/DataSanitizeModel.jsx";
import DataSanitizeService from "@modules/beirholm-bi/services/DataSanitizeService.js";
import UploadErrorModal from "@modules/beirholm-bi/components/UploadErrorModal.jsx";
import DownloadSampleFileButton from "@modules/beirholm-bi/components/DownloadSampleFileButton.jsx";
import ProgressBar from "@components/ProgressBar.jsx";
import ConfirmDeleteModal from "@modules/beirholm-bi/components/ConfirmDeleteModal.jsx";
import ConfirmReprocessModal from "@modules/beirholm-bi/components/ConfirmReprocessModal.jsx";
import Notify from "@helpers/toastNotifications.js";
import HasPermission from "@components/HasPermission.jsx";

const DataSanitizationList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadErrorModalOpen, setIsUploadErrorModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isConfirmReprocessModalOpen, setIsConfirmReprocessModalOpen] = useState(false);
    const [currentJobId, setCurrentJobId] = useState(null);
    const [fileToDelete, setFileToDelete] = useState(null);
    const [tableKey, setTableKey] = useState(Date.now());
    const [loadingActions, setLoadingActions] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [bulkProcessing, setBulkProcessing] = useState(false);

    const refreshTable = () => {
        setTableKey(Date.now());
    };

    const openDataSanitizeModal = () => setIsModalOpen(true);
    const closeDataSanitizeModal = () => setIsModalOpen(false);

    const openUploadErrorModal = (jobId) => {
        setCurrentJobId(jobId);
        setIsUploadErrorModalOpen(true);
    };
    const closeUploadErrorModal = () => {
        setCurrentJobId(null);
        setIsUploadErrorModalOpen(false);
    };

    const openConfirmModal = (fileId) => {
        setFileToDelete(fileId);
        setIsConfirmModalOpen(true);
    };
    const closeConfirmModal = () => {
        setFileToDelete(null);
        setIsConfirmModalOpen(false);
    };

    const openConfirmReprocessModal = () => {
        if (selectedRows.length === 0) {
            Notify.error("Please select at least one file.");
            return;
        }
        setIsConfirmReprocessModalOpen(true);
    };
    const closeConfirmReprocessModal = () => {
        setIsConfirmReprocessModalOpen(false);
    };

    const handleSelectRow = (row, isChecked) => {
        if (isChecked) {
            setSelectedRows((prev) => [...prev, row]);
        } else {
            setSelectedRows((prev) => prev.filter((item) => item.id !== row.id));
        }
    };

    const handleSelectAll = (rows, isChecked) => {
        if (isChecked) {
            setSelectedRows(rows.map((r) => r.original));
        } else {
            setSelectedRows([]);
        }
    };

    const handleBulkReprocessConfirm = async () => {
        setBulkProcessing(true);
        try {
            await Promise.all(
                selectedRows.map((row) => DataSanitizeService.reprocessJob(row.job_id))
            );
            refreshTable();
            setSelectedRows([]);
        } catch (err) {
            console.error(err);
        } finally {
            setBulkProcessing(false);
        }
    };

    const columns = [
        {
            id: "selection",
            Header: ({rows}) => {
                const allSelected =
                    rows.length > 0 &&
                    rows.every((r) =>
                        selectedRows.some((item) => item.id === r.original.id)
                    );
                const toggleAll = () => {
                    handleSelectAll(rows, !allSelected);
                };
                return <input type="checkbox" checked={allSelected} onChange={toggleAll}/>;
            },
            Cell: ({row}) => (
                <input
                    type="checkbox"
                    checked={selectedRows.some((item) => item.id === row.original.id)}
                    onChange={(e) => handleSelectRow(row.original, e.target.checked)}
                />
            )
        },
        {
            Header: "Actions",
            accessor: "actions",
            Cell: ({row}) => {
                const jobId = row.original.job_id;
                const fileId = row.original.id;
                return (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => {
                                const key = `downloadError_${jobId}`;
                                setLoadingActions((prev) => ({...prev, [key]: true}));
                                DataSanitizeService.downloadErrorFile(jobId)
                                    .finally(() =>
                                        setLoadingActions((prev) => ({...prev, [key]: false}))
                                    );
                            }}
                            title="Download Error File"
                            className="ti-btn ti-btn-warning ti-btn-sm"
                            disabled={loadingActions[`downloadError_${jobId}`]}
                        >
                            {loadingActions[`downloadError_${jobId}`] ? (
                                <i className="ri-loader-2-line animate-spin"></i>
                            ) : (
                                <i className="ri-error-warning-line"></i>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                const key = `reprocess_${jobId}`;
                                setLoadingActions((prev) => ({...prev, [key]: true}));
                                DataSanitizeService.reprocessJob(jobId)
                                    .then(() => refreshTable())
                                    .catch((err) => console.error(err))
                                    .finally(() =>
                                        setLoadingActions((prev) => ({...prev, [key]: false}))
                                    );
                            }}
                            title="Reprocess"
                            className="ti-btn ti-btn-danger ti-btn-sm"
                            disabled={loadingActions[`reprocess_${jobId}`]}
                        >
                            {loadingActions[`reprocess_${jobId}`] ? (
                                <i className="ri-loader-2-line animate-spin"></i>
                            ) : (
                                <i className="ri-refresh-line"></i>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                const key = `downloadRaw_${fileId}`;
                                setLoadingActions((prev) => ({...prev, [key]: true}));
                                DataSanitizeService.downloadRawFile(fileId)
                                    .finally(() =>
                                        setLoadingActions((prev) => ({...prev, [key]: false}))
                                    );
                            }}
                            title="Download Raw"
                            className="ti-btn ti-btn-info ti-btn-sm"
                            disabled={loadingActions[`downloadRaw_${fileId}`]}
                        >
                            {loadingActions[`downloadRaw_${fileId}`] ? (
                                <i className="ri-loader-2-line animate-spin"></i>
                            ) : (
                                <i className="ri-download-2-line"></i>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                const key = `downloadClean_${fileId}`;
                                setLoadingActions((prev) => ({...prev, [key]: true}));
                                DataSanitizeService.downloadCleanFile(fileId)
                                    .finally(() =>
                                        setLoadingActions((prev) => ({...prev, [key]: false}))
                                    );
                            }}
                            title="Download Clean"
                            className="ti-btn ti-btn-secondary ti-btn-sm"
                            disabled={loadingActions[`downloadClean_${fileId}`]}
                        >
                            {loadingActions[`downloadClean_${fileId}`] ? (
                                <i className="ri-loader-2-line animate-spin"></i>
                            ) : (
                                <i className="ri-download-cloud-line"></i>
                            )}
                        </button>
                        <button
                            onClick={() => openUploadErrorModal(jobId)}
                            title="Upload Missing Rules"
                            className="ti-btn ti-btn-dark ti-btn-sm"
                        >
                            <i className="ri-upload-cloud-line"></i>
                        </button>
                        <HasPermission permission='delete_clean_data'>
                        <button
                            onClick={() => openConfirmModal(fileId)}
                            title="Delete File"
                            className="ti-btn ti-btn-danger ti-btn-sm"
                            disabled={loadingActions[`delete_${fileId}`]}
                        >
                            {loadingActions[`delete_${fileId}`] ? (
                                <i className="ri-loader-2-line animate-spin"></i>
                            ) : (
                                <i className="ri-delete-bin-line"></i>
                            )}
                        </button>
                        </HasPermission>
                    </div>
                );
            }
        },
        {Header: "File Name", accessor: "file_name"},
        {Header: "Product Country", accessor: "product_country"},
        {
            Header: "Uploaded At",
            accessor: "uploaded_at",
            Cell: ({value}) => new Date(value).toLocaleString()
        },
        {Header: "Status", accessor: "status"},
        {
            Header: "Progress",
            accessor: "progress",
            Cell: ({value}) => (
                <div className="flex items-center">
                    <ProgressBar value={value} barColor="!bg-success" withStatus={false}/>
                </div>
            )
        },
        {Header: "Data Category", accessor: "data_category_name"}
    ];

    const buttons = (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-1">
                <button
                    className="ti-btn ti-btn-primary"
                    onClick={openDataSanitizeModal}
                    title="Upload Raw File"
                >
                    <i className="ri-upload-line"></i>
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1">
                <DownloadSampleFileButton/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1">
                <button
                    className="ti-btn ti-btn-info"
                    onClick={openConfirmReprocessModal}
                    disabled={bulkProcessing}
                    title="Bulk Reprocess"
                >
                    <i className="ri-refresh-line"></i>
                </button>
            </div>

        </>
    );

    return (
        <>
            <PageHeader currentpage="Raw Data Uploads" mainpage="Data Uploads"/>
            <DataTable
                key={tableKey}
                columns={columns}
                title="Uploaded Raw Data"
                apiUrl="/correction/file/datatable/"
                buttons={buttons}
            />
            {isModalOpen && (
                <DataSanitizeModel
                    closeModal={closeDataSanitizeModal}
                    refreshTable={refreshTable}
                />
            )}
            {isUploadErrorModalOpen && currentJobId && (
                <UploadErrorModal jobId={currentJobId} closeModal={closeUploadErrorModal}/>
            )}
            {isConfirmModalOpen && fileToDelete && (
                <ConfirmDeleteModal
                    closeModal={closeConfirmModal}
                    onConfirm={async () => {
                        const key = `delete_${fileToDelete}`;
                        setLoadingActions((prev) => ({...prev, [key]: true}));
                        await DataSanitizeService.deleteFile(fileToDelete);
                        refreshTable();
                        setLoadingActions((prev) => ({...prev, [key]: false}));
                    }}
                />
            )}
            {isConfirmReprocessModalOpen && (
                <ConfirmReprocessModal
                    closeModal={closeConfirmReprocessModal}
                    onConfirm={handleBulkReprocessConfirm}
                    message="Are you sure you want to reprocess the selected files?"
                />
            )}
        </>
    );
};

export default DataSanitizationList;
