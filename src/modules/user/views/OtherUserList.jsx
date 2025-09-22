import React, {useCallback, useMemo, useState} from 'react';
import PageHeader from '@modules/layouts/includes/PageHeader';
import DataTable from "@components/datatable/DataTable.jsx";
import {Link, useNavigate} from "react-router-dom";
import { getBadgeClasses } from "@helpers/badges.js";
import { toTitleCase } from "@helpers/formatters.js";
import Phone from "@mui/icons-material/Phone";
import Avatar from "@components/Avatar.jsx";
import { USER_ROUTES } from '@modules/user/routes';
import useFilters from "@hooks/useFilters.js";
import OtherUserListFilter from "@modules/user/components/OtherUserListFilter.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {HardDrive} from "lucide-react";
import HasPermission from "@components/HasPermission.jsx";

const OtherUserList = () => {

    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        errors,
        getFilters,
        resetFilters,
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: "group_ids" },
                    { name: "company_id" },
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());
    const onSubmit = useCallback((formData) => {
        setFilters(formData);
    }, []);

    const onClear = useCallback(() => {
        resetFilters();
        setFilters(getFilters());
    }, [resetFilters, getFilters]);

    const columns = [
        {
            Header: 'Actions',
            accessor: 'id',
            disableSortBy: true,
            Cell: ({ value }) => (
                <HasPermission permission="user.change_user">
                    <div className="flex space-x-2">
                        <Link
                            to={`/module/users/others/edit/${value}`}
                        >
                            <button
                                className="ti-btn ti-btn-primary ti-btn-sm"
                                title="Edit User"
                            >
                                <i className="ri-edit-line"></i>
                            </button>
                        </Link>
                    </div>
                </HasPermission>
            ),

        },
        {
            Header: 'Name',
            accessor: 'full_name',
            Cell: ({ row }) => (

                <div className="flex items-center">
                    <Avatar
                        avatar={row.original.avatar ? row.original.avatar : null}
                        full_name={row.original.full_name || 'N/A'}
                        size='md'
                        parentClasses='dark:text-gray-200 dark:bg-bodybg'
                    />
                    <div className='ms-2'>
                        <p className="font-semibold mb-0 flex items-center">
                            {row.original.full_name || 'N/A'}
                        </p>
                        <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                            {row.original?.email || 'N/A'}
                        </p>
                    </div>
                </div>
            )
        },
        {
            Header: 'Company',
            accessor: 'company.name',
            Cell: ({value}) => <span>{value || 'N/A'}</span>
        },
        {
            Header: 'Phone',
            accessor: 'phone',
            Cell: ({ value }) => (
                <div className="flex items-center space-x-2">
                    <Phone className="icon-grey" />
                    <span>{value || 'N/A'}</span>
                </div>
            )
        },
        {
            Header: 'Status',
            accessor: 'is_active',
            Cell: ({ value }) => {
                const status = value ? 'active' : 'inactive';
                const statusLabel = value ? 'Active' : 'Inactive';
                return (
                    <span className={getBadgeClasses(status, '!rounded-full')}>
                        {toTitleCase(statusLabel)}
                    </span>
                );
            },

        },
        {
            Header: 'Roles',
            accessor: 'groups',
            Cell: ({ value }) => (
                <div className="space-x-1 rtl:space-x-reverse">
                    {Array.isArray(value) && value.length > 0 ? (
                        [...new Set(value)].map((group, index) => (
                            <span key={index} className="badge bg-primary/10 text-primary">
                                {toTitleCase(group.name)}
                            </span>
                        ))
                    ) : (
                        <span className="badge bg-gray-200 text-gray-800">No Roles</span>
                    )}
                </div>
            ),
        },
        {
            Header: 'Created by',
            accessor: 'created_by',
            Cell: ({ value }) => (
                <div className="flex items-center">
                    <Avatar
                        avatar={value?.avatar ? value?.avatar : null}
                        full_name={value?.full_name || 'N A'}
                        size='md'
                        parentClasses='dark:text-gray-200 dark:bg-bodybg'
                    />
                    <div className='ms-2'>
                        <p className="font-semibold mb-0 flex items-center">
                            {value?.full_name || 'N/A'}
                        </p>
                        <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                            {value?.email || 'N/A'}
                        </p>
                    </div>
                </div>
            )
        },

    ];

    const buttons = (
        <div className="flex space-x-2">
            <button
                type="button"
                    className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                    onClick={() => navigate(USER_ROUTES.OTHER_USER.CREATE.path)}
                >
                    <i className="ri-add-line font-semibold align-middle"></i> Add
                </button>
            </div>

    );

    return (
        <>
            <IconPageHeader
                heading="Other Users"
                description="View and manage users outside the core admin group, including their roles and permissions."
                icon={HardDrive}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <OtherUserListFilter control={control} errors={errors} clearFilter={onClear}/>
            </form>
            <DataTable
                columns={columns}
                buttons={buttons}
                apiUrl="/users/others/datatable/"
                filter={filters}

            />
        </>
    );
};

export default OtherUserList;
