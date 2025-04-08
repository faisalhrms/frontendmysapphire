import React, { useMemo, useState } from 'react';
import { getExcerptFromText, toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses, getStatusClasses } from "@helpers/badges.js";
import { formatDate } from "@helpers/dateTime.js";
import AvatarList from "@components/AvatarList.jsx";
import { Link } from "react-router-dom";
import Tooltip from '@components/Tooltip.jsx';
import Avatar from "@components/Avatar.jsx";
import ProgressBar from "@components/ProgressBar.jsx";

/**
 * Utility to return 'Yes'/'No'/'N/A' for boolean or null fields
 */
const yesNoNA = (value) => {
    if (value === null || typeof value === 'undefined') return "N/A";
    return value ? "Yes" : "No";
};

const UserManagementTable = ({ users }) => {
    const [activeUserId, setActiveUserId] = useState(null); // To track expanded users
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Toggle the visibility of sub-users (direct reports)
    const toggleSubUsers = (userId) => {
        setActiveUserId((prevId) => (prevId === userId ? null : userId));
    };

    const sortedUsers = useMemo(() => {
        let sortableUsers = [...users];

        if (sortConfig.key !== null) {
            sortableUsers.sort((a, b) => {
                const aVal = a?.[sortConfig.key];
                const bVal = b?.[sortConfig.key];

                if (aVal < bVal) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortableUsers;
    }, [users, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIconAndClass = (key) => {
        if (sortConfig.key === key) {
            return {
                icon: sortConfig.direction === 'asc' ? '↑' : '↓',
                className: 'text-dark',
            };
        }
        return {
            icon: '⇅',
            className: 'text-gray-500',
        };
    };

    // Recursive function to render users and their direct reports
    const renderRow = (data, indentLevel = 0) => {
        const rowId = `row-${data.id}`;
        const hasChildren = data.children && data.children.length > 0;

        return (
            <React.Fragment key={data.id}>
                <tr className="border-b border-defaultborder">
                    {/* Actions column */}
                    <td>
                        <div className="flex space-x-2">
                            {data.id ? (
                                <Link to={`/module/user-management/edit/${data.id}`}>
                                    <button className="ti-btn ti-btn-primary ti-btn-sm">
                                        <i className="ri-edit-line"></i>
                                    </button>
                                </Link>
                            ) : (
                                <Link to={`/module/user-management/create/${data.user.id}`}>
                                    <button className="ti-btn ti-btn-success ti-btn-sm">
                                        <i className="ri-add-line"></i>
                                    </button>
                                </Link>
                            )}
                        </div>
                    </td>

                    {/* User details columns */}
                    <td>{data.user?.full_name}</td>
                    <td>{data.user?.email}</td>
                    <td>{yesNoNA(data.email_host)}</td>
                    <td>{yesNoNA(data.erp_user)}</td>
                    <td>{yesNoNA(data.one_drive)}</td>
                    <td>{yesNoNA(data.ms_team)}</td>
                    <td>
                        {data.subscriptions?.length > 0 ? (
                            data.subscriptions.map((sub, idx) => (
                                <span key={idx} className="badge bg-primary/10 text-primary me-1">
                                    {toTitleCase(sub.name)}
                                </span>
                            ))
                        ) : (
                            <span>None</span>
                        )}
                    </td>
                </tr>

                {/* Render children (recursive) */}
                {hasChildren && (
                    <tr>
                        <td colSpan="100%">
                            <div className="flex items-center cursor-pointer" onClick={() => toggleSubUsers(data.id)}>
                                <svg
                                    className={`w-4 h-4 mr-2 cursor-pointer text-dark ${activeUserId === data.id ? 'transform rotate-90' : ''}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                                <span>Direct Reports</span>
                            </div>
                            {activeUserId === data.id && (
                                <UserManagementTable users={data.children} />
                            )}
                        </td>
                    </tr>
                )}
            </React.Fragment>
        );
    };

    return (
        <>
            <div className="table-responsive task-table">
                <table className="table whitespace-nowrap table-bordered min-w-full">
                    <thead>
                    <tr className="border-b border-defaultborder">
                        {/* Actions */}
                        <th scope="col">Actions</th>

                        {/* New columns */}
                        <th
                            scope="col"
                            onClick={() => requestSort('user_full_name')}
                            className="cursor-pointer"
                        >
                            Full Name
                            <span className={`ml-1 ${getSortIconAndClass('user_full_name').className}`}>
                                {getSortIconAndClass('user_full_name').icon}
                            </span>
                        </th>
                        <th
                            scope="col"
                            onClick={() => requestSort('user_email')}
                            className="cursor-pointer"
                        >
                            Email
                            <span className={`ml-1 ${getSortIconAndClass('user_email').className}`}>
                                {getSortIconAndClass('user_email').icon}
                            </span>
                        </th>
                        <th scope="col">Email Host</th>
                        <th scope="col">ERP User</th>
                        <th scope="col">One Drive</th>
                        <th scope="col">MS Team</th>
                        <th scope="col">Subscriptions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedUsers.map((data) => renderRow(data))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default React.memo(UserManagementTable);
