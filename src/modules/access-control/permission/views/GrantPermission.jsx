import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '@modules/layouts/includes/PageHeader.jsx';
import PermissionTable from '@modules/access-control/permission/components/PermissionTable.jsx';
import { useParams } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import {
  getPermissions,
  getAssignedPermissions,
  AssignPermissionsToRole,
} from '@modules/access-control/services/accessService.js';

const GrantPermission = () => {
  const { id } = useParams();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmittingLoading] = useState(false);

  const COLUMNS = useMemo(() => [
    {
      Header: 'Permissions',
      accessor: 'roleWithPermissions',
    },
    {
      Header: 'Control',
      accessor: 'checkboxes',
    },
  ], []);

  useEffect(() => {
    const fetchPermissionsData = async () => {
      setLoading(true);
      try {
        const [permissionsList, assignedPermissionsData] = await Promise.all([
          getPermissions(),
          getAssignedPermissions(id),
        ]);



        const formattedAssignedPermissions = Array.isArray(assignedPermissionsData)
            ? assignedPermissionsData.reduce((acc, { id, codename }) => {
              acc[id] = { codename, checked: false };
              return acc;
            }, {})
            : {};

        const formattedPermissions = formatPermissions(permissionsList, formattedAssignedPermissions);


        setPermissions(formattedPermissions);
      } catch (err) {
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchPermissionsData();
  }, [id]);

  const handleSavePermissions = async () => {
    try {
      setIsSubmittingLoading(true);

      const selectedPermissionIds = permissions.flatMap(permissionGroup =>
          Object.keys(permissionGroup.roleWithPermissions.permissions)
              .filter(id => permissionGroup.roleWithPermissions.permissions[id].checked)
              .map(id => parseInt(id))
      );

      await AssignPermissionsToRole(id, selectedPermissionIds);
    } catch (error) {
      console.error('Error saving permissions:', error);
    } finally {
      setIsSubmittingLoading(false);
    }
  };

  const handleUpdatePermissions = (updatedData) => {
    setPermissions(updatedData);
  };


  const formatPermissions = (data, assignedPermissions) => {
    const groupedPermissions = data.reduce((acc, permission) => {
      const { id, name, codename } = permission;

      let roleName = codename.includes('_')
          ? codename.split('_').slice(0, -1).join('_').toUpperCase()
          : codename.toUpperCase();

      if (!acc[roleName]) acc[roleName] = [];
      acc[roleName].push({ id, name, codename });
      return acc;
    }, {});

    return Object.keys(groupedPermissions).map(role => ({
      roleWithPermissions: {
        roleName: role,
        permissions: groupedPermissions[role].reduce((acc, { id, name, codename }) => {
          acc[id] = {
            name,
            checked: !!(assignedPermissions[id] && assignedPermissions[id].codename === codename),
          };
          return acc;
        }, {}),
      },
    }));
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-[200px]">
          <Oval color={`rgb(var(--primary))`} height={30} width={30} />
        </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
      <>
        <PageHeader currentpage="Role" activepage="Dashboard" mainpage="Roles" />
        <div className="box w-full max-h-4xl p-8 mx-auto">
          <div className="box-body">
            <div className="overflow-hidden">
              <PermissionTable
                  columns={COLUMNS}
                  data={permissions}
                  isSubmitting={isSubmitting}
                  onUpdatePermissions={handleUpdatePermissions}
                  onSavePermissions={handleSavePermissions}
              />
            </div>
          </div>
        </div>
      </>
  );
};

export default GrantPermission;
