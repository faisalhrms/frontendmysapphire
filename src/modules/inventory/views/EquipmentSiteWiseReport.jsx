import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import EquipmentSiteWiseReportTable from "@modules/inventory/components/EquipmentSiteWiseReportTable.jsx";

const EquipmentSiteWiseReport = () => {
    return (
        <>
            <PageHeader currentpage="Equipment Site Wise Report" mainpage="Reports" />
            <EquipmentSiteWiseReportTable
                title="Equipment Site Wise Report"
                apiUrl="/equipments/report-site-wise-data/"
            />
        </>
    );
};

export default EquipmentSiteWiseReport;
