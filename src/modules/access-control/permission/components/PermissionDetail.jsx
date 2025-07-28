import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '@config/axiosConfig';
import Notify from '@helpers/toastNotifications';
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const PermissionDetail = () => {
    const [searchParams] = useSearchParams();
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ids = searchParams.get('ids')?.split(',') || [];
                const params = new URLSearchParams();

                if (ids.includes('0')) {
                    params.append('permission_id', '0');
                } else {
                    ids.forEach(id => params.append('permission_id', id));
                }
                params.append('skip', '0');
                params.append('limit', '100');

                const response = await api.get(`/permissions/groups/?${params.toString()}`);
                setPermissions(response.data.rows);
            } catch (error) {
                Notify.error(error.response?.data?.message || 'Error loading permission details');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [searchParams]);

    if (loading) return <LoadingSpinner/>;
    if (!permissions.length) return <div className="text-center p-4">No permissions found</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <PageHeader title={permissions.length > 1 ? "Multiple Permission Details" : "Permission Details"} />

            <div className="space-y-8">
                {permissions.map(permission => (
                    <div key={permission.id} className="bg-white shadow-lg rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b">
                            <h2 className="text-2xl font-semibold text-gray-800">
                               Permission Name: {permission.name}
                                <span className="text-sm ml-2 text-gray-500 font-normal">(ID: {permission.id})</span>
                            </h2>
                            <code className="text-sm text-gray-600 mt-1 block">
                                {permission.codename}
                            </code>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 p-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                                    Assigned Roles ({permission.groups.length})
                                </h3>
                                <div className="overflow-x-auto rounded-lg border">
                                    <table className="ti-custom-table">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="!px-4">Role Name</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {permission.groups.map(role => (
                                            <tr key={role.id} className="hover:bg-gray-50">
                                                <td className="!px-4">{role.name}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                {!permission.groups.length && (
                                    <div className="text-center py-4 text-gray-500">
                                        Not assigned to any roles
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                                    Assigned Users ({permission.users.length})
                                </h3>
                                <div className="overflow-x-auto rounded-lg border">
                                    <table className="ti-custom-table">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="!px-4">Name</th>
                                            <th className="!px-4">Email</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {permission.users.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="!px-4">{user.full_name}</td>
                                                <td className="!px-4 text-gray-600">{user.email}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                {!permission.users.length && (
                                    <div className="text-center py-4 text-gray-500">
                                        Not assigned to any users
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PermissionDetail;