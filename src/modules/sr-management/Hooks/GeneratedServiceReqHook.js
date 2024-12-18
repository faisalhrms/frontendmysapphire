import { useEffect, useState } from "react";
import { getServiceRequestById, getTaskById } from "@modules/sr-management/services/Pending.js";

export const useServiceRequest = (id) => {
  const [generatedReqData, setGeneratedReqData] = useState(null);
  const [serviceRequest, setServiceRequest] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const serviceRequestData = await getServiceRequestById(id);

        if (serviceRequestData) {
          // Check if the service request has `sr_task_id`
          if (serviceRequestData.sr_task_id) {
            const taskData = await getTaskById(serviceRequestData.sr_task_id);

            setGeneratedReqData(taskData);

            // Check if taskData has a service_request, else fall back to serviceRequestData
            setServiceRequest(taskData?.service_request || serviceRequestData);
          } else {
            // Directly set serviceRequestData if no sr_task_id exists
            setServiceRequest(serviceRequestData);
          }
        } else {
          console.error("No data found for ServiceRequest.");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchServiceData();
  }, [id]);

  return { generatedReqData, serviceRequest };
};
