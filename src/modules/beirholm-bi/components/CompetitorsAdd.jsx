import React from "react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { Target } from "lucide-react";
import CompetitorsForm from "@modules/beirholm-bi/components/CompetitorsForm.jsx";

const CompetitorsAdd = () => {
  return (
    <>
      <IconPageHeader
        heading="Add Competitor Analysis"
        description="Create a competitor analysis record and attach supporting documents."
        icon={Target}
      />
      <CompetitorsForm />
    </>
  );
};

export default CompetitorsAdd;
