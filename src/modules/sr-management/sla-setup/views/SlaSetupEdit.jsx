import React from "react";
import { useParams } from "react-router-dom";

import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import SlaSetupForm from "@modules/sr-management/sla-setup/component/SlaSetupForm.jsx";


const SlaSetupEdit = () => {
  const {id} = useParams();

  return (
    <div>
      <PageHeader
        currentpage="Edit SLA Setup"
        activepage="SLA Setup"
        mainpage="Edit SLA Setup"
      />
      <SlaSetupForm isEditMode={true} />
    </div>
  );
};

export default SlaSetupEdit;
