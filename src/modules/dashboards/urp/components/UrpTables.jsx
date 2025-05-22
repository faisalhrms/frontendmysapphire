import React, { useState } from 'react';
import PageHeader from '@modules/layouts/includes/PageHeader';
import DataTable from '@components/DataTable.jsx';
import HasPermission from '@components/HasPermission.jsx';
import {Link, useNavigate} from "react-router-dom";
import RoleModal from "@modules/access-control/role/components/RoleModel.jsx";
import PermissionModal from "@modules/access-control/permission/components/PermissionModel.jsx";
import Notify from "@helpers/toastNotifications.js";

const UrpTables = () => {
    const navigate = useNavigate();
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [allRolesChecked, setAllRolesChecked] = useState(false);
    const [allPermissionsChecked, setAllPermissionsChecked] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(null);

    const toggleRole = id => {
        setSelectedRoles(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleEdit = (role) => {

        setEditingRole(role);
        setIsRoleModalOpen(true);

    };

    const handleModalOpen = (permission = null) => {
        setSelectedPermission(permission);
        setIsPermissionModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsRoleModalOpen(false);
        setEditingRole(null);
    };
    const toggleAllRoles = () => {
        setAllRolesChecked(prev => {
            const next = !prev;
            setSelectedRoles(next ? 'all' : []);
            return next;
        });
    };

    const togglePermission = id => {
        setSelectedPermissions(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAllPermissions = () => {
        setAllPermissionsChecked(prev => {
            const next = !prev;
            setSelectedPermissions(next ? 'all' : []);
            return next;
        });
    };

    const roleColumns = [
        {
            Header: <input type="checkbox" onChange={toggleAllRoles} checked={allRolesChecked} />,
            accessor: 'checkbox',
            disableSortBy: true,
            Cell: ({ row }) => {
                const id = row.original.id;
                const checked = selectedRoles === 'all' || selectedRoles.includes(id);
                return (
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRole(id)}
                    />
                );
            }
        },
        { Header: 'Name', accessor: 'name' },
        {
            Header: 'Actions',
            Cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        <HasPermission permission='auth.change_group'>

                            <button onClick={() => handleEdit(row.original)} className="ti-btn ti-btn-primary ti-btn-sm">
                                <i className="ri-edit-line"></i>
                            </button>
                        </HasPermission>
                        <HasPermission permission='auth.manage_permission'>
                            <Link
                                to={{
                                    pathname: `/module/users/roles/${row.original.id}/permissions`,

                                }}
                                className="ti-btn ti-btn-info ti-btn-sm"
                            >
                                <i className="ri-user-settings-line"></i>
                            </Link>
                        </HasPermission>
                    </div>

                );
            }

        },
    ];

    const permissionColumns = [
        {
            Header: <input type="checkbox" onChange={toggleAllPermissions} checked={allPermissionsChecked} />,
            accessor: 'checkbox',
            disableSortBy: true,
            Cell: ({ row }) => {
                const id = row.original.id;
                const checked = selectedPermissions === 'all' || selectedPermissions.includes(id);
                return (
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePermission(id)}
                    />
                );
            }
        },
        { Header: 'Name', accessor: 'codename' },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <button onClick={() => handleModalOpen(row.original)} className="ti-btn ti-btn-primary ti-btn-sm">
                        <i className="ri-edit-line"></i>
                    </button>
                </div>
            ),
        },
    ];

    const handleRoleDetail = () => {
        let ids;
        if (selectedRoles === 'all') {
            ids = '0';
        } else if (Array.isArray(selectedRoles)) {
            ids = selectedRoles.join(',');
        } else {
            Notify.error('Invalid selection');
            return;
        }
        navigate(`/module/users/roles/details?ids=${ids}`);
    };

    const handlePermissionDetail = () => {
        let ids;
        if (selectedPermissions === 'all') {
            ids = '0';
        } else if (Array.isArray(selectedPermissions)) {
            ids = selectedPermissions.join(',');
        } else {
            Notify.error('Invalid selection');
            return;
        }
        navigate(`/module/users/permissions/details?ids=${ids}`);
    };

    const roleButton = (
        // <HasPermission permission='role_create'>
        <div className="flex space-x-2">
            <button
                type="button"
                onClick={() => setIsRoleModalOpen(true)}
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i> Create Role
            </button>
        </div>
        // </HasPermission>
    );
    const permissionButton = (
        <div className="flex space-x-2">
            <button
                type="button"
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                onClick={() => handleModalOpen()}
            >
                <i className="ri-add-line font-semibold align-middle"></i> Create Permission
            </button>
        </div>
    );
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div>
                    {selectedRoles.length > 0 && (
                        <button className="ti-btn ti-btn-info mb-2" onClick={handleRoleDetail}>
                            Detail View
                        </button>
                    )}
                    <DataTable
                        columns={roleColumns}
                        apiUrl="/groups/datatable/"
                        title="Roles"
                        buttons={roleButton}
                    />
                    <RoleModal
                        isOpen={isRoleModalOpen}
                        onClose={handleCloseModal}
                        role={editingRole}
                    />
                </div>

                <div>
                    {selectedPermissions.length > 0 && (
                        <button className="ti-btn ti-btn-info mb-2" onClick={handlePermissionDetail}>
                            Detail View
                        </button>
                    )}
                    <DataTable
                        columns={permissionColumns}
                        apiUrl="/permissions/datatable/"
                        title="Permissions"
                        buttons={permissionButton}
                    />
                    <PermissionModal
                        isOpen={isPermissionModalOpen}
                        onClose={() => setIsPermissionModalOpen(false)}
                        permission={selectedPermission}
                    />
                </div>
            </div>
        </>
    );
};

export default UrpTables;
