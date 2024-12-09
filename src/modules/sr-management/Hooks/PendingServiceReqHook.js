import { useEffect, useState } from "react";
import { createTask, getServiceRequestById } from "@modules/sr-management/services/Pending.js";
import { useNavigate } from "react-router-dom";

export const useServiceRequest = (id) => {
  const [pendingReqData, setpendingReqData] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getServiceRequestById(id);
        setpendingReqData(data);
      } catch (error) {
        console.error("Error fetching Service data:", error.message);
      }
    };

    fetchService();
  }, [id]);

  return { pendingReqData };
};

export const usePendingReqTaskForm = (pendingReqData) => {
  console.log(`PendingReqData: `, pendingReqData);
  const navigate = useNavigate();

  const handleTaskSubmit = async (data) => {
    try {
      const requestData = {
        service_request_id: pendingReqData.id,
        location_id: data.location_id || pendingReqData.location_id,
        department_id: data.department_id || pendingReqData.department_id,
        sub_department_id: data.sub_department_id || pendingReqData.sub_department_id,
        sr_type_id: data.sr_type_id,
        description: data.description,
        started_at: data.started_at || new Date().toISOString().split('T')[0],
        ended_at: data.ended_at || null,
        user_ids: Array.isArray(data.user_ids) ? data.user_ids : [data.user_ids],
        attachment_ids: Array.isArray(data.attachment_ids) ? data.attachment_ids : [data.attachment_ids],
      };

      console.log("Submitting request data:", requestData);

      await createTask(pendingReqData.id, requestData);
      navigate('/module/srm');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return { handleTaskSubmit };
};
