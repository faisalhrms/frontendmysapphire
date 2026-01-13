import React from "react";
import { useParams } from "react-router-dom";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { Target } from "lucide-react";
import {useCompetitor} from "@modules/beirholm-bi/hooks/competitorsHooks.js";
import CompetitorsForm from "@modules/beirholm-bi/components/CompetitorsForm.jsx";


const CompetitorsEdit = () => {
  const { id } = useParams();
  const { competitorData } = useCompetitor(id);

  return (
    <>
      <IconPageHeader
        heading="Edit Competitor Analysis"
        description="Update competitor type, title, and attachments."
        icon={Target}
      />
      <CompetitorsForm competitorData={competitorData || {}} isEditMode />
    </>
  );
};

export default CompetitorsEdit;
