import React, {useRef} from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link } from "react-router-dom";
import { SIZING_COST } from "@modules/customer-hub/routes.js";


const SizingCostList = () => {
  const dataTableRef = useRef();
  const columns = [
    {
      Header: "Actions",
      Cell: ({ row }) => (
          <div className="flex justify-center space-x-2">
              <Link to={SIZING_COST.CREATE.path} state={{id: row.original.id}}>
                  <button className="ti-btn ti-btn-primary ti-btn-sm" title="Edit">
                      <i className="ri-edit-line"/>
                  </button>
              </Link>
          </div>
      ),
    },
    {
      Header: "Range",
      accessor: "range_label",
      Cell: ({ value }) => value || "—",
    },
    { Header: "Min", accessor: "warp_min" },
    { Header: "Max", accessor: "warp_max" },
    {
      Header: "Sizing Cost",
      accessor: "sizing_cost",
      Cell: ({ value }) => (value != null ? Number(value).toFixed(2) : "0.00"),
    },
  ];

  const buttons = (
    <div className="grid grid-cols-1">
      <Link
        to={SIZING_COST.CREATE.path}
        className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
      >
        <i className="ri-add-line font-semibold align-middle" />
      </Link>
    </div>
  );

  return (
    <DataTable
      title="Sizing Cost"
      ref={dataTableRef}
      externalFilters={['tab']}
      columns={columns}
      apiUrl="customer-hub/sizing-cost/datatable/"
      buttons={buttons}
    />
  );
};

export default SizingCostList;
