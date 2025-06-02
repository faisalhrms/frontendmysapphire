// src/modules/recruitment/ApplicantsList.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { RECRUITMENTS_ROUTES } from "@modules/recruitment/routes.js"; // define ADD, EDIT, DETAIL here
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import {formatDate} from "@helpers/dateTime.js";

const ApplicantsList = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const statusFilter = params.get("status") || "";

    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Link to={`/recruitment/applicants/edit/${row.original.id}`}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line" />
                        </button>
                    </Link>
                    <Link to={`/recruitment/applicants/detail/${row.original.id}`}>
                        <button className="ti-btn ti-btn-info ti-btn-sm">
                            <i className="ri-eye-line" />
                        </button>
                    </Link>
                </div>
            ),
        },
        {
            Header: "Full Name",
            accessor: "full_name",
            filterable: true,
            filterType: "text",
        },
        {
            Header: "CNIC",
            accessor: "cnic",
            filterable: true,
            filterType: "text",
        },
        {
            Header: "Status",
            accessor: "status",
            filterable: true,
            filterType: "select",
            filterOptions: [
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
            ],
            Cell: ({ row }) => (
                <span className={getBadgeClasses(row.original.status)}>
          {toTitleCase(row.original.status)}
        </span>
            ),
        },
        {
            Header: "Qualifications",
            accessor: "qualifications",
            disableSortBy: true,
            Cell: ({ row }) => (
                <span>
          {row.original.qualifications.map((q) => q.level).join(", ")}
        </span>
            ),
        },
        {
            Header: "Total Experience (Years)",
            accessor: "experiences",
            disableSortBy: true,
            Cell: ({ row }) => {
                const totalExperience = row.original.experiences
                    .reduce((sum, experience) => {
                        const years = parseFloat(experience.total_experience_years) || 0;
                        return sum + years;
                    }, 0)
                    .toFixed(1); // Ensure one decimal place for consistency
                return <span>{totalExperience}</span>;
            },
        },
        {
            Header: "Recommended Positions",
            accessor: "recommended_positions",
            disableSortBy: true,
            Cell: ({ row }) => (
                <span>
          {row.original.recommended_positions
              .map((p) => p.name)
              .join(", ")}
        </span>
            ),
        },
        {
            Header: "Location",
            accessor: "created_by_location.name",
            filterable: true,
            filterType: "text",
            filterKey: "created_by_location__name",
        },
        {
            Header: "Applied On",
            accessor: "created_at",
            Cell: ({ value }) => formatDate(value, "MMM dd, yyyy - HH:mm"),
            filterType: 'datetime',
            filterable: true,
        },
    ];
    const buttons = (
        <Link
            to={RECRUITMENTS_ROUTES.ADD.path}
            className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
        >
            <i className="ri-add-line font-semibold align-middle" /> Add Applicant
        </Link>
    );

    return (
        <>
            <PageHeader currentpage="Applicants" mainpage="Recruitment" />

            <DataTable
                columns={columns}
                title="Applicants"
                apiUrl={`/recruitment/applicants/datatable/?status=${statusFilter}`}
                buttons={buttons}
                enableAdvancedFilters={true}
            />
        </>
    );
};

export default ApplicantsList;
