import React from "react";
import DataTable from "@components/DataTable.jsx";
import { Link } from "react-router-dom";
import { toTitleCase } from "@helpers/formatters.js";
import { ROADMAP_Quality } from "@modules/road-map/routes.js";
import pdfIcon from "@assets/images/icon/pdf.png";

const RoadMapQualityList = () => {
  const columns = [
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <Link
          to={ROADMAP_Quality.CREATE.path}
          state={{ id: row.original.id }}
          className="ti-btn ti-btn-primary ti-btn-sm"
        >
          <i className="ri-edit-line" />
        </Link>
      ),
    },
    {
      Header: "Business Unit",
      accessor: "business_unit_label",
      Cell: ({ value }) => toTitleCase(value ?? "N/A"),
    },
    {
      Header: "Quality Code",
      accessor: "code",
      Cell: ({ value }) => toTitleCase(value ?? "N/A"),
    },
    {
      Header: "Labels",
      accessor: "label_certificates",
      Cell: ({ row }) => {
        const labels = row.original.label_certificates || [];
        if (!labels.length) return "N/A";

        return (
          <div className="flex items-center space-x-2">
            {labels.map((label) => {
              const media = label.media;
              const src   = media?.medium_url || media?.file_url;

              return src ? (
                <a
                  key={label.id}
                  href={media.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="avatar avatar-lg">
                    <img src={src} alt={label.name} />
                  </span>
                </a>
              ) : (
                <span key={label.id} className="inline-block text-xs">
                  {label.name}
                </span>
              );
            })}
          </div>
        );
      },
    },

    {
      Header: "TDS PDF",
      accessor: "tds_pdf_url",
      Cell: ({ value }) =>
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            title="Download TDS"
          >
            <img alt='TDS' src={pdfIcon} className="w-9 h-9"/>
          </a>
        ) : (
          "N/A"
        ),
      disableSortBy: true,
    },
  ];

  const buttons = (
    <Link
      to={ROADMAP_Quality.CREATE.path}
      className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
    >
      <i className="ri-add-line font-semibold align-middle" /> Add
    </Link>
  );

  return (
    <DataTable
      columns={columns}
      title="Qualities"
      apiUrl="quality/datatable"
      buttons={buttons}
    />
  );
};

export default RoadMapQualityList;
