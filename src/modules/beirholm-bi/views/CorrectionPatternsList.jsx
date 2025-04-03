import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { Link } from "react-router-dom";
import { BEIRHOLM_BI_ROUTES } from "@modules/beirholm-bi/routes.js";

const CorrectionPatternsList = () => {
  const columns = [
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link to={BEIRHOLM_BI_ROUTES.CORRECTION_PATTERN_CREATE.path} state={{ id: row.original.id }}>
            <button className="ti-btn ti-btn-primary ti-btn-sm">
              <i className="ri-edit-line"></i>
            </button>
          </Link>
        </div>
      ),
    },
    {
      Header: "Header Name",
      accessor: "header.name"
    },
    {
      Header: "Pattern",
      accessor: "pattern"
    },
    {
      Header: "Correct Pattern",
      accessor: "correct_pattern"
    }
  ];

  const buttons = (
    <div className="grid grid-cols-1 sm:grid-cols-1">
      <Link
        to={BEIRHOLM_BI_ROUTES.CORRECTION_PATTERN_CREATE.path}
        className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-add-line font-semibold align-middle"></i> Add
      </Link>
    </div>
  );

  return (
    <>
      <PageHeader currentpage="Correction Patterns" mainpage="Correction Patterns" />
      <DataTable
        columns={columns}
        title="Correction Patterns"
        apiUrl="error/correction/pattern/datatable/"
        buttons={buttons}
      />
    </>
  );
};

export default CorrectionPatternsList;
