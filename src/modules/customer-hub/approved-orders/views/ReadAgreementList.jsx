import React, { useRef, useMemo } from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link } from "react-router-dom";
import { READ_AGREEMENTS } from "@modules/customer-hub/routes.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

const badge = (v) =>
  v === "completed"
    ? <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700">Completed</span>
    : <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">Pending</span>;

const fmtDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "—");

const ReadAgreementList = () => {
  const dataTableRef = useRef();

  const columns = useMemo(() => [
    {
      Header: "Actions",
      id: "actions",
      Cell: ({ row }) => (
        <div className="flex justify-center">
          <Link to={READ_AGREEMENTS.DETAIL.path} state={{ id: row.original.id }}>
            <button className="ti-btn ti-btn-primary ti-btn-sm" title="View Details">
              <i className="ri-eye-2-line" />
            </button>
          </Link>
        </div>
      ),
      disableSortBy: true,
    },
    { Header: "Agreement No.", accessor: "agreement_no" },
    { Header: "Greige Item Code", accessor: "greige_item_code" },
    { Header: "Quality Code", accessor: "quality_code" },
    { Header: "Greige Design", accessor: "greige_design" },
    { Header: "Greige Color", accessor: "greige_color" },
    { Header: "Greige Width", accessor: "greige_width" },
    { Header: "Yarn Status", accessor: "yarn_terms_status", Cell: ({ value }) => badge(value) },
    { Header: "Fabric Delivery status", accessor: "fabric_delivery_status", Cell: ({ value }) => badge(value) },
    { Header: "Need By Date", accessor: "need_by_date", Cell: ({ value }) => fmtDate(value) },
  ], []);

  return (
    <div>
      <PageHeader currentpage="Agreement Placements List" activepage="Agreement Placements read" mainpage="Agreement Placements List" />
      <DataTable
        title="Agreement Placements"
        ref={dataTableRef}
        columns={columns}
        apiUrl="customer-hub/agreements/read-datatable/"
      />
    </div>
  );
};

export default ReadAgreementList;
