import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@modules/layouts/includes/PageHeader';
import DataTable from "@components/DataTable.jsx";
import RoleModal from '../components/RoleModel';
import HasPermission from "@components/HasPermission.jsx";

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
        { Header: 'ID', accessor: 'id' },
        { Header: 'Name', accessor: 'name' },
        {
            Header: 'Actions',
            Cell: ({ row }) => {
                console.log("row.original.name:", row.original.name);
                return (
                  <div className="flex space-x-2">
                      <HasPermission permission='role_update'>

                      <button onClick={() => handleEdit(row.original)} className="ti-btn ti-btn-primary ti-btn-sm">
                      <i className="ri-edit-line"></i>
                    </button>
                          </HasPermission>
                      <HasPermission permission='permission_matrix'>
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
    ];

    const buttons = (
        <HasPermission permission='role_create'>
        <div className="flex space-x-2">
            <button
                type="button"
                onClick={() => setIsRoleModalOpen(true)}
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i> Create Role
            </button>
        </div>
        </HasPermission>
    );

    return (
        <>
            <PageHeader currentpage="Roles" activepage="User" mainpage="Roles" />
            <DataTable
                columns={columns}
                title="Roles"
                apiUrl="/roles/datatable"
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
