import React, {useState, useEffect} from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import {toTitleCase} from "@helpers/formatters.js";
import {useParams} from "react-router-dom";
import {useDynamicFormColumns} from "@modules/forms/hooks/dynamicFormHooks.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const FormSubmissionDatatable = () => {
    const {id} = useParams();
    const {data, isLoading} = useDynamicFormColumns(id);
    const [columns, setColumns] = useState([]);
    const [title, setTitle] = useState("Form");

    useEffect(() => {
        if (data) {
            setTitle(data.title || "Form");
            const formattedColumns = data.columns.map((column) => ({
                ...column, Cell: ({value}) => {
                    const iconMap = {
                        created_at: <i className="bi bi-calendar2-date inline-block mr-2 text-gray-500"></i>,
                        ip_address: <i className="bi bi-hdd-network inline-block mr-2 text-fuchsia-300"></i>,
                        country: <i className="bi bi-globe inline-block mr-2 text-emerald-400"></i>,
                        city: <i className="bi bi-building inline-block mr-2 text-amber-950"></i>,
                        pin_location: <i className="bi bi-geo-alt inline-block mr-2 text-warning"></i>,
                        marketing_metadata: <i className="bi bi-tag inline-block mr-2 text-purple"></i>,
                    };

                    if (column.filterType === "file" && value) {
                        return (<a
                                href={`${import.meta.env.VITE_DJANGO_URL}${value}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline"
                            >
                                View File
                            </a>);
                    }
                    if (column.filterType === "select" && Array.isArray(value)) {
                        return value.join(", ");
                    }
                    if (column.filterType === "checkbox" && Array.isArray(value)) {
                        return value.join(", ");
                    }
                    if (column.accessor === "device_info" && value) {
                        let iconClass = "bi bi-laptop";
                        let colorClass = "text-primary";

                        if (value.is_mobile) {
                            iconClass = "bi bi-phone";
                            colorClass = "text-success";
                        } else if (value.is_tablet) {
                            iconClass = "bi bi-tablet";
                            colorClass = "text-warning";
                        } else if (value.is_bot) {
                            iconClass = "bi bi-robot";
                            colorClass = "text-danger";
                        } else if (value.is_pc) {
                            iconClass = "bi bi-pc-display";
                            colorClass = "text-info";
                        }

                        return (
                            <span className="text-gray-600 font-normal flex items-center gap-2">
                                    <i className={`${iconClass} inline-block text-[18px] ${colorClass}`}></i>
                                {value.device_summary}
                            </span>
                        );
                    }
                    if (column.accessor === "marketing_metadata" && value) {
                        return (<span className="text-gray-500 font-normal">
                                    {iconMap.marketing_metadata}{value}
                                </span>);
                    }
                    if (column.accessor === "created_at" && value) {
                        return (<span className="text-primary font-normal">
                                    {iconMap.created_at}
                                {value}
              </span>);
                    }
                    if (column.accessor === "ip_address" && value) {
                        return (<span className="text-gray-500 font-normal">
                {iconMap.ip_address}
                                {value}
              </span>);
                    }
                    if (column.accessor === "country" && value) {
                        return (<span className="text-gray-500 font-normal">
                {iconMap.country}
                                {value}
              </span>);
                    }
                    if (column.accessor === "city" && value) {
                        return (<span className="text-gray-500 font-normal">
                                    {iconMap.city}
                                {value}
                         </span>);
                    }
                    if (column.accessor === "pin_location" && value) {
                        const [lat, lon] = value;
                            return (<span className="text-warning font-normal">
                                {iconMap.pin_location}
                                <a
                                    href={`https://maps.google.com/?q=${lat},${lon}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-warning underline"
                                >
                                    View
                </a>
              </span>);
                    }
                    return (<>
                                {iconMap[column.accessor] || null}
                            {value ?? "N/A"}
                            </>);
                },
            }));
            setColumns(formattedColumns);
        }
    }, [data]);
    if (isLoading) return <LoadingSpinner/>;

    return (<>
            <PageHeader
                currentpage={`${toTitleCase(title)} Form (Submissions)`}
                activepage="Dynamic Form"
                mainpage="Submissions"
            />
            <DataTable
                columns={columns}
                title={`${toTitleCase(title)}`}
                apiUrl={`/forms/submissions/${id}/datatable/`}
                enableAdvancedFilters={true}
            />
        </>);
};

export default FormSubmissionDatatable;