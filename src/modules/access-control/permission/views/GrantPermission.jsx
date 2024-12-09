import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '@modules/layouts/includes/PageHeader.jsx';
import PermissionTable from '@modules/access-control/permission/components/PermissionTable.jsx';
import { useParams } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import {
  getPermissions,
  getAssignedPermissions,
  AssignPermissionsToRole,

} from '@modules/access-control/services/accessService.js'; // Ensure to use the axios instance

const GrantPermission = () => {
  const { id } = useParams();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmittingLoading] = useState(false);

  // Memoize the columns array to avoid recalculating on every render
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

  // Fetch permissions from the API
  useEffect(() => {
    const fetchPermissionsData = async () => {
      setLoading(true);
      try {
        // Fetch both permissions and assigned permissions in parallel
        const [permissionsList, assignedPermissionsData] = await Promise.all([
          getPermissions(),
          getAssignedPermissions(id),
        ]);

        // Check if assigned permissions data is empty
        const formattedAssignedPermissions = Object.keys(assignedPermissionsData).length === 0
            ? {}
            : assignedPermissionsData.reduce((acc, { id, name }) => {
              acc[id] = { name, checked: false };
              return acc;
            }, {});

        // Format and set permissions
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

  // Save permissions
  const handleSavePermissions = async () => {
    try {
      setIsSubmittingLoading(true);
      // Generate the permission IDs that are checked
      const formattedPermissions = permissions.flatMap(permissionGroup =>
          Object.keys(permissionGroup.roleWithPermissions.permissions)
              .filter(id => permissionGroup.roleWithPermissions.permissions[id].checked)
              .map(id => parseInt(id)) // Convert ID to integer
      );

      // Call the savePermissions service
      await AssignPermissionsToRole(id, formattedPermissions);
      setIsSubmittingLoading(false);
      // Optionally, you can show a success notification here
    } catch (error) {
      setIsSubmittingLoading(false);
      console.error('Error saving permissions:', error);

      // Optionally, show an error notification here
    }
  };

  // Handle updates to permissions
  const handleUpdatePermissions = (updatedData) => {
    setPermissions(updatedData);

    // You can send the updatedData to the backend if needed
  };

  // Format permissions into the desired structure
  const formatPermissions = (data, assignedPermissions) => {
    const groupedPermissions = data.reduce((acc, permission) => {
      const { id, name } = permission;
      let roleName = name.split('_')[0].toUpperCase();
      if (!acc[roleName]) acc[roleName] = [];
      acc[roleName].push({ id, name });
      return acc;
    }, {});

    return Object.keys(groupedPermissions).map(role => ({
      roleWithPermissions: {
        roleName: role,
        permissions: groupedPermissions[role].reduce((acc, { id, name }) => {
          acc[id] = {
            name,
            checked: !!(assignedPermissions[id] && assignedPermissions[id].name === name),
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
