import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { BEIRHOLM_BI_ROUTES } from "@modules/beirholm-bi/routes.js";
import { toTitleCase } from "@helpers/formatters.js";
import ClassificationModel from "@modules/beirholm-bi/components/ClassificationModel.jsx";
import { downloadImporterClassificationSample } from "@modules/beirholm-bi/services/importerClassificationService.js";

const ImporterClassificationList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableKey, setTableKey] = useState(Date.now());
  const openClassificationModel = () => setIsModalOpen(true);
  const closeClassificationModel = () => setIsModalOpen(false);
  const refreshTable = () => {
    setTableKey(Date.now());
  };
  const downloadSample = () => {
    downloadImporterClassificationSample();
  };

  const columns = [
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link
            to={BEIRHOLM_BI_ROUTES.IMPORTER_CLASSIFICATION_CREATE.path}
            state={{ id: row.original.id }}
          >
            <button className="ti-btn ti-btn-primary ti-btn-sm">
              <i className="ri-edit-line"></i>
            </button>
          </Link>
        </div>
      )
    },
    {
      Header: "Country",
      accessor: (row) => toTitleCase(row.product_country)
    },
    {
      Header: "Date Category",
      accessor: (row) => toTitleCase(row.data_category.name)
    },
    {
      Header: "Importer",
      accessor: (row) => toTitleCase(row.importer)
    },
    {
      Header: "Classification",
      accessor: "classification"
    },
    {
      Header: "Focus Buyers",
      accessor: "focus_buyers"
    },
    {
      Header: "Created At",
      accessor: "created_at",
      Cell: ({ value }) => new Date(value).toLocaleString()
    }
  ];

  const buttons = (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-1">
        <button
          className="hs-dropdown-toggle ti-btn ti-btn-info-full !py-1 !px-2 !text-[0.75rem]"
          onClick={downloadSample}
          title="Download Sample File"
        >
          <i className="ri-download-line"></i>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1">
        <button
          className="hs-dropdown-toggle ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]"
          onClick={openClassificationModel}
          title="Upload Focus Buyers & Classifications"
        >
          <i className="ri-upload-line"></i>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1">
        <Link
          to={BEIRHOLM_BI_ROUTES.IMPORTER_CLASSIFICATION_CREATE.path}
          className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
        >
          <i className="ri-add-line font-semibold align-middle"></i> Add
        </Link>
      </div>
    </>
  );

  return (
    <>
      <PageHeader
        currentpage="Classification & Focus Buyer"
        mainpage="Classification & Focus Buyer"
      />
      <DataTable
        key={tableKey}
        columns={columns}
        title="Classification & Focus Buyer"
        apiUrl="classification/datatable/"
        buttons={buttons}
      />
      {isModalOpen && (
        <ClassificationModel
          closeModal={closeClassificationModel}
          refreshTable={refreshTable}
        />
      )}
    </>
  );
};

export default ImporterClassificationList;
