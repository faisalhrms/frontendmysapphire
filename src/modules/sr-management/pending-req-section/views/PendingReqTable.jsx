import React, {useState} from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import {useNavigate} from "react-router-dom";
import {format} from "date-fns";
import {closeServiceRequest} from "@modules/sr-management/services/Pending.js";
import ConfirmationModal from "@modules/sr-management/component/ConfirmationModal.jsx";
import Tooltip from "@components/Tooltip.jsx";
import HighlightCell from "@modules/sr-management/component/HighlightCell.jsx";
import {toTitleCase} from "@helpers/formatters.js";

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
        {
            Header: "Actions",
            accessor: "actions",
            Cell: ({row}) => {
                const {id} = row.original;
                return (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onCreateTask(id)}
                            className="ti-btn ti-btn-primary ti-btn-sm"
                        >
                            <i className="ri-calendar-check-line"/>
                        </button>
                        <button
                            onClick={() => onOpenModal(id)}
                            className="ti-btn ti-btn-danger ti-btn-sm"
                        >
                            <i className="ri-close-circle-line"/>
                        </button>
                    </div>
                );
            },
        },
        {
          Header: "SR #",
          accessor: "sr_number",
          Cell: ({ value, row }) => (
            <div className="flex items-center space-x-1">
              <span className={row.original.is_read ? "" : "font-semibold"}>
                {value}
              </span>
              {!row.original.is_read && <i className="ri-message-2-line text-danger" />}
            </div>
          ),
        },
        {
            Header: "Task Type",
            accessor: "sr_type.name",
            Cell: ({value}) => value || "N/A",
        },
        {
            Header: "Requester Location",
            accessor: "location.name",
            Cell: ({value}) => value || "N/A",
        },
        {
            Header: "Request Title",
            accessor: "request_title",
            width: 300,
            Cell: ({value, row}) =>
                value ? (
                    <Tooltip id={`request-tooltip-${row.index}`} text={value} tooltipContent={value}>
                        <HighlightCell highlight={!row.original.is_read}>
                            {value.length > 25 ? `${value.slice(0, 25)}...` : value}
                        </HighlightCell>
                    </Tooltip>
                ) : (
                    "-"
                ),
        },
        {
            Header: "SR Time",
            accessor: "created_at",
            Cell: ({ value }) => (
                <div className="space-x-1 rtl:space-x-reverse">
                    {value ? format(new Date(value), "MMM d, yyyy, h:mm a") : <span className="text-gray-500">N/A</span>}
                </div>
            ),
            getCellProps: () => ({
                className: `!text-center bg-info/10 text-info`
            })
        },
         {
            Header: "Requester",
            accessor: "reporter",
            width: 250,
            Cell: ({value}) =>
                value ? (
                    <span className="badge !rounded-full bg-light text-default">
            {value}
          </span>
                ) : (
                    <span className="text-gray-500">N/A</span>
                ),
        },
        {
            Header: "Assignee",
            accessor: "assignee",
            Cell: ({ value }) => (
                <div className="space-x-1 rtl:space-x-reverse">
                    {Array.isArray(value) && value.length > 0 ? (
                        [...new Set(value.flatMap(task => task.assignees.map(a => toTitleCase(a.name))))]
                            .map((assignee, index) => assignee)
                    ) : (
                        <span className="text-gray-500">No Assignees</span>
                    )}
                </div>
            ),
            getCellProps: () => ({
                className: `!text-center bg-indigo/10 text-blue`
            })
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                apiUrl="service-request/pending/sr/"
                title="Task Pending"
                externalFilters={['status']}
            />
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
