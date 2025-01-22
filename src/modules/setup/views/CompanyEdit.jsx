import React from "react";
import { useParams } from "react-router-dom";

import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import Company from "@modules/company/components/Company.jsx";


const CompanyEdit = () => {
  const {id} = useParams();

  return (
    <div>
      <PageHeader
        currentpage="Edit Company"
        activepage="Company "
        mainpage="Edit Company"
      />
      <Company isEditMode={true} />
    </div>
  );
};

export default CompanyEdit;
