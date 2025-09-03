import React from "react";
import { Link } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatDate } from "@helpers/dateTime.js";
import { Shield } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

const EquipmentAuditList = () => {
    const columns = [

        { Header: "Location", accessor: "location_subnet.location.name", Cell: ({ row }) => row.original.location_subnet?.location?.name || "N/A" },
        { Header: "Subnet", accessor: "location_subnet.ip", Cell: ({ row }) => row.original.location_subnet?.ip || "N/A" },
        { Header: "Asset Tag", accessor: "asset_tag" },
        { Header: "Device Type", accessor: "device_type" },
        { Header: "OS", accessor: "os" },
        { Header: "Computer Name", accessor: "computer_name" },
        { Header: "Domain Name", accessor: "domain_name" },
        { Header: "Manufacturer", accessor: "manufacturer" },
        { Header: "System Model", accessor: "system_model" },
        { Header: "Serial No", accessor: "serial_no" },
        { Header: "CPU", accessor: "cpu_name" },
        { Header: "RAM (GB)", accessor: "ram_gb" },
        { Header: "RAM Slots", accessor: "rams" },
        { Header: "Disk (GB)", accessor: "hard_disk_gb" },
        { Header: "Disk Type", accessor: "disk_type" },
        { Header: "No. of Disks", accessor: "hard_disks" },
        { Header: "Display Size", accessor: "display_size" },
        { Header: "MAC Address", accessor: "mac_address" },
        { Header: "Current User", accessor: "current_user1" },
        { Header: "Outlook Email", accessor: "outlook_email" },
        { Header: "Antivirus", accessor: "antivirus" },
        { Header: "VPN", accessor: "vpn" },
        { Header: "Email Server", accessor: "email_server" },
        { Header: "IP Address", accessor: "ip_address" },
        {
            Header: "Created At",
            accessor: "created_at",
            Cell: ({ value }) => (value ? formatDate(value) : "N/A"),
        },
        {
            Header: "Updated At",
            accessor: "updated_at",
            Cell: ({ value }) => (value ? formatDate(value) : "N/A"),
        },
        { Header: "Updated By", accessor: "updated_by", Cell: ({ value }) => value ?? "N/A" },
    ];


    return (
        <>
            <IconPageHeader
                heading="Equipment Audits"
                description="Manage Equipment Audits."
                icon={Shield}
            />
            <DataTable
                columns={columns}
                title="Equipment Audits"
                apiUrl={`/equipment-audits/datatable/`}
                needHeader={false}
                enableAdvancedFilters={true}
            />
        </>
    );
};

export default EquipmentAuditList;
