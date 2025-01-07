import React, { useState } from "react";
import DataTable from "@components/DataTable.jsx";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { closeServiceRequest } from "@modules/sr-management/services/Pending.js";
import ConfirmationModal from "@modules/sr-management/component/ConfirmationModal.jsx";

const PendingRequestsTable = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSRId, setSelectedSRId] = useState(null);

  const onCreateTask = (id) => {
    navigate(`/module/srm/taskpending/${id}`);
  };

  const onOpenModal = (id) => {
    setSelectedSRId(id);
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSRId(null);
  };

  const onConfirmClose = async () => {
    try {
      await closeServiceRequest(selectedSRId);
      setIsModalOpen(false);
      setSelectedSRId(null);
    } catch (error) {
      console.error("Error closing service request:", error);
    }
  };


  const columns = [
    { Header: "SR #", accessor: "sr_number" },
    { Header: "Task Type", accessor: "sr_type.name" },
    { Header: "Requester Location", accessor: "location.name" },
    { Header: "Request Title", accessor: "request_title" },
    {
      Header: "SR Time",
      accessor: "created_at",
      Cell: ({ value }) => (value ? format(new Date(value), "yyyy-MM-dd hh:mm a") : ""),
    },
    { Header: "Requester", accessor: "reporter" },
    { Header: "Assignee", accessor: "assignee" },
    {
      Header: "Action",
      accessor: "status",
      Cell: ({ row }) => {
        const { id } = row.original;
        return (
          <div className="flex space-x-2">
            <button onClick={() => onCreateTask(id)} className="ti-btn ti-btn-primary ti-btn-sm">
              <i className="ri-calendar-check-line"></i>
            </button>
            <button onClick={() => onOpenModal(id)} className="ti-btn ti-btn-danger ti-btn-sm">
              <i className="ri-close-circle-line"></i>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable columns={columns} apiUrl="service-request/pending/sr/" title="Task Pending" />

      {isModalOpen && (
        <ConfirmationModal
          show={isModalOpen}
          message="Are you sure you want to close this service request?"
          onConfirm={onConfirmClose}
          onCancel={onCloseModal}
        />
      )}
    </>
  );
};

export default PendingRequestsTable;
