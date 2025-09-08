import React from "react";
import EquipmentSiteWiseReportTable from "@modules/inventory/components/EquipmentSiteWiseReportTable.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {MapPinned } from "lucide-react";

const EquipmentSiteWiseReport = () => {
    return (
        <>
            <IconPageHeader
                heading="Asset Site Wise Report"
                description="Review asset reports organized by site."
                icon={MapPinned}
            />
            <EquipmentSiteWiseReportTable
                title="Asset Site Wise Report"
                apiUrl="/equipments/report-site-wise-data/"
            />
        </>
    );
};

export default EquipmentSiteWiseReport;
