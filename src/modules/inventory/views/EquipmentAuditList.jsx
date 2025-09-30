import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import {formatDate} from "@helpers/dateTime.js";
import {ShieldCheck } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

const EquipmentAuditList = () => {
    const columns = [
        {
            Header: "Company",
            accessor: "location_subnet.company.name",
            filterType: "text",
            filterable: true,
            filterKey: "location_subnet__location__company__name",
        },
        {
            Header: "Location",
            accessor: "location_subnet.location.name",
            filterType: 'text',
            filterable: true,
            filterKey: 'location_subnet__location__name',
        },
        {
            Header: "Subnet",
            accessor: "location_subnet.ip",
            filterType: 'text',
            filterable: true,
            filterKey: 'location_subnet__ip',
        },
        { Header: "Asset Tag", accessor: "asset_tag", filterType: 'text', filterable: true },
        { Header: "Device Type", accessor: "device_type", filterType: 'text', filterable: true },
        { Header: "OS", accessor: "os", filterType: 'text', filterable: true },
        { Header: "Computer Name", accessor: "computer_name", filterType: 'text', filterable: true },
        { Header: "Domain Name", accessor: "domain_name", filterType: 'text', filterable: true },
        { Header: "Manufacturer", accessor: "manufacturer", filterType: 'text', filterable: true },
        { Header: "System Model", accessor: "system_model", filterType: 'text', filterable: true },
        { Header: "Serial No", accessor: "serial_no", filterType: 'text', filterable: true },
        { Header: "CPU", accessor: "cpu_name", filterType: 'text', filterable: true },
        { Header: "RAM (GB)", accessor: "ram_gb", filterType: 'number', filterable: true },
        { Header: "RAM Slots", accessor: "rams", filterType: 'number', filterable: true },
        { Header: "Disk (GB)", accessor: "hard_disk_gb", filterType: 'number', filterable: true },
        { Header: "Disk Type", accessor: "disk_type", filterType: 'text', filterable: true },
        { Header: "No. of Disks", accessor: "hard_disks", filterType: 'number', filterable: true },
        { Header: "Display Size", accessor: "display_size", filterType: 'text', filterable: true },
        { Header: "MAC Address", accessor: "mac_address", filterType: 'text', filterable: true },
        { Header: "Current User", accessor: "current_user1", filterType: 'text', filterable: true },
        { Header: "Outlook Email", accessor: "outlook_email", filterType: 'text', filterable: true },
        { Header: "Antivirus", accessor: "antivirus", filterType: 'text', filterable: true },
        { Header: "VPN", accessor: "vpn", filterType: 'text', filterable: true },
        { Header: "Email Server", accessor: "email_server", filterType: 'text', filterable: true },
        { Header: "IP Address", accessor: "ip_address", filterType: 'text', filterable: true },
        {
            Header: "Created At",
            accessor: "created_at",
            filterType: 'date',
            filterable: true,
        },
        {
            Header: "Updated At",
            accessor: "updated_at",
            filterType: 'date',
            filterable: true,
        }
    ];


    return (
        <>
            <IconPageHeader
                heading="Equipment Audits"
                description="Track, review, and manage equipment audit records with ease."
                icon={ShieldCheck  }
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
