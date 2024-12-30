
import React, { useState } from "react";
import DataTable from "@components/DataTable.jsx"; 
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "@modules/sr-management/component/ConfirmationModal.jsx";

const SavedSignature = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSignatureId, setSelectedSignatureId] = useState(null);
  const [signatures, setSignatures] = useState([
    {
      id: 1,
      employee_code: "EMP-001",
      name: "John Doe",
      company_id: "Company-1",
    },
    {
      id: 2,
      employee_code: "EMP-002",
      name: "Jane Smith",
      company_id: "Company-2",
    },
  ]);
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
    setIsModalOpen(false);
    setSelectedSignatureId(null);
  };

  const fetchSignature = (employeeCode) => {
    alert(`Signature for Employee Code: ${employeeCode} viewed successfully!`);
  };

  const downloadAllSignatures = () => {
    alert("All signatures downloaded successfully!");
  };

  const columns = [
    { Header: "Employee Code", accessor: "employee_code" },
    { Header: "Name", accessor: "name" },
    { Header: "Company", accessor: "company_id" },
    {
      Header: "Action",
      Cell: ({ row }) => {
        const { id, employee_code } = row.original;
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => fetchSignature(employee_code)}
              className="ti-btn ti-btn-primary ti-btn-sm"
              disabled={loading}
            >
              View
            </button>
            <button
              onClick={() => onOpenModal(id)}
              className="ti-btn ti-btn-danger ti-btn-sm"
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="mt-1">
       
        <DataTable columns={columns} data={signatures} />
      </div>

      <button
        onClick={downloadAllSignatures}
        className="ti-btn ti-btn-primary mt-3"
      >
        Download All Signatures
      </button>

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

