import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import EquipmentSiteWiseReportTable from "@modules/inventory/components/EquipmentSiteWiseReportTable.jsx";

const EquipmentSiteWiseReport = () => {
    return (
        <>
            <PageHeader currentpage="Asset Site Wise Report" mainpage="Reports" />
            <EquipmentSiteWiseReportTable
                title="Asset Site Wise Report"
                apiUrl="/equipments/report-site-wise-data/"
            />
        </>
    );
};

export default EquipmentSiteWiseReport;
