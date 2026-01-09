import React from "react";
import { Link } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatDate } from "@helpers/dateTime.js";
import { useHasPermission } from "@modules/auth/hooks/authHooks.js";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { Target } from "lucide-react";
import {COMPETITORS_ROUTES} from "@modules/beirholm-bi/routes.js";

const CompetitorsList = () => {
  const renderIcon = (attachment) => {
    const { file_type } = attachment;
    if (file_type?.startsWith("image")) return <i className="ri-image-line" />;
    if (file_type?.startsWith("video")) return <i className="ri-video-line" />;
    if (file_type?.startsWith("audio")) return <i className="ri-user-voice-line" />;
    return <i className="ti ti-file-text" />;
  };

  const columns = [
    {
      Header: "Actions",
      accessor: "id",
      disableSortBy: true,
      Cell: ({ row }) => {
        const id = row.original.id;
        const canEdit = useHasPermission("beirholm_bi.change_competitors");
        return (
          <div className="flex space-x-2">
            {canEdit && (
              <Link to={`/competitors/edit/${id}`}>
                <button className="ti-btn ti-btn-primary ti-btn-sm">
                  <i className="ri-edit-line" />
                </button>
              </Link>
            )}
          </div>
        );
      },
    },
    {
      Header: "Competitor Type",
      accessor: "competitor_type",
      filterable: true,
      filterType: "text",
      Cell: ({ value }) => value || "N/A",
    },
    {
      Header: "Title",
      accessor: "title",
      filterable: true,
      filterType: "text",
      Cell: ({ value }) => value || "N/A",
    },
    {
      Header: "Attachments",
      accessor: "attachments",
      disableSortBy: true,
      Cell: ({ row }) => {
        const attachments = row.original.attachments || [];
        if (attachments.length === 0) return "N/A";
        return (
          <div className="flex space-x-2">
            {attachments.map((att, idx) => (
              <Link
                key={idx}
                to={att.file_url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${att.file_name}.${att.file_extension}`}
                className="text-xl hover:text-primary"
              >
                {renderIcon(att)}
              </Link>
            ))}
          </div>
        );
      },
    },
    {
      Header: "Created By",
      accessor: "created_by",
      Cell: ({ row }) => row.original.created_by?.name || "N/A",
    },
    {
      Header: "Created At",
      accessor: "created_at",
      filterable: true,
      filterType: "datetime",
      Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy - HH:mm") : "N/A"),
    },
  ];

  const buttons = (
    <Link
      to={COMPETITORS_ROUTES.ADD.path}
      className="whitespace-nowrap ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
    >
      <i className="ri-add-line font-semibold align-middle" /> Add Competitor Analysis
    </Link>
  );

  return (
    <>
      <IconPageHeader
        heading="Competitor Analysis"
        description="Manage competitor analysis entries and related attachments."
        icon={Target}
      />
      <DataTable
        columns={columns}
        title="Competitor Analysis"
        apiUrl="/competitors/datatable/"
        buttons={buttons}
        needHeader={false}
        enableAdvancedFilters={true}
      />
    </>
  );
};

export default CompetitorsList;
