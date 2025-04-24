import React, { useState, useEffect } from 'react';
import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import FormButton from "@components/form/FormButton.jsx";


const customGlobalFilter = (rows, id, filterValue) => {
  if (!filterValue) return rows;

  const searchTerm = filterValue.toLowerCase().replace(/[\s_]/g, ''); // Remove spaces and underscores from search term

  return rows.filter(row => {
    const { roleName, permissions } = row.original.roleWithPermissions || {};

    // Normalize role name (app name) for comparison (remove spaces and underscores)
    const normalizedRoleName = roleName?.toLowerCase().replace(/[\s_]/g, '');
    const roleMatches = normalizedRoleName.includes(searchTerm);

    // Check if permission name matches the search term
    const permissionMatches = Object.values(permissions || {}).some(permission => {
      // Normalize permission name for comparison (remove spaces and underscores)
      const normalizedPermissionName = permission.name.toLowerCase().replace(/[\s_]/g, '');
      return normalizedPermissionName.includes(searchTerm);
    });

    // If either roleName or permission name matches, return true
    return roleMatches || permissionMatches;
  });
};


export const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <span>
      <input
        value={filter || ''}
        onChange={(e) => setFilter(e.target.value)}
        className="form-control mb-4"
        placeholder="Search..."
      />
    </span>
  );
};

const PermissionTable = ({ columns, data, onUpdatePermissions, onSavePermissions,isSubmitting }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [localData, setLocalData] = useState(data);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: localData,

      globalFilter: customGlobalFilter,
      autoResetGlobalFilter: false,
    },
    useGlobalFilter,
    useSortBy,
  
    usePagination
  );

  const { globalFilter } = state;

  const handleMasterCheckboxChange = (roleName, isChecked) => {
    setLocalData(prevData =>
      prevData.map(row => {
        if (row.roleWithPermissions.roleName === roleName) {
          const updatedPermissions = Object.keys(row.roleWithPermissions.permissions).reduce((acc, id) => {
            acc[id] = { ...row.roleWithPermissions.permissions[id], checked: isChecked };
            return acc;
          }, {});
          return {
            ...row,
            roleWithPermissions: {
              ...row.roleWithPermissions,
              permissions: updatedPermissions,
            },
          };
        }
        return row;
      })
    );
    if (onUpdatePermissions) onUpdatePermissions(localData);
  };

  const handleCheckboxChange = (roleName, id, checked) => {
    setLocalData(prevData =>
      prevData.map(row => {
        if (row.roleWithPermissions.roleName === roleName) {
          return {
            ...row,
            roleWithPermissions: {
              ...row.roleWithPermissions,
              permissions: {
                ...row.roleWithPermissions.permissions,
                [id]: {
                  ...row.roleWithPermissions.permissions[id],
                  checked: checked,
                },
              },
            },
          };
        }
        return row;
      })
    );
  };

  useEffect(() => {
    if (onUpdatePermissions) {
      onUpdatePermissions(localData);
    }
  }, [localData, onUpdatePermissions]);

  return (
    <>
      <div className="flex items-center justify-between pt-4 w-full">
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>


        <div
            className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">

          <FormButton isLoading={isSubmitting} onClick={() => onSavePermissions()}  />
        </div>

      </div>
      <div className="xl:col-span-6 col-span-12">
        <div className="custom box">
          <div className="table-responsive max-h-96 overflow-y-auto">
            <table className="table whitespace-nowrap min-w-full" {...getTableProps()}>
              <thead className="sticky top-0 bg-white z-10">
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={`header-group-${headerGroup.id}`} className="border-b border-defaultborder">
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()} key={`column-${column.id}`} className="text-start p-2">
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.length > 0 ? (
                  page.map(row => {
                    prepareRow(row);
                    const { roleName, permissions } = row.original.roleWithPermissions || {};
                    return (
                      <React.Fragment key={roleName}>
                        <tr className="bg-info/10 border-b border-defaultborder">
                          <td className="text-start p-2 font-bold">{roleName}</td>
                          <td className="text-start p-2">
                            <div className="custom-toggle-switch flex items-center">
                              <input
                                id={`toggleswitch_${roleName}`}
                                type="checkbox"
                                checked={Object.values(permissions || {}).every(p => p.checked)}
                                onChange={(e) => handleMasterCheckboxChange(roleName, e.target.checked)}
                              />
                              <label htmlFor={`toggleswitch_${roleName}`} className="label-info"></label>
                            </div>
                          </td>
                        </tr>
                        {Object.keys(permissions || {}).map(id => (
                            <tr key={id} className="border-b border-defaultborder">
                              <td className="text-start pl-6 p-2">
                                {permissions[id].name}
                              </td>
                              <td className="text-start p-2">
                                <input
                                    type="checkbox"
                                    checked={permissions[id].checked}
                                    onChange={(e) => handleCheckboxChange(roleName, id, e.target.checked)}
                                />
                              </td>
                            </tr>
                        ))}


                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center p-2">No results found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PermissionTable;
