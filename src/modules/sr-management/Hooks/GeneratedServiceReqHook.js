import { useEffect, useState } from "react";
import { getServiceRequestById, getTaskById } from "@modules/sr-management/services/Pending.js";

export const useServiceRequest = (id) => {
  const [generatedReqData, setGeneratedReqData] = useState(null);
  const [serviceRequest, setServiceRequest] = useState(null);

  const fetchServiceData = async () => {
    try {
      const serviceRequestData = await getServiceRequestById(id);
      if (serviceRequestData) {
        if (serviceRequestData.sr_task_id) {
          const taskData = await getTaskById(serviceRequestData.sr_task_id);
          setGeneratedReqData(taskData);
          setServiceRequest(taskData?.service_request || serviceRequestData);
        } else {
          setServiceRequest(serviceRequestData);
        }
      } else {
        console.error("No data found for ServiceRequest.");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, [id]);

  return { generatedReqData, serviceRequest, refreshServiceData: fetchServiceData };
};
