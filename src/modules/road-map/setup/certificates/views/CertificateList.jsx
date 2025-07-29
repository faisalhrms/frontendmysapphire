import React, {useState} from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import {Link} from "react-router-dom";
import {toTitleCase} from "@helpers/formatters.js";
import {Certificate} from "@modules/road-map/routes.js";

const CertificateList = () => {

    const columns = [
        {
            Header: "Actions",
            Cell: ({row}) => (
                <div className="flex space-x-2">
                    <Link to={Certificate.CREATE.path} state={{id: row.original.id}}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line"></i>
                        </button>
                    </Link>
                </div>
            )
        },
        {
            Header: "Certificate Type",
            accessor: "certificate_type.name",
            Cell: ({value}) => toTitleCase(value ?? "N/A")
        },
        {
            Header: "Certificate Name",
            accessor: "name",
            Cell: ({value}) => toTitleCase(value ?? "N/A")
        },
        {
            Header: "Certificate Logo",
            accessor: "media",
            Cell: ({row}) => {
                const media = row.original.media;
                const thumb = media?.medium_url;
                return thumb ? (
                    <div className="flex items-center justify-center">
                        <a href={media.file_url} target="_blank" rel="noopener noreferrer">
                        <img src={thumb} alt={row.original.name} className={"h-14 w-14 object-contain"}/>
                        </a>
                    </div>
                ) : (
                    "-"
                );
            }
        },
    ];


    const buttons = (
        <div className="grid grid-cols-1 sm:grid-cols-1">
            <Link
                to={Certificate.CREATE.path}
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i> Add
            </Link>
        </div>
    );

    return (
        <>
            <DataTable
                columns={columns}
                title="Certificates"
                apiUrl="certificate/datatable/"
                externalFilters={['tab']}
                buttons={buttons}
            />
        </>
    );
};
export default CertificateList;
