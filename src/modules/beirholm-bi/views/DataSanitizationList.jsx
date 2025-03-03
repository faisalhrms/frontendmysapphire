import React, { useState } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import DataSanitizeModel from "@modules/beirholm-bi/components/DataSanitizeModel.jsx";
import DataSanitizeService from "@modules/beirholm-bi/services/DataSanitizeService.js";
import UploadErrorModal from "@modules/beirholm-bi/components/UploadErrorModal.jsx";

const DataSanitizationList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadErrorModalOpen, setIsUploadErrorModalOpen] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);

  // Use a key to force re-mount of DataTable on refresh.
  const [tableKey, setTableKey] = useState(Date.now());

  // Function to refresh the DataTable by updating the key.
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
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() =>
              DataSanitizeService.downloadErrorFile(row.original.job_id)
            }
            title="Download Error File"
            className="ti-btn ti-btn-warning ti-btn-sm"
          >
            <i className="ri-error-warning-line"></i>
          </button>
          <button
            onClick={() => {
              DataSanitizeService.reprocessJob(row.original.job_id)
                .then(() => {
                  // After reprocessing, refresh the table.
                  refreshTable();
                })
                .catch((err) => console.error(err));
            }}
            title="Reprocess"
            className="ti-btn ti-btn-danger ti-btn-sm"
          >
            <i className="ri-refresh-line"></i>
          </button>
          <button
            onClick={() => DataSanitizeService.downloadRawFile(row.original.id)}
            title="Download Raw"
            className="ti-btn ti-btn-info ti-btn-sm"
          >
            <i className="ri-download-2-line"></i>
          </button>
          <button
            onClick={() =>
              DataSanitizeService.downloadCleanFile(row.original.id)
            }
            title="Download Clean"
            className="ti-btn ti-btn-secondary ti-btn-sm"
          >
            <i className="ri-download-cloud-line"></i>
          </button>
          <button
            onClick={() => openUploadErrorModal(row.original.job_id)}
            title="Upload Missing Rules"
            className="ti-btn ti-btn-dark ti-btn-sm"
          >
            <i className="ri-upload-cloud-line"></i>
          </button>
        </div>
      ),
    },
    { Header: "File Name", accessor: "file_name" },
    {
      Header: "Uploaded At",
      accessor: "uploaded_at",
      Cell: ({ value }) => new Date(value).toLocaleString(),
    },
    { Header: "Status", accessor: "status" },
    { Header: "Progress", accessor: "progress" },
    { Header: "Data Category", accessor: "data_category_name" },
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
        <button
          className="ti-btn ti-btn-success"
          onClick={openDataSanitizeModal}
          title="Download Sample File"
        >
          <i className="ri-download-2-line"></i>
        </button>
      </div>
    </>
  );

  return (
    <>
      <PageHeader currentpage="Raw Data Uploads" mainpage="Data Uploads" />
      {/* Pass the tableKey as the key prop to force re-mount */}
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
          refreshTable={refreshTable} // Pass refresh callback to modal
        />
      )}
      {isUploadErrorModalOpen && currentJobId && (
        <UploadErrorModal
          jobId={currentJobId}
          closeModal={closeUploadErrorModal}
        />
      )}
    </>
  );
};

export default DataSanitizationList;
