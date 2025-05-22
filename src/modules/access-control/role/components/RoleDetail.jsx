import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '@config/axiosConfig';
import Notify from '@helpers/toastNotifications';
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const RoleDetail = () => {
    const [searchParams] = useSearchParams();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ids = searchParams.get('ids')?.split(',') || [];
                const params = new URLSearchParams();

                if (ids.includes('0')) {
                    // Handle "Select All" case
                    params.append('group_id', '0');
                } else {
                    // Add multiple group_id parameters
                    ids.forEach(id => params.append('group_id', id));
                }

                // Add pagination parameters if needed
                params.append('skip', '0');
                params.append('limit', '100');

                const response = await api.get(`/groups/permissions/?${params.toString()}`);
                setRoles(response.data.rows);
            } catch (error) {
                Notify.error(error.response?.data?.message || 'Error loading role details');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [searchParams]);

    if (loading) return <LoadingSpinner/>;
    if (!roles.length) return <div className="text-center p-4">No roles found</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <PageHeader title={roles.length > 1 ? "Multiple Role Details" : "Role Details"} />

            <div className="space-y-8">
                {roles.map(role => (
                    <div key={role.id} className="bg-white shadow-lg rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b">
                            <h2 className="text-2xl font-semibold text-gray-800">
                               Role Name: {role.name}
                                <span className="text-sm ml-2 text-gray-500 font-normal">(ID: {role.id})</span>
                            </h2>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 p-6">
                            {/* Permissions Section */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                                    Permissions ({role.permissions.length})
                                </h3>
                                <div className="overflow-x-auto rounded-lg border">
                                    <table className="ti-custom-table">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="!px-4">Name</th>
                                            <th className="!px-4">Codename</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {role.permissions.map(perm => (
                                            <tr key={perm.id} className="hover:bg-gray-50">
                                                <td className="!px-4">{perm.name}</td>
                                                <td className="!px-4 font-mono text-sm text-gray-600">
                                                    {perm.codename}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                {!role.permissions.length && (
                                    <div className="text-center py-4 text-gray-500">
                                        No permissions assigned
                                    </div>
                                )}
                            </div>

                            {/* Users Section */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                                    Users ({role.users.length})
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
                                        {role.users.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="!px-4">{user.full_name}</td>
                                                <td className="!px-4 text-gray-600">{user.email}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                {!role.users.length && (
                                    <div className="text-center py-4 text-gray-500">
                                        No users assigned
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

export default RoleDetail;