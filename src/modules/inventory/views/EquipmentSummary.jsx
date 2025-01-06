import { useState } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader";
import DataTable from "@components/DataTable.jsx";

const EquipmentSummary = () => {
  const columns = [
    { Header: "Site", accessor: "site" },
    { Header: "Type", accessor: "type" },
    { Header: "No", accessor: "no" },
  ];

  return (
    <>
      <PageHeader
        currentpage="Equipment Summary Report"
        activepage="equipments"
        mainpage="Report"
      />
      <DataTable
        columns={columns}
        title="EquipmentSummary"
        apiUrl=""
      />
    </>
  );
};

export default EquipmentSummary;
