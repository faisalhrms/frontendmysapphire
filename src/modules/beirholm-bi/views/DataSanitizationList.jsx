import React, {useCallback, useMemo, useState} from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import DataSanitizeModel from "@modules/beirholm-bi/components/DataSanitizeModel.jsx";
import DataSanitizeService from "@modules/beirholm-bi/services/DataSanitizeService.js";
import UploadErrorModal from "@modules/beirholm-bi/components/UploadErrorModal.jsx";
import ProgressBar from "@components/ProgressBar.jsx";
import ConfirmDeleteModal from "@modules/beirholm-bi/components/ConfirmDeleteModal.jsx";
import ConfirmReprocessModal from "@modules/beirholm-bi/components/ConfirmReprocessModal.jsx";
import Notify from "@helpers/toastNotifications.js";
import HasPermission from "@components/HasPermission.jsx";
import useFilters from "@hooks/useFilters.js";
import DataSanitizeFilter from "@modules/beirholm-bi/components/DataSanitizeFilter.jsx";
import DownloadErrorChoiceModal from "@modules/beirholm-bi/components/DownloadErrorChoiceModal.jsx";
import DownloadSampleFile from "@components/DownloadSampleFile.jsx";

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
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const openDownloadModal = (id) => {
        setCurrentJobId(id);
        setIsDownloadModalOpen(true)
    };
    const closeDownloadModal = () => {
        setCurrentJobId(null);
        setIsDownloadModalOpen(false)
    };
    const refreshTable = () => {
        setTableKey(Date.now());
    };

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
                    {name: "from_month"},
                    {name: "to_month"},
                ],
            }),
            []
        )
    );
    const [filters, setFilters] = useState(getFilters());
    const onSubmit = useCallback((formData) => {
        setFilters(formData);
    }, []);

    const onClear = useCallback(() => {
        resetFilters();
        setFilters(getFilters());
    }, [resetFilters, getFilters]);

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
    const downloadBulkCleanData = async () => {
        const fileIds = selectedRows.length > 0 ? selectedRows.map((row) => row.id) : [];
        const key = "downloadBulkClean";
        setLoadingActions((prev) => ({...prev, [key]: true}));
        try {
            await DataSanitizeService.downloadBulkCleanFile(fileIds);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingActions((prev) => ({...prev, [key]: false}));
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
                return <input type="checkbox" className="form-check-input" checked={allSelected} onChange={toggleAll}/>;
            },
            Cell: ({row}) => (
                <input
                    type="checkbox"
                    className="form-check-input"
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
                            onClick={() => openDownloadModal(jobId)}
                            title="Download Files"
                            className="ti-btn ti-btn-warning ti-btn-sm"
                        >
                            <i className="ri-error-warning-line"></i>
                        </button>
                        <HasPermission permission='beirholm_bi.change_beirholm_clean_data'>
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
                         </HasPermission>
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
                        <HasPermission permission='beirholm_bi.add_beirholm_error_correction_rule'>
                        <button
                            onClick={() => openUploadErrorModal(jobId)}
                            title="Upload Missing Rules"
                            className="ti-btn ti-btn-dark ti-btn-sm"
                        >
                            <i className="ri-upload-cloud-line"></i>
                        </button>
                        </HasPermission>
                        <HasPermission permission='beirholm_bi.delete_beirholm_clean_data'>
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
          Header: "Uploaded at",
          accessor: "uploaded_at",
          Cell: ({ value }) =>
            value ? (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                {new Date(value).toLocaleString()}
              </span>
            ) : null
        },
        {
          Header: "Reprocessed at",
          accessor: "last_reprocessed_at",
          Cell: ({ value }) =>
            value ? (
              <span className="bg-info/10 text-info px-2 py-1 rounded-md">
                {new Date(value).toLocaleString()}
              </span>
            ) : null
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
           <HasPermission permission='beirholm_bi.upload_raw_files'>
            <div className="grid grid-cols-1 sm:grid-cols-1">
                <button
                    className="ti-btn ti-btn-primary"
                    onClick={openDataSanitizeModal}
                    title="Upload Raw File"
                >
                    <i className="ri-upload-line"></i>
                </button>
            </div>
            </HasPermission>
            <div className="grid grid-cols-1 sm:grid-cols-1">
                <DownloadSampleFile
                    downloadFn={DataSanitizeService.downloadSampleFile}
                    title="Download Sample File"
                    className="ti-btn-success"
                />
            </div>
            <HasPermission permission='beirholm_bi.change_beirholm_clean_data'>
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
            </HasPermission>
            <div className="grid grid-cols-1 sm:grid-cols-1">
                <button
                    className="ti-btn ti-btn-dark"
                    onClick={downloadBulkCleanData}
                    disabled={loadingActions["downloadBulkClean"]}
                    title="Download Bulk Clean Data"
                >
                    {loadingActions["downloadBulkClean"] ? (
                        <i className="ri-loader-2-line animate-spin"></i>
                    ) : (
                        <i className="ri-download-cloud-line"></i>
                    )}
                </button>
            </div>
        </>
    );

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DataSanitizeFilter control={control} errors={errors} clearFilter={onClear}/>
            </form>
            <DataTable
                key={tableKey}
                columns={columns}
                title="Uploaded Raw Data"
                apiUrl="/correction/file/datatable/"
                buttons={buttons}
                filter={filters}
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
                    bodyMessage={"Are you sure you want to delete this file and all related data?"}
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
            {isDownloadModalOpen && currentJobId && (
                <DownloadErrorChoiceModal jobId={currentJobId} closeModal={closeDownloadModal}/>
            )}
        </>
    );
};

export default DataSanitizationList;
