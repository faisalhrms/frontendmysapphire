import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { BEIRHOLM_BI_ROUTES } from "@modules/beirholm-bi/routes.js";
import { toTitleCase } from "@helpers/formatters.js";

const ExchangeRateList = () => {
  const columns = [
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link to={BEIRHOLM_BI_ROUTES.EXCHANGE_RATE_CREATE.path} state={{ id: row.original.id }}>
            <button className="ti-btn ti-btn-primary ti-btn-sm">
              <i className="ri-edit-line"></i>
            </button>
          </Link>
        </div>
      ),
    },
    {
      Header: "Country",
      accessor: (row) => toTitleCase(row.product_country),
    },
    {
      Header: "Exchange Rate",
      accessor: "rate",
    },
    {
      Header: "Effective Date",
      accessor: (row) => {
        if (row.effective_date) {
          const d = new Date(row.effective_date);
          return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        }
        return "";
      },
    },
  ];

  const buttons = (
    <div className="grid grid-cols-1 sm:grid-cols-1">
      <Link
        to={BEIRHOLM_BI_ROUTES.EXCHANGE_RATE_CREATE.path}
        className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-add-line font-semibold align-middle"></i> Add
      </Link>
    </div>
  );

  return (
    <>
      <PageHeader currentpage="Exchange Rates" mainpage="Exchange Rates" />
      <DataTable columns={columns} title="Exchange Rates" apiUrl="exchange/rate/datatable/" buttons={buttons} />
    </>
  );
};

export default ExchangeRateList;
