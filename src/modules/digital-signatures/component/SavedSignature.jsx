import React, { useState } from "react";
import DataTable from "@components/DataTable.jsx";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "@modules/sr-management/component/ConfirmationModal.jsx";
import { getSignatureByEmpCode } from "../services/Service";

const SavedSignature = ({ onEdit, handleSavedDataFetch }) => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSignatureId, setSelectedSignatureId] = useState(null);
  const [signatures, setSignatures] = useState([]);
  console.log(signatures);
  const [loading, setLoading] = useState(false);

  const onOpenModal = (id) => {
    setSelectedSignatureId(id);
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSignatureId(null);
  };

  const onConfirmDelete = () => {
    setSignatures(signatures.filter((sig) => sig.id !== selectedSignatureId));
    onCloseModal();
  };

  const fetchSignature = async (employeeCode) => {
    try {
      handleSavedDataFetch(employeeCode, 1);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadAllSignatures = () => {
    alert("All signatures downloaded successfully!");
  };

  const columns = [
    { Header: "Employee", accessor: "employee_code" },
    { Header: "Name", accessor: "name" },
    { Header: "Company", accessor: "company.name" },
    {
      Header: "Action",
      Cell: ({ row }) => {
        const { id, employee_code, company } = row.original;
        console.log(row);
        return (
          <div className="flex space-x-1">
           
            <button
              onClick={() => onOpenModal(id)}
              className="ti-btn ti-btn-danger ti-btn-sm"
            >
              <i class="ri-delete-bin-6-line"></i>
            </button>

            <button
             
              onClick={() => fetchSignature(employee_code)}
              className="ti-btn ti-btn-primary ti-btn-sm"
            >
              <i className="ri-edit-line"></i>
            </button>
            <button
              onClick={downloadAllSignatures}
              className="ti-btn ti-btn-primary ti-btn-sm"
            >
              <i class="ri-file-pdf-line"></i>
            </button>
            <button
              onClick={downloadAllSignatures}
              className="ti-btn ti-btn-primary ti-btn-sm"
            >
              <i class="ri-download-2-line"></i>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="mt-1">
        <DataTable columns={columns} apiUrl="/signatures/datatable/" />
      </div>

      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={onCloseModal}
          onConfirm={onConfirmDelete}
          title="Delete Signature"
          message="Are you sure you want to delete this signature?"
        />
      )}
    </div>
  );
};

export default SavedSignature;
