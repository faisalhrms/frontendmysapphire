import React from "react";
import { useParams } from "react-router-dom";

import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import CompanyForm from "@modules/setup/components/CompanyForm.jsx";


const CompanyEdit = () => {
  const {id} = useParams();

  return (
    <div>
      <PageHeader
        currentpage="Edit Company"
        activepage="Company "
        mainpage="Edit Company"
      />
      <CompanyForm isEditMode={true} />
    </div>
  );
};

export default CompanyEdit;
