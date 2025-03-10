import {useEffect, useState} from "react";
import {serviceRequestData, downloadServiceRequestReport} from "@modules/dashboards/sr/services/SrList.js";

export const useServiceRequest = (initialFilters = {}) => {
  const [serviceRequest, setServiceRequest] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const data = await serviceRequestData(filters);
        setServiceRequest(data);
      } catch (error) {}
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
    } catch (error) {}
  };
  return {serviceRequest, applyFilters, downloadExcel};
};
