import React from "react";
import { Link } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatDate } from "@helpers/dateTime.js";
import { POLICIES_ROUTES } from "@modules/policies/routes.js";
import {Shield} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

const LocationSubnetList = () => {


    const columns = [
        {
            Header: "Actions",
            id: "actions",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex justify-center space-x-2">
                    <Link to={`/module/asset/setups/subnets/edit/${row.original.id}`}>
                        <button
                            className="ti-btn ti-btn-primary ti-btn-sm"
                            title="Edit"
                        >
                            <i className="ri-edit-line"></i>
                        </button>
                    </Link>
                </div>
            ),
        },
        {
            Header: "Location",
            accessor: "location.name",
            filterable: true,
            filterType: "text",
            filterKey: "location__name",
            Cell: ({ row }) => row.original.location?.name || "N/A",
        },
        {
            Header: "IP Addresses",
            accessor: "ips_csv",
            filterable: true,
            filterType: "text",
            Cell: ({ value }) =>
                value ? value.split(",").map((ip, i) => (
                    <span
                        key={i}
                        className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-1"
                    >
          {ip.trim()}
        </span>
                )) : "N/A",
        },
        {
            Header: "Total IPs",
            accessor: "ip_count",
            filterable: true,
            filterType: "number",
            Cell: ({ value }) => value ?? 0,
        },
    ];

    const buttons = (
        <Link
            to={`/module/asset/setups/subnets/add`}
            className="whitespace-nowrap ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
        >
            <i className="ri-add-line font-semibold align-middle"></i> Add Location Subnet
        </Link>
    );

    return (
        <>
            <IconPageHeader
                heading="Location Subnets"
                description="Manage Location Subnets."
                icon={Shield}
            />
            <DataTable
                columns={columns}
                title="Location Subnets"
                apiUrl={`/location-subnets/datatable/`}
                buttons={buttons}
                needHeader={false}
                enableAdvancedFilters={true}
            />
        </>
    );
};

export default LocationSubnetList;
