import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import api from "@config/axiosConfig.js";
import ProjectStatusDropdown from "@modules/project-management/components/dropdowns/ProjectStatusDropdown.jsx";

export default function ConversionTable() {
    const { control, formState: { errors } } = useForm();
    const [data, setData] = useState([]);

    useEffect(() => {
        api.get("/setups/sr-types/datatable/")
            .then((response) => setData(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const columns = [
        { Header: "Group", accessor: "group" },
        { Header: "Site", accessor: "site" },
        { Header: "Activation", accessor: "activations" },
        { Header: "Order", accessor: "orders" },
        { Header: "Merchandise Total", accessor: "merchandiseTotal" },
        { Header: "Avg Merchandise Total Per Usage ", accessor: "avgMerchPerUsage" },
        { Header: "Avg Merchandise Total Per Order  ", accessor: "avgMerchPerOrder" },
        { Header: "Items Per Order", accessor: "itemsPerOrder" },
        { Header: "Order Conversion" , accessor: "orderConversion" },
    ];


    const buttons = (
        <div className="grid grid-cols- sm:grid-cols-1">
            <ProjectStatusDropdown control={control} errors={errors} />
        </div>
    );

    return (
        <>
            <div className="flex justify-between items-center">
                <PageHeader currentpage="Analysis Report" />
            </div>
            <DataTable title="Conversion" columns={columns} data={data}  buttons={buttons}/>
        </>
    );
}

