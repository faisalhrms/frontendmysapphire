import React, {useState} from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import DataSanitizeModel from "@modules/beirholm-bi/components/DataSanitizeModel.jsx";
import DataSanitizeService from "@modules/beirholm-bi/services/DataSanitizeService.js";
import UploadErrorModal from "@modules/beirholm-bi/components/UploadErrorModal.jsx";
import DownloadSampleFileButton from "@modules/beirholm-bi/components/DownloadSampleFileButton.jsx";
import ProgressBar from "@components/ProgressBar.jsx";

const DataSanitizationList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadErrorModalOpen, setIsUploadErrorModalOpen] = useState(false);
    const [currentJobId, setCurrentJobId] = useState(null);
    const [tableKey, setTableKey] = useState(Date.now());
    const [loadingActions, setLoadingActions] = useState({});

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

    const columns = [
        {
            Header: "Actions",
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
                    </div>
                );
            },
        },
        {Header: "File Name", accessor: "file_name"},
        {Header: "Product Country", accessor: "product_country"},
        {
            Header: "Uploaded At",
            accessor: "uploaded_at",
            Cell: ({value}) => new Date(value).toLocaleString(),
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

        {Header: "Data Category", accessor: "data_category_name"},
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
        </>
    );
};

export default DataSanitizationList;
