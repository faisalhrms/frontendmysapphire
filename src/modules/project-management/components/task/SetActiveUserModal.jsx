import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Avatar from "@components/Avatar.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

const SetActiveUserModal = ({
                                isOpen,
                                onClose,
                                taskId,
                                taskName,
                                users = [],
                                currentActiveUserId = null,
                                onUpdate
                            }) => {
    const [selectedUserId, setSelectedUserId] = useState(currentActiveUserId);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedUserId) {
            toast.error('Please select a user to set as active');
            return;
        }
        setIsLoading(true);
        try {
            const response = await api.post(`/pms/tasks/${taskId}/set-active-user/`, {
                user_id: selectedUserId,
                is_active: true
            });
            Notify.success(response.data.message);
            if (onUpdate){
                onUpdate();
            }
        } catch (error) {
            Notify.error(error.response?.data?.message ?? 'An error occurred while updating active use');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedUserId(currentActiveUserId);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-bodybg rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-defaultborder">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Set Active User
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {taskName}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Select Active User
                            </label>

                            {users.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                    <p>No users assigned to this task</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {users.map((user) => (
                                        <label
                                            key={user.id}
                                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                                selectedUserId === user.id
                                                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                    : 'border-defaultborder'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="activeUser"
                                                value={user.id}
                                                checked={selectedUserId === user.id}
                                                onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
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

                                                {selectedUserId === user.id && (
                                                    <div className="flex items-center">
                                                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
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
                            disabled={isLoading || !selectedUserId || users.length === 0}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                                isLoading || !selectedUserId || users.length === 0
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
                                'Set Active User'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SetActiveUserModal;