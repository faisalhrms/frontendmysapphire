import { useEffect, useState } from "react";
import { serviceRequestData } from "@modules/dashboards/sr/services/SrList.js";

export const useServiceRequest = () => {
  const [serviceRequest, setServiceRequest] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const service_request = await serviceRequestData();
        setServiceRequest(service_request);
      } catch (error) {
        console.error("Error fetching service request data:", error.message);
      }
    };

    fetchServiceData();
  }, []);

  return { serviceRequest };
};
