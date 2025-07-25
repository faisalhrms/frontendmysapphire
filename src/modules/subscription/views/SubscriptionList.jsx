import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SUBSCRIPTION_ROUTES } from "@modules/subscription/routes.js";
import {getBadgeClasses, getStatusClasses} from "@helpers/badges.js";
import { formatAmountWithCommas, toTitleCase } from "@helpers/formatters.js";
import React from "react";
import HasPermission from "@components/HasPermission.jsx";

const SubscriptionList = () => {
   const [excludeCanceled, setExcludeCanceled] = React.useState(false);
    const toggleCanceled = () => {
        setExcludeCanceled((prev) => !prev);
    };

    const columns = [
        {
            Header: "Actions",
            accessor: 'id',
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <HasPermission permission="subscription.change_subscription">
                        <Link to={`/module/subscription/edit/${row.original.id}`}>
                            <button className="ti-btn ti-btn-primary ti-btn-sm">
                                <i className="ri-edit-line"></i>
                            </button>
                        </Link>
                    </HasPermission>
                    <HasPermission permission="subscription.view_subscription">
                        <Link to={`/module/subscription/detail/${row.original.id}`}>
                            <button className="ti-btn ti-btn-info ti-btn-sm">
                                <i className="ri-eye-line"></i>
                            </button>
                        </Link>
                    </HasPermission>
                </div>
            ),
        },
        { Header: "Platform Name", accessor: "name" },
        {
            Header: "Status",
            Cell: ({ row }) => (
                <span className={getStatusClasses(row.original.status)}>
          {toTitleCase(row.original.status)}
        </span>
            ),
        },
        {
            Header: "Type",

            Cell: ({ row }) => toTitleCase(row.original.type),
        },
        { Header: "Vendor", accessor: "vendor.name" },
        { Header: "Reminder Days", accessor: "reminder_days" },
        {
            Header: "Amount",
            accessor: "amount",
            Cell: ({ value }) =>
                value === null ? "Nill" : formatAmountWithCommas(value),
        },
        {
            Header: "Departments",
            accessor: "departments",
            Cell: ({ row }) => (
                <span className="space-x-1 rtl:space-x-reverse">
          {row.original.departments.map((department) => (
              <span key={department.id} className="badge bg-primary/10 text-primary">
              {toTitleCase(department.name)}
            </span>
          ))}
        </span>
            ),
        },
    ];

    const buttons = (
        <div className="flex items-center space-x-2">
            <HasPermission permission="subscription.add_subscription">
                <Link
                    to={SUBSCRIPTION_ROUTES.CREATE.path}
                    className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                >
                    <i className="ri-add-line font-semibold align-middle"></i> Add Subscription
                </Link>
            </HasPermission>

            <button
                type="button"
                onClick={toggleCanceled}
                className="ti-btn ti-btn-secondary !py-1 !px-2 !text-[0.75rem]"
            >
                {excludeCanceled ? "Include Canceled" : "Exclude Canceled"}
            </button>
        </div>
    );

    return (
        <>
            <PageHeader currentpage="Subscriptions" mainpage="Subscriptions" />
            <DataTable
                columns={columns}
                title="Subscriptions"
                buttons={buttons}
                apiUrl={`/subscriptions/`}
                externalFilters={['filter']}
            />
        </>
    );
};

export default SubscriptionList;
