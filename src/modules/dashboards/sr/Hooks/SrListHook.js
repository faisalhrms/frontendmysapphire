import { useEffect, useState } from "react";
import { serviceRequestData, downloadServiceRequestReport } from "@modules/dashboards/sr/services/SrList.js";

export const useServiceRequest = () => {
  const [serviceRequest, setServiceRequest] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const service_request = await serviceRequestData(filters);
        setServiceRequest(service_request);
      } catch (error) {
      }
    };
    fetchServiceData();
  }, [filters]);

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const downloadExcel = async () => {
    try {
      const data = await downloadServiceRequestReport(filters);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `service_requests_${new Date().toISOString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
    }
  };

  return { serviceRequest, applyFilters, downloadExcel };
};
