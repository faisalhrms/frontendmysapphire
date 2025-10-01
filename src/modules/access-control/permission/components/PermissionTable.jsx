import React, { useState } from 'react';
import FormButton from "@components/form/FormButton.jsx";

const GlobalFilter = ({ filter, setFilter }) => {
    return (
        <span>
      <input
          value={filter || ''}
          onChange={(e) => setFilter(e.target.value)}
          className="form-control mb-4"
          placeholder="Search Here..."
      />
    </span>
    );
};

const PermissionTable = ({ columns, data, isSubmitting, onUpdatePermissions, onSavePermissions }) => {
    const [search, setSearch] = useState("");

    const handleCheckboxChange = (roleName, permissionId) => {
        const updated = data.map(group => {
            if (group.roleWithPermissions.roleName === roleName) {
                return {
                    ...group,
                    roleWithPermissions: {
                        ...group.roleWithPermissions,
                        permissions: {
                            ...group.roleWithPermissions.permissions,
                            [permissionId]: {
                                ...group.roleWithPermissions.permissions[permissionId],
                                checked: !group.roleWithPermissions.permissions[permissionId].checked
                            }
                        }
                    }
                };
            }
            return group;
        });
        onUpdatePermissions(updated);
    };

    const handleMasterCheckboxChange = (roleName, isChecked) => {
        const updated = data.map(group => {
            if (group.roleWithPermissions.roleName === roleName) {
                const updatedPermissions = Object.fromEntries(
                    Object.entries(group.roleWithPermissions.permissions).map(([permId, perm]) => [
                        permId,
                        { ...perm, checked: isChecked }
                    ])
                );
                return {
                    ...group,
                    roleWithPermissions: {
                        ...group.roleWithPermissions,
                        permissions: updatedPermissions
                    }
                };
            }
            return group;
        });

        onUpdatePermissions(updated);
    };


    const filteredData = data
        .map(group => {
            const filteredPermissions = Object.fromEntries(
                Object.entries(group.roleWithPermissions.permissions).filter(([_, perm]) =>
                    perm.codename.toLowerCase().includes(search.toLowerCase()) ||
                    perm.name.toLowerCase().includes(search.toLowerCase())
                )
            );
            return {
                ...group,
                roleWithPermissions: {
                    ...group.roleWithPermissions,
                    permissions: filteredPermissions
                }
            };
        })
        .filter(group =>
            group.roleWithPermissions.roleName.toLowerCase().includes(search.toLowerCase()) ||
            Object.keys(group.roleWithPermissions.permissions).length > 0
        );

    return (
        <div>
            <div className="flex items-center justify-between w-full">
                <GlobalFilter filter={search} setFilter={setSearch} />
                <div className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
                    <FormButton isLoading={isSubmitting} onClick={() => onSavePermissions()} />
                </div>
            </div>

            {filteredData.length > 0 ? (
                filteredData.map((group) => {
                    const { roleName, permissions } = group.roleWithPermissions;
                    const allChecked =
                        Object.values(permissions || {}).length > 0 &&
                        Object.values(permissions).every(p => p.checked);
                    return (
                        <div key={roleName} className="mb-6">
                            <div className="flex items-center justify-between bg-gray-200 px-4 py-2 font-semibold border border-gray-200  dark:text-gray-200 dark:bg-bodybg">
                                <span>{roleName}</span>
                                <div className="flex items-center">
                                    <label
                                        htmlFor={`toggleswitch_${roleName}`}
                                        className="flex items-center cursor-pointer"
                                    >
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                id={`toggleswitch_${roleName}`}
                                                checked={allChecked}
                                                onChange={(e) =>
                                                    handleMasterCheckboxChange(roleName, e.target.checked)
                                                }
                                                className="sr-only"
                                            />
                                            <div className="block w-12 h-6 bg-gray-500 rounded-full"></div>
                                            <div
                                                className={`dot absolute left-1 top-1 w-4 h-4 rounded-full transition 
                        ${allChecked ? "translate-x-6 bg-success" : "bg-white"}`}
                                            ></div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <table className="min-w-full border border-gray-200">
                                <thead>
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th
                                            key={idx}
                                            className={`border px-4 py-2 ${
                                                col.Header === "Action" ? "text-center" : "text-left"
                                            }`}
                                        >
                                            {col.Header}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {Object.entries(permissions).map(([id, perm]) => (
                                    <tr key={id}>
                                        <td className="border px-4 py-2">{perm.codename}</td>
                                        <td className="border px-4 py-2">{perm.name}</td>
                                        <td className="border px-4 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={perm.checked}
                                                onChange={() => handleCheckboxChange(roleName, id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-500 text-center mt-6">No results found</p>
            )}
        </div>
    );
};

export default PermissionTable;
