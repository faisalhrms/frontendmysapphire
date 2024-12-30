
import React, { useState } from "react";
import DataTable from "@components/DataTable.jsx";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "@modules/sr-management/component/ConfirmationModal.jsx";
import axios from "axios";

const SavedSignature = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSignatureId, setSelectedSignatureId] = useState(null);
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSaveSignature = () => {
    console.log("Saving signature...");

    const newSignature = {
      id: signatures.length + 1,
      name: `Signature #${signatures.length + 1}`,
      employee_code: `EMP-${signatures.length + 1}`,
      company_id: `Company-${signatures.length + 1}`,
    };
    setSignatures([...signatures, newSignature]);
  };

  const onClearSignature = () => {
    console.log("Clearing signature...");
  };

  const onOpenModal = (id) => {
    setSelectedSignatureId(id);
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSignatureId(null);
  };

  const onConfirmDelete = () => {
    console.log("Deleting signature with ID:", selectedSignatureId);
    setSignatures(signatures.filter((sig) => sig.id !== selectedSignatureId));
    setIsModalOpen(false);
    setSelectedSignatureId(null);
  };

  const fetchSignature = async (employeeCode) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://backend.srl.com.pk/api/signatures/download/${employeeCode}/`
      );
      setLoading(false);
    
      console.log("Fetched Signature:", response.data);
      alert("Signature downloaded successfully!");
    } catch (error) {
      setLoading(false);
      console.error("Error fetching signature:", error);
      alert("Failed to fetch the signature.");
    }
  };

  const columns = [
    { Header: "Employee Code", accessor: "employee_code" },
    { Header: "Name", accessor: "name" },
    { Header: "Company", accessor: "company_id" },
    {
      Header: "Action",
      Cell: ({ row }) => {
        const { employee_code } = row.original;
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => fetchSignature(employee_code)}
              className="ti-btn ti-btn-primary ti-btn-sm"
              disabled={loading}
            >
              {loading ? "Loading..." : "View"}
            </button>
            <button
              onClick={() => onOpenModal(employee_code)}
              className="ti-btn ti-btn-danger ti-btn-sm"
            >
              Delete
            </button>
            <button
              onClick={() => onOpenModal(employee_code)}
               className="ri-arrow-down-circle-line"
            >
              Downlond
            </button>
            <button
              onClick={() => onOpenModal(employee_code)}
               className="bx bx-download"
            >
             Download All signature
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
