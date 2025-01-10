// SavedSignature.jsx
import React, { useState, useEffect } from "react";
import DataTable from "@components/DataTable.jsx";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "@modules/sr-management/component/ConfirmationModal.jsx";
import {
  getAllSignatures,
  getDownloadByEmpCode,
  getdeleteByEmpCode,
} from "../services/Service";
import Notify from "@helpers/toastNotifications.js";

const SavedSignature = ({ onEdit, handleSavedDataFetch }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSignatureId, setSelectedSignatureId] = useState(null);
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllSignatures();
      setSignatures(response || []);
    } catch (error) {
      console.error("Error fetching signatures:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onOpenModal = (empCode) => {
    setSelectedSignatureId(empCode);
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSignatureId(null);
  };

  const onConfirmDelete = async () => {
    try {
      if (!selectedSignatureId) return;
      await getdeleteByEmpCode(selectedSignatureId);
      Notify.success("Deleted successfully.");
      fetchData(); // Refresh the data table after deletion
    } catch (error) {
      Notify.error("Error during deletion:", error.message);
    } finally {
      onCloseModal();
    }
  };

  const columns = [
    { Header: "Employee", accessor: "employee_code" },
    { Header: "Name", accessor: "name" },
    { Header: "Company", accessor: "company.name" },
    {
      Header: "Action",
      Cell: ({ row }) => {
        const { employee_code } = row.original;
        return (
          <div className="flex space-x-1">
            <button
              onClick={() => onOpenModal(employee_code)}
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
        <DataTable
          columns={columns}
          data={signatures}
          loading={loading}
          apiUrl="/signatures/datatable/"
        />
      </div>

      <ConfirmationModal
        show={isModalOpen}
        message="Are you sure you want to delete this signature?"
        onConfirm={onConfirmDelete}
        onClose={onCloseModal}
      />
    </div>
  );
};

export default SavedSignature;
