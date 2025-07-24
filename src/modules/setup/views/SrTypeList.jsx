import React, { useEffect, useState } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link, useNavigate } from "react-router-dom";
import { toTitleCase } from "@helpers/formatters.js";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

const CompanyList = () => {
    const router = useNavigate();


    const updateSrType = async (id, srTypeData) => {

        router("/module/sr/add/");
    };

    const columns = [
        {
            Header: "Actions",
            Cell: ({ row }) => {
                console.log(row);

                return (
                    <div className="flex space-x-2">
                        <Link
                            to="/module/sr/add/"
                            state={{ id: row.original.id }}
                        >
                            <button className="ti-btn ti-btn-primary ti-btn-sm" title="Edit">
                                <i className="ri-edit-line"></i>
                            </button>
                        </Link>
                    </div>
                );
            },
        },
        {
            Header: "Name",
            accessor: "name",
        },
        {
            Header: "Short Name",
            accessor: "short_name",
            Cell: ({ value }) => toTitleCase(value),
        },
        {
            Header: "Department",
            accessor: "sr_type_joins",
            Cell: ({ row }) => {
                const departmentName =
                    row?.original?.sr_type_joins?.[0]?.department?.name || "";
                return <span>{departmentName}</span>;
            },
        },
        {
            Header: "Sub Department",
            accessor: "sub_department",
            Cell: ({ row }) => {
                const departmentName =
                    row?.original?.sr_type_joins?.[0]?.sub_department?.name || "";
                return <span>{departmentName}</span>;
            },
        },
    ];

    const buttons = (
        <div className="grid grid-cols-1 sm:grid-cols-1">
            <Link
                to={`/module/sr/add/`}
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i> Add
            </Link>
        </div>
    );

    return (
        <>
            <PageHeader currentpage="SrType" mainpage="SrType" />
            <DataTable
                columns={columns}
                title="Sr Type"
                apiUrl="/setups/sr-types/datatable/"
                buttons={buttons}
            />
        </>
    );
};

export default CompanyList;
