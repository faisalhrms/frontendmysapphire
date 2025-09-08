// EquipmentAuditDashboard.jsx
import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import { useEquipmentAudit } from "@modules/dashboards/eq-aud/hooks/useEquipmentAuditHook.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { EquipmentBarChart } from "@modules/dashboards/eq-aud/components/EquipmentBarChart.jsx";
import { EquipmentPieChart } from "@modules/dashboards/eq-aud/components/EquipmentPieChart.jsx";

const EquipmentAuditDashboard = () => {
    const { auditData, loading } = useEquipmentAudit();
console.log(`auditData`,auditData)
    if (loading) return <LoadingSpinner />;

    return (
        <>
            <PageHeader
                currentpage="Equipment Audit Dashboard"
                activepage="Dashboard"
                mainpage="Equipment Audit"
            />

            <div className="grid grid-cols-12 gap-x-6 mb-6">
                {/* Location Bar Chart (col-8) */}
                <div className="xl:col-span-8 col-span-12 box">
                    <div className="box-header bg-green/10">
                        <div className="box-title dark:text-white">Equipment by Location</div>
                    </div>
                    <div className="box-body">
                        <EquipmentBarChart data={auditData.location || []} labelKey="location" />
                    </div>
                </div>

                {/* Device Type Pie Chart (col-4) */}
                <div className="xl:col-span-4 col-span-12 box">
                    <div className="box-header bg-secondary/10">
                        <div className="box-title dark:text-white">Equipment by Device Type</div>
                    </div>
                    <div className="box-body">
                        <EquipmentPieChart data={auditData.device_type || []} labelKey="device_type" />
                    </div>
                </div>
            </div>

            {/* Manufacturer, Antivirus, VPN */}
            <div className="grid grid-cols-12 gap-x-6 mb-6">
                <div className="xl:col-span-4 col-span-12 box">
                    <div className="box-header bg-purple/10">
                        <div className="box-title dark:text-white">Equipment by Manufacturer</div>
                    </div>
                    <div className="box-body">
                        <EquipmentPieChart data={auditData.manufacturer || []} labelKey="manufacturer" />
                    </div>
                </div>

                <div className="xl:col-span-4 col-span-12 box">
                    <div className="box-header bg-green/10">
                        <div className="box-title dark:text-white">Equipment by Antivirus</div>
                    </div>
                    <div className="box-body">
                        <EquipmentPieChart data={auditData.antivirus || []} labelKey="antivirus" />
                    </div>
                </div>

                <div className="xl:col-span-4 col-span-12 box">
                    <div className="box-header bg-orange/10">
                        <div className="box-title dark:text-white">Equipment by VPN</div>
                    </div>
                    <div className="box-body">
                        <EquipmentPieChart data={auditData.vpn || []} labelKey="vpn" />
                    </div>
                </div>
            </div>

            {/* Domain, Email Server, Disk Type */}
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xl:col-span-4 col-span-12 box">
                    <div className="box-header bg-red/10">
                        <div className="box-title dark:text-white">Equipment by Domain Name</div>
                    </div>
                    <div className="box-body">
                        <EquipmentPieChart data={auditData.domain_name || []} labelKey="domain_name" />
                    </div>
                </div>

                <div className="xl:col-span-4 col-span-12 box">
                    <div className="box-header bg-blue/10">
                        <div className="box-title dark:text-white">Equipment by Email Server</div>
                    </div>
                    <div className="box-body">
                        <EquipmentPieChart data={auditData.email_server || []} labelKey="email_server" />
                    </div>
                </div>

                <div className="xl:col-span-4 col-span-12 box">
                    <div className="box-header bg-yellow/10">
                        <div className="box-title dark:text-white">Equipment by Disk Type</div>
                    </div>
                    <div className="box-body">
                        <EquipmentPieChart data={auditData.disk_type || []} labelKey="disk_type" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default EquipmentAuditDashboard;
