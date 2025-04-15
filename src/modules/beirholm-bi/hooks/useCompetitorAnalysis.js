import { useEffect, useState } from "react";
import { getCompetitorData } from "@modules/beirholm-bi/services/competitorData.js";

export const useCompetitorAnalysis = ({ competitorCompany, filters, currencyValue }) => {
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (competitorCompany && filters.length > 0) {
      setIsLoading(true);
      const payload = {
        competitor_company: competitorCompany,
        filters: filters,
        currency: currencyValue
      };
      getCompetitorData(payload)
        .then(response => {
          const data = response.data ? response.data : response;
          setApiData(data);
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
        });
    }
  }, [competitorCompany, filters.join(","), currencyValue]);

  return { apiData, isLoading };
};
