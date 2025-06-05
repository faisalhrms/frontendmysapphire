// src/modules/recruitment/ApplicantsList.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { RECRUITMENTS_ROUTES } from "@modules/recruitment/routes.js";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import { formatDate } from "@helpers/dateTime.js";
import { useHasPermission } from "@modules/auth/hooks/authHooks.js";
import ApplicantStatusDropDown from "@modules/recruitment/components/ApplicantStatusDropDown.jsx";
import IconTabs from "@components/IconTabs.jsx"; // Import IconTabs component

const ApplicantsTable = ({ apiUrl, title }) => {
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
            Header: "Applicant Status",
            accessor: "status",
            filterable: true,
            filterType: "select",
            filterOptions: [
                { label: "Recommended", value: "recommended" },
                { label: "Not Recommended", value: "not_recommended" },
                { label: "Park for the role", value: "park_for_the_role" },
                { label: "Blacklist", value: "blacklist" },
                { label: "Submitted", value: "submitted" },
            ],
            Cell: ({ row }) => {
                const canChangeStatus = useHasPermission("auth.change_applicant_status");
                return canChangeStatus ? (
                    <ApplicantStatusDropDown
                        status={row.original.status}
                        applicantId={row.original.id}
                    />
                ) : (
                    <span className={getBadgeClasses(row.original.status)}>
            {toTitleCase(row.original.status)}
          </span>
                );
            },
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
            Header: "Years in Role",
            accessor: "experiences",
            disableSortBy: true,
            Cell: ({ row }) => {
                const experience = row.original.experiences?.[0];
                const yearsInRole = experience ? parseFloat(experience.years_in_role).toFixed(1) : "0.0";
                return <span>{yearsInRole}</span>;
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
        <DataTable
            columns={columns}
            title={title}
            apiUrl={apiUrl}
            buttons={buttons}
            enableAdvancedFilters={true}
        />
    );
};
export default ApplicantsTable