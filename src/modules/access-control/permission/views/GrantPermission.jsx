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
    { Header: 'Permissions', accessor: 'codename' },
    { Header: 'Description', accessor: 'name' },
    { Header: 'Action', accessor: 'checkboxes' },
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

        const formattedPermissions = formatPermissions(
            permissionsList,
            formattedAssignedPermissions
        );

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
              .filter(pid => permissionGroup.roleWithPermissions.permissions[pid].checked)
              .map(pid => parseInt(pid))
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
      const appName = codename.split('.')[0];
      if (!acc[appName]) acc[appName] = [];
      acc[appName].push({ id, name, codename });
      return acc;
    }, {});

    return Object.keys(groupedPermissions).map(appName => ({
      roleWithPermissions: {
        roleName: appName.toUpperCase(),
        permissions: groupedPermissions[appName].reduce(
            (acc, { id, name, codename }) => {
              acc[id] = {
                codename,
                name: name || '-',
                checked: !!(
                    assignedPermissions[id] &&
                    assignedPermissions[id].codename === codename
                ),
              };
              return acc;
            },
            {}
        ),
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
    return <div className="text-red">{error}</div>;
  }

  return (
      <>
        <PageHeader
            currentpage="Grant Permissions"
            activepage="Role"
            mainpage="Grant Permissions"
        />
        <div className="box w-full max-h-4xl p-8 mx-auto">
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
      </>
  );
};

export default GrantPermission;
