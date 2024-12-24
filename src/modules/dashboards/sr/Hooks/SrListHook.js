import { useEffect, useState } from "react";
import { serviceRequestData, downloadServiceRequestReport } from "@modules/dashboards/sr/services/SrList.js";

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

    const downloadExcel = async () => {
        try {
            const data = await downloadServiceRequestReport();
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `service_requests_${new Date().toISOString()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading Excel report:", error.message);
        }
    };

    return { serviceRequest, downloadExcel };
};
