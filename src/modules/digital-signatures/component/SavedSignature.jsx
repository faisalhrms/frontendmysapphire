import React, { useState } from "react";
import DataTable from "@components/DataTable.jsx";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "@modules/sr-management/component/ConfirmationModal.jsx";
import {
  getDownloadByEmpCode,
  getSignatureByEmpCode,
  getdeleteByEmpCode,
} from "../services/Service";

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
      handleSavedDataFetch(employeeCode, 1, true);
    } catch (error) {
      console.log(error);
    }
  };
  const getdeleteByEmpCode = async (employee_code) => {
    try {
      const result = await getdeleteByEmpCode(employee_code);
      console.log("Deleted successfully:", result);
    } catch (error) {
      console.error("Error during deletion:", error.message);
    }
  };
  const updateSignature = async () => {
    try {
      const result = await updateSignature(employeeCode, updateData);
      console.log("Updated successfully:", result);
    } catch (error) {
      console.error("Error during update:", error.message);
    }
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
              onClick={() => getdeleteByEmpCode(id)}
              className="ti-btn ti-btn-danger ti-btn-sm"
            >
              <i className="ri-delete-bin-6-line"></i>
            </button>

            <button
            onClick={() => handleSavedDataFetch(employee_code)}
              className="ti-btn ti-btn-primary ti-btn-sm"
            >
              <i className="ri-edit-line"></i>
            </button>
            <button
              onClick={() => getDownloadByEmpCode(employee_code)}
              className="ti-btn ti-btn-primary ti-btn-sm"
            >
              <i className="ri-download-2-line"></i>
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
