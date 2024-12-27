import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import {Link} from "react-router-dom";
import {SUBSCRIPTION_ROUTES} from "@modules/subscription/routes.js";
import {getBadgeClasses} from "@helpers/badges.js";
import {formatAmountWithCommas, toTitleCase} from "@helpers/formatters.js";
import { useLocation } from "react-router-dom";
import React from "react";
import HasPermission from "@components/HasPermission.jsx";

const SubscriptionList = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const filterType = queryParams.get("filter");
    const columns = [
        { Header: "Platform Name", accessor: "name" },
        {Header: 'Status', Cell: ({ row }) => (
           <span className={ getBadgeClasses(row.original.status) }>{ toTitleCase(row.original.status) }</span>
         )},
        {Header: 'Type', Cell: ({ row }) => (
                toTitleCase(row.original.type)
            )},
        { Header: "Vendor", accessor: "vendor.name" },
        { Header: "Reminder Days", accessor: "reminder_days" },
        {
            Header: "Amount",
            accessor: "amount",
            Cell: ({ value }) => formatAmountWithCommas(value),
        },
        {Header: 'Departments', Cell: ({ row }) => (
                <span className='space-x-1 rtl:space-x-reverse'>
                    {(
                        row.original.departments.map(department => (
                            <span key={department.id} className="badge bg-primary/10 text-primary">{toTitleCase(department.name)}</span>
                        ))
                    )}
                </span>
            )
        },
        {
            Header: 'Actions',
            Cell: ({row}) => (

                    <div className="flex space-x-2">
                        <HasPermission permission="change_subscription">
                  <Link to={`/module/subscription/edit/${row.original.id }`}>
                        <button
                         className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line"></i>
                        </button>
                        </Link>
                        </HasPermission>
                        <HasPermission permission="view_subscription">
                        <Link to={`/module/subscription/detail/${row.original.id }`}>
                            <button
                                className="ti-btn ti-btn-info ti-btn-sm">
                                <i className="ri-eye-line"></i>
                            </button>
                        </Link>
                        </HasPermission>
                    </div>

                ),
            },
    ];

    const buttons = (
        <HasPermission permission='add_subscription'>
        <div className="flex space-x-2">
            <Link to={SUBSCRIPTION_ROUTES.CREATE.path}
                  className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
                <i className="ri-add-line font-semibold align-middle"></i> Add Subscription
            </Link>
        </div>
         </HasPermission>

    );
    return (
        <>
            <PageHeader currentpage="Subscriptions" mainpage="Subscriptions"/>
            <DataTable
                columns={columns}
                title="Subscriptions"
                buttons={buttons}
                apiUrl={`/subscriptions/`}
                filter={filterType}
            />
        </>
    )
}

export default SubscriptionList;

