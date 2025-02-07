import React from "react";
import { useParams } from "react-router-dom";

import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DigitalProfileForm from "@modules/digital-profiles/component/DigitalProfileForm.jsx";


const DigitalProfileEdit = () => {
  const {id} = useParams();

  return (
    <div>
      <PageHeader
        currentpage="Edit Digital Profiles"
        activepage="Digital Profiles "
        mainpage="Edit Digital Profiles"
      />
      <DigitalProfileForm isEditMode={true} />
    </div>
  );
};

export default DigitalProfileEdit;
