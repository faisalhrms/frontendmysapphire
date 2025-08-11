import { useEffect, useState } from "react";
import { serviceRequestData, downloadServiceRequestReport } from "@modules/dashboards/sr/services/SrList.js";

export const useServiceRequest = (initialFilters = {}) => {
  const [serviceRequest, setServiceRequest] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setServiceRequest(null);
    (async () => {
      try {
        const data = await serviceRequestData(filters);
        if (!cancelled) setServiceRequest(data);
      } catch (_) {
        if (!cancelled) setServiceRequest({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const applyFilters = (newFilters) => {
    setServiceRequest(null);
    setFilters(newFilters);
  };

  const downloadExcel = async () => {
    setIsDownloading(true);
    try {
      const data = await downloadServiceRequestReport(filters);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `service_requests_${new Date().toISOString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  return { serviceRequest, applyFilters, downloadExcel, isDownloading };
};
