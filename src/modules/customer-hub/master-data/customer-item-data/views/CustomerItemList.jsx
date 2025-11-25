import React, { useRef, useState } from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link } from "react-router-dom";
import { toTitleCase } from "@helpers/formatters.js";
import { CUSTOMER_ITEMS } from "@modules/customer-hub/routes.js";
import UploadMasterModal from "@modules/customer-hub/master-data/components/UploadMasterModal.jsx";
import {
  downloadCustomerItemsTemplate,
  uploadCustomerItems,
  deleteCustomerItem,
} from "@modules/customer-hub/master-data/customer-item-data/services/CustomerItemService.js";
import AlertModalPortal from "@components/AlertModalPortal.jsx";

const CustomerItemList = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const dataTableRef = useRef();
  const [key, setKey] = useState(Date.now());

  const refresh = () => setKey(Date.now());

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLabel, setDeleteLabel] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (row) => {
    const id = row.original.id;
    const label =
      row.original.processed_item_code ||
      row.original.greige_item_code ||
      row.original.quality_code ||
      id;

    setDeleteId(id);
    setDeleteLabel(label);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteCustomerItem(deleteId);
      refresh(); // reload datatable
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      setDeleteLabel("");
    }
  };

  const columns = [
    {
      Header: "Actions",
      id: "actions",
      Cell: ({ row }) => (
        <div className="flex justify-center space-x-2">
          <Link to={CUSTOMER_ITEMS.CREATE.path} state={{ id: row.original.id }}>
            <button type="button" className="ti-btn ti-btn-primary ti-btn-sm">
              <i className="ri-edit-line" />
            </button>
          </Link>
          <button
            type="button"
            className="ti-btn ti-btn-danger ti-btn-sm"
            onClick={() => handleDeleteClick(row)}
          >
            <i className="ri-delete-bin-6-line" />
          </button>
        </div>
      ),
    },
    { Header: "Processed Code", accessor: "processed_item_code" },
    { Header: "Greige Code", accessor: "greige_item_code" },
    { Header: "Quality", accessor: "quality_code" },
    {
      Header: "Finished Design",
      accessor: "finished_design_description",
      Cell: ({ value }) => toTitleCase(value ?? "N/A"),
    },
    {
      Header: "Finished Color",
      accessor: "finished_color_description",
      Cell: ({ value }) => toTitleCase(value ?? "N/A"),
    },
    { Header: "Design Code", accessor: "finished_design_code" },
    { Header: "Color Code", accessor: "finished_color_code" },
    {
      Header: "Customer",
      accessor: "customer_name",
      Cell: ({ value }) => toTitleCase(value ?? "N/A"),
    },
    { Header: "Weave", accessor: "weave" },
    { Header: "Selvedge", accessor: "selvedge" },
    { Header: "Greige Width", accessor: "greige_width" },
    { Header: "Width (In)", accessor: "finished_width_inches" },
    { Header: "Width (Cm)", accessor: "finished_width_cm" },
  ];

  const buttons = (
    <div className="flex items-center gap-2">
      <Link to={CUSTOMER_ITEMS.CREATE.path}>
        <button
          type="button"
          className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
        >
          <i className="ri-add-line" />
        </button>
      </Link>
      <button
        type="button"
        onClick={() => downloadCustomerItemsTemplate()}
        className="ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-download-2-line" />
      </button>
      <button
        type="button"
        onClick={() => setIsUploadModalOpen(true)}
        className="hs-dropdown-toggle ti-btn ti-btn-warning-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-upload-cloud-2-line" />
      </button>
    </div>
  );

  return (
    <>
      <DataTable
        key={key}
        columns={columns}
        title="Customer Items"
        apiUrl="customer-hub/customer-items/datatable/"
        ref={dataTableRef}
        externalFilters={["tab"]}
        buttons={buttons}
      />

      {isUploadModalOpen && (
        <UploadMasterModal
          title="Upload Customer Items"
          uploadFn={(file, extra) => uploadCustomerItems(file, { ...extra })}
          extraParams={{}}
          closeModal={() => setIsUploadModalOpen(false)}
          onUploaded={() => {}}
          refreshTable={refresh}
        />
      )}

      <AlertModalPortal
        id="customer-item-delete"
        isOpen={isDeleteModalOpen}
        type="danger"
        title="Delete customer item"
        message={
          deleteLabel
            ? `Are you sure you want to delete item ${deleteLabel}?`
            : "Are you sure you want to delete this item?"
        }
        btnTxt="Yes, delete"
        isSubmitting={isDeleting}
        needInput={false}
        inputLabel=""
        onConfirm={handleDeleteConfirm}
        onClose={setIsDeleteModalOpen}
      />
    </>
  );
};

export default CustomerItemList;
