import { useState } from 'react'; 
import PageHeader from '@modules/layouts/includes/PageHeader';
import DataTable from "@components/DataTable.jsx";
import PermissionModal from '../components/PermissionModel';

const Role = () => {
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(null);

    const handleModalOpen = (permission = null) => {
        setSelectedPermission(permission);
        setIsPermissionModalOpen(true);
    };

    const columns = [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Name', accessor: 'name' },
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

    const buttons = (
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
            <PageHeader currentpage="Roles" activepage="User" mainpage="Permissions" />
            <DataTable
                columns={columns}
                title="Permissions"
                apiUrl="/permissions/datatable/"
                buttons={buttons}
            />
            <PermissionModal
                isOpen={isPermissionModalOpen}
                onClose={() => setIsPermissionModalOpen(false)}
                permission={selectedPermission}
            />
        </>
    );
};

export default Role;
