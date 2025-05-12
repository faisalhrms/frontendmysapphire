import React, { useMemo, useState, useCallback } from 'react';
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import { Link } from "react-router-dom";

const yesNoNA = (value) => (value == null ? 'N/A' : value ? 'Yes' : 'No');

const UserManagementTable = ({ users }) => {
    // Compute all IDs to expand by default
    const allIds = useMemo(() => {
        const ids = new Set();
        const collect = (node) => {
            const id = node.id || node.user.emp_code;
            ids.add(id);
            if (node.children) node.children.forEach(collect);
        };
        users.forEach(collect);
        return ids;
    }, [users]);

    const [expandedIds, setExpandedIds] = useState(() => new Set(allIds));

    const toggleExpand = useCallback((id) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    // Flatten the tree into a list with depth info
    const flattened = useMemo(() => {
        const list = [];
        const walk = (node, depth = 0, ancestors = []) => {
            const id = node.id || node.user.emp_code;
            list.push({ node, depth, ancestors });
            if (node.children && node.children.length > 0 && expandedIds.has(id)) {
                node.children.forEach(child => walk(child, depth + 1, [...ancestors, id]));
            }
        };
        users.forEach(u => walk(u));
        return list;
    }, [users, expandedIds]);

    return (
        <div className="table-responsive">
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                <tr>
                    <th className="border border-gray-300 px-2 py-1">Actions</th>
                    <th className="border border-gray-300 px-2 py-1">Full Name</th>
                    <th className="border border-gray-300 px-2 py-1">Email</th>
                    <th className="border border-gray-300 px-2 py-1">Email Host</th>
                    <th className="border border-gray-300 px-2 py-1">ERP User</th>
                    <th className="border border-gray-300 px-2 py-1">One Drive</th>
                    <th className="border border-gray-300 px-2 py-1">MS Team</th>
                    <th className="border border-gray-300 px-2 py-1">Subscriptions</th>
                </tr>
                </thead>
                <tbody>
                {flattened.map(({ node, depth, ancestors }) => {
                    // hide if any ancestor is collapsed
                    if (ancestors.some(a => !expandedIds.has(a))) return null;
                    const id = node.id || node.user.emp_code;
                    const hasChildren = node.children && node.children.length > 0;
                    return (
                        <tr key={id}>
                            <td className="border border-gray-300 px-2 py-1">
                                <div className="flex space-x-2">
                                    {node.id ? (
                                        <Link to={`/module/user-management/edit/${node.id}`}>
                                            <button className="ti-btn ti-btn-primary ti-btn-sm">
                                                <i className="ri-edit-line" />
                                            </button>
                                        </Link>
                                    ) : (
                                        <Link to={`/module/user-management/create/${node.user.id}?full_name=${encodeURIComponent(node.user.full_name)}&email=${encodeURIComponent(node.user.email)}`}>
                                            <button className="ti-btn ti-btn-success ti-btn-sm">
                                                <i className="ri-add-line" />
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </td>
                            <td className="border border-gray-300 px-2 py-1 flex items-center" style={{ paddingLeft: depth * 16 }}>
                                {hasChildren && (
                                    <button onClick={() => toggleExpand(id)} className="mr-2 focus:outline-none">
                                        {expandedIds.has(id) ? '▼' : '▶'}
                                    </button>
                                )}
                                <span>{node.user.full_name}</span>
                            </td>
                            <td className="border border-gray-300 px-2 py-1">{node.user.email}</td>
                            <td className="border border-gray-300 px-2 py-1">{yesNoNA(node.email_host)}</td>
                            <td className="border border-gray-300 px-2 py-1">{yesNoNA(node.erp_user)}</td>
                            <td className="border border-gray-300 px-2 py-1">{yesNoNA(node.one_drive)}</td>
                            <td className="border border-gray-300 px-2 py-1">{yesNoNA(node.ms_team)}</td>
                            <td className="border border-gray-300 px-2 py-1">
                                {node.subscriptions.length ? (
                                    node.subscriptions.map((sub, i) => (
                                        <span key={i} className="badge bg-primary/10 text-primary me-1">
                        {toTitleCase(sub.name)}
                      </span>
                                    ))
                                ) : (
                                    <span>None</span>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default React.memo(UserManagementTable);

