import React from 'react';
import PageHeader from '@modules/layouts/includes/PageHeader';
import DataTable from "@components/DataTable.jsx";
import { useNavigate } from "react-router-dom";
import { getBadgeClasses } from "@helpers/badges.js";
import { toTitleCase } from "@helpers/formatters.js";
import Phone from "@mui/icons-material/Phone";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import HasPermission from "@components/HasPermission.jsx";
import Avatar from "@components/Avatar.jsx";
import { USER_ROUTES } from '@modules/user/routes'; // Make sure the correct path is used

const UserList = () => {
    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate(`/module/users/edit/${id}`);
    };

    const columns = [
        {
            Header: 'Name',
            accessor: 'full_name',
            Cell: ({ row }) => (
                <div className="flex items-center">
                    <Avatar
                        avatar={row.original.avatar}
                        size='md'
                        parentClasses='bg-primary/10 !fill-primary'
                    />
                    <div className='ms-2'>
                        <p className="font-semibold mb-0 flex items-center">{row.original.full_name}</p>
                        <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                            {row.original.employee.emp_code}
                        </p>
                    </div>
                </div>
            )
        },
        {
            Header: 'Company',
            accessor: 'employee.company.name',
            Cell: ({ value }) => <span>{value}</span>
        },
        {
            Header: 'Email',
            accessor: 'email',
            Cell: ({ value }) => (
                <div className="flex items-center space-x-2">
                    <i className="ri-mail-line"></i>
                    <span>{value}</span>
                </div>
            )
        },
        {
            Header: 'Department',
            accessor: 'employee.department.name',
            Cell: ({ value }) => <span>{value}</span>
        },
        {
            Header: 'Sub Department',
            accessor: 'employee.sub_department.name',
            Cell: ({ value }) => <span>{value}</span>
        },
        {
            Header: 'Designation',
            accessor: 'employee.designation.name',
            Cell: ({ value }) => <span>{value}</span>
        },
        {
            Header: 'Position',
            accessor: 'employee.position.name',
            Cell: ({ value }) => <span>{value}</span>
        },
        {
            Header: 'Location',
            accessor: 'employee.location.name',
            Cell: ({ value }) => <span>{value}</span>
        },
        {
            Header: 'Gender',
            accessor: 'employee.gender',
            Cell: ({ row }) => {
                const gender = row.original.employee.gender;
                let GenderIcon;
                let genderLabel;

                switch (gender) {
                    case 'M':
                        GenderIcon = MaleIcon;
                        genderLabel = 'Male';
                        break;
                    case 'F':
                        GenderIcon = FemaleIcon;
                        genderLabel = 'Female';
                        break;
                    case 'O':
                        GenderIcon = TransgenderIcon;
                        genderLabel = 'Other';
                        break;
                    default:
                        GenderIcon = null;
                        genderLabel = 'Unknown';
                }

                return (
                    <div className="flex items-center space-x-2">
                        {GenderIcon && <GenderIcon className="icon-grey" />}
                        <span>{genderLabel}</span>
                    </div>
                );
            }
        },
        {
            Header: 'Phone',
            accessor: 'employee.phone',
            Cell: ({ value }) => (
                <div className="flex items-center space-x-2">
                    <Phone className="icon-grey" />
                    <span>{value}</span>
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
                    {value.map((group, index) => (
                        <span key={index} className="badge bg-primary/10 text-primary">
                            {toTitleCase(group)}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            Header: 'Actions',
            accessor: 'id', // Adding accessor for better performance
            Cell: ({ value }) => (
                <HasPermission permission='change_user'>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEdit(value)}
                            className="ti-btn ti-btn-primary ti-btn-sm"
                        >
                            <i className="ri-edit-line"></i>
                        </button>
                    </div>
                </HasPermission>
            ),
        },
    ];

    const buttons = (
        <HasPermission permission='add_user'>
            <div className="flex space-x-2">
                <button
                    type="button"
                    className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                    onClick={() => navigate(USER_ROUTES.CREATE.path)}
                >
                    <i className="ri-add-line font-semibold align-middle"></i> Create User
                </button>
            </div>
        </HasPermission>
    );

    return (
        <>
            <PageHeader currentpage="Users" mainpage="Users" />
            <DataTable
                columns={columns}
                title="Users"
                buttons={buttons}
                apiUrl="/users/datatable/"
            />
        </>
    );
};

export default UserList;
