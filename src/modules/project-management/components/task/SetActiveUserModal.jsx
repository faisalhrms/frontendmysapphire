import React, { useState, useEffect } from 'react';
import Avatar from "@components/Avatar.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import { FiSearch, FiX, FiCheck } from "react-icons/fi";

const SetActiveUserModal = ({
                                isOpen,
                                onClose,
                                taskId,
                                taskName,
                                users = [],
                                currentActiveUserIds = [],
                                onUpdate
                            }) => {
    const [selectedUserIds, setSelectedUserIds] = useState(currentActiveUserIds || []);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredUsers(users);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredUsers(
                users.filter(user =>
                    user.full_name.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term)
                ));
        }
    }, [searchTerm, users]);

    const toggleUserSelection = (userId) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedUserIds.length === 0) {
            Notify.error('Please select at least one user to set as active');
            return;
        }

        setIsLoading(true);
        try {
            const updates = users.map((user) => ({
                user_id: user.id,
                is_active: selectedUserIds.includes(user.id)
            }));

            const response = await api.post(`/pms/tasks/${taskId}/set-active-user/`, {
                updates
            });

            Notify.success(response.data.message || 'Active users updated');
            onUpdate?.();
            onClose();
        } catch (error) {
            Notify.error(error.response?.data?.message ?? 'An error occurred while updating active users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedUserIds(currentActiveUserIds || []);
        setSearchTerm('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"/>
            <div className="relative bg-white dark:bg-bodybg rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all">
                <div className="flex items-center justify-between p-6 border-b border-defaultborder">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Set Active Users
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {taskName}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        {/* Search Bar */}
                        <div className="relative mb-4">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <FiX className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                        <div className="mb-4">
                            {filteredUsers.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    {users.length === 0 ? (
                                        <>
                                            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                                                <FiX className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <p>No users assigned to this task</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                                                <FiSearch className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <p>No users found matching "{searchTerm}"</p>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {filteredUsers.map((user) => (
                                        <label
                                            key={user.id}
                                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                                selectedUserIds.includes(user.id)
                                                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                    : 'border-defaultborder'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                name="activeUser"
                                                value={user.id}
                                                checked={selectedUserIds.includes(user.id)}
                                                onChange={() => toggleUserSelection(user.id)}
                                                className="sr-only"
                                            />

                                            <div className="flex items-center flex-1">
                                                <Avatar
                                                    avatar={user.avatar}
                                                    size="sm"
                                                    full_name={user.full_name}
                                                />
                                                <div className="ml-3 flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {toTitleCase(user.full_name)}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {user.email}
                                                    </p>
                                                </div>

                                                {selectedUserIds.includes(user.id) && (
                                                    <div className="flex items-center">
                                                        <FiCheck className="w-5 h-5 text-primary" />
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-end px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-defaultborder rounded-b-lg">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mr-3"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || selectedUserIds.length === 0 || users.length === 0}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                                isLoading || selectedUserIds.length === 0 || users.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary/90'
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </div>
                            ) : (
                                'Set Active Users'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SetActiveUserModal;