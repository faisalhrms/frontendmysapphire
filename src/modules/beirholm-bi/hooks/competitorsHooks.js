import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    createCompetitor,
    getCompetitorById,
    updateCompetitor
} from "@modules/beirholm-bi/services/competitorsService.js";
import {COMPETITORS_ROUTES} from "@modules/beirholm-bi/routes.js";

export const useCompetitorForm = (competitorData = {}, isEditMode = false) => {
  const navigate = useNavigate();

  const handleCompetitorSubmit = async (data) => {
    try {
      const payload = {
        competitor_type: data.competitor_type,
        title: data.title,
        attachment_ids: data.attachment_ids || [],
      };

      if (isEditMode) {
        await updateCompetitor(competitorData.id, payload);
      } else {
        await createCompetitor(payload);
      }
      navigate(COMPETITORS_ROUTES.READ.path);
    } catch (error) {
    }
  };

  return { handleCompetitorSubmit };
};

export const useCompetitor = (id) => {
  const [competitorData, setCompetitorData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCompetitorById(id);
        setCompetitorData(data);
      } catch (err) {
      }
    };
    if (id) fetch();
  }, [id]);

  return { competitorData };
};
