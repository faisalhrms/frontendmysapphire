import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@modules/layouts/includes/PageHeader';
import DataTable from "@components/datatable/DataTable.jsx";
import RoleModal from '../components/RoleModel';
import HasPermission from "@components/HasPermission.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {HardDrive} from "lucide-react";

const Role = () => {
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    const handleEdit = (role) => {

        setEditingRole(role);
        setIsRoleModalOpen(true); 

    };

    const handleCloseModal = () => {
        setIsRoleModalOpen(false);
        setEditingRole(null);
    };

    const columns = [
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
                        pathname: `${row.original.id}/permissions`,
                        
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
        { Header: 'ID', accessor: 'id' },
        { Header: 'Name', accessor: 'name' },
       
    ];

    const buttons = (
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

    return (
        <>
            <IconPageHeader
                heading="Roles"
                description="Define user roles and assign related permissions to manage access control."
                icon={HardDrive}
            />
            <DataTable
                columns={columns}
                title="Roles"
                apiUrl="/groups/datatable/"
                buttons={buttons}
            />


            <RoleModal
                isOpen={isRoleModalOpen}
                onClose={handleCloseModal}
                role={editingRole}
            />
        </>
    );
};

export default Role;
