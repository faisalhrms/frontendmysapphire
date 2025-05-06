// apps/subscription/views/ApprovalManagementList.jsx
import React, { useState, useMemo } from 'react';
import PageHeader from '@modules/layouts/includes/PageHeader.jsx';
import IconTabs from '@components/IconTabs.jsx';
import DataTable from '@components/DataTable.jsx';
import { getBadgeClasses } from '@helpers/badges.js';
import { toTitleCase } from '@helpers/formatters.js';

const ApprovalManagementList = () => {
    const [activeTab, setActiveTab] = useState('all');

    // Define endpoints for each status
    const endpoints = useMemo(
        () => ({
            all:      '/employee-details/approvals-all/',
            approved: '/employee-details/approvals-all/approved/',
            pending:  '/employee-details/approvals-all/pending/',
            rejected: '/employee-details/approvals-all/rejected/',
        }),
        []
    );

    // Shared columns for the DataTable
    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'user.full_name',
                Cell: ({ row }) => row.original.user.full_name || '—',
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
                            ? value.map((sub) => (
                                <span key={sub.id} className="badge bg-primary/10 text-primary">
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
        ],
        []
    );

    // Tab definitions
    const tabs = useMemo(
        () => [
            { id: 'all',      label: 'All' },
            { id: 'approved', label: 'Approved' },
            { id: 'pending',  label: 'Pending' },
            { id: 'rejected', label: 'Rejected' },
        ],
        []
    );

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
                    // no custom icon
                    content: (
                        <DataTable
                            columns={columns}
                            title="Approval Management"
                            apiUrl={endpoints[id]}
                        />
                    ),
                }))}
                onTabChange={setActiveTab}
            />
        </>
    );
};

export default ApprovalManagementList;
