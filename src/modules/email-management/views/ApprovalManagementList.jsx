// apps/subscription/views/ApprovalManagementList.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@modules/layouts/includes/PageHeader.jsx';
import IconTabs from '@components/IconTabs.jsx';
import DataTable from '@components/DataTable.jsx';
import { getBadgeClasses } from '@helpers/badges.js';
import { toTitleCase } from '@helpers/formatters.js';

const ApprovalManagementList = () => {
    const [activeTab, setActiveTab] = useState('approvals-all');
console.log(`this is active tab`, activeTab);
    const endpoints = useMemo(() => ({
        all:       '/employee-details/approvals-all/',
        approved:  '/employee-details/approvals-all/approved/',
        pending:   '/employee-details/approvals-all/pending/',
        rejected:  '/employee-details/approvals-all/rejected/',
        assigned:  '/employee-details/approvals-all/assigned/',
    }), []);

    // Base columns for all/non-assigned tabs
    const baseColumns = useMemo(() => [
        {
            Header: 'Name',
            accessor: 'user.full_name',
            Cell: ({ row }) => {
                const name = row.original.user.full_name || '—';
                if (activeTab === 'approved' && row.original.id) {
                    return (
                        <Link
                            to={`/module/user-management/edit/${row.original.id}`}
                            state={{ fromApprovalList: true }}
                            className="text-primary hover:underline"
                        >
                            {name}
                        </Link>
                    );
                }
                return name;
            },
        },
        {
            Header: 'Email',
            accessor: 'user.email',
            Cell: ({ value }) => value || '—',
        },
        {
            Header: 'Subscriptions',
            accessor: 'subscriptions',
            disableSortBy: true,
            Cell: ({ value }) => (
                <div className="space-x-1 rtl:space-x-reverse">
                    {Array.isArray(value) && value.length
                        ? value.map(sub => (
                            <span
                                key={sub.id}
                                className="badge bg-primary/10 text-primary"
                            >
                  {toTitleCase(sub.name)}
                </span>
                        ))
                        : '—'}
                </div>
            ),
        },
        {
            Header: 'Approver',
            accessor: 'approver.full_name',
            Cell: ({ row }) => row.original.approver?.full_name || '—',
        },
        {
            Header: 'Approval Status',
            accessor: 'approval_status',
            Cell: ({ value }) => (
                <span className={getBadgeClasses(value)}>
          {toTitleCase(value)}
        </span>
            ),
        },
    ], [activeTab]);


    // Columns for the "Assigned" tab
    const assignedColumns = useMemo(() => {
        const formatHeader = (field) => {
            return field
                .replace('assigned_', '')       // Remove prefix
                .split('_')                     // Split by underscore
                .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each part
                .join(' ');                     // Join with space
        };

        return [
            {
                Header: 'Name',
                accessor: 'user.full_name',
                Cell: ({ row }) => {
                    const name = row.original.user.full_name || '—';
                    if (activeTab === 'assigned' && row.original.id) {
                        return (
                            <Link
                                to={`/module/user-management/edit/${row.original.id}`}
                                state={{ fromApprovalList: true }}
                                className="text-primary hover:underline"
                            >
                                {name}
                            </Link>
                        );
                    }
                    return name;
                },
            },
            {
                Header: 'Email',
                accessor: 'user.email',
                Cell: ({ value }) => value || '—',
            },
            ...[
                'assigned_email_host',
                'assigned_erp_user',
                'assigned_one_drive',
                'assigned_ms_team',
                'assigned_backup_storage',
                'assigned_subscriptions',
            ].map(fieldName => ({
                Header: `Assigned ${formatHeader(fieldName)}`,
                accessor: fieldName,
                Cell: ({ value }) =>
                    value ? <i className="bx bx-check text-green text-lg"></i> : '—',
                disableSortBy: true,
            })),
        ];
    }, []);

    const tabs = useMemo(() => [
        { id: 'all',      label: 'All' },
        { id: 'approved', label: 'Approved' },
        { id: 'pending',  label: 'Pending' },
        { id: 'rejected', label: 'Rejected' },
        { id: 'assigned', label: 'Assigned' },
    ], []);

    return (
        <>
            <PageHeader
                currentpage="Approval Management"
                mainpage="Approval Management"
            />

            <IconTabs
                tabs={tabs.map(({ id, label }) => ({
                    id,
                    label,
                    content: (
                        <DataTable
                            title={
                                id === 'assigned'
                                    ? 'Assigned Approvals'
                                    : 'Approval Management'
                            }
                            apiUrl={endpoints[id]}
                            columns={id === 'assigned' ? assignedColumns : baseColumns}
                        />
                    ),
                }))}
                onTabChange={setActiveTab}
            />
        </>
    );
};

export default ApprovalManagementList;
