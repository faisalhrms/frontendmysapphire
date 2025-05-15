import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@modules/layouts/includes/PageHeader.jsx';
import IconTabs from '@components/IconTabs.jsx';
import DataTable from '@components/DataTable.jsx';
import { getBadgeClasses } from '@helpers/badges.js';
import { toTitleCase } from '@helpers/formatters.js';
import { useFetchWithFilters } from '@hooks/useFetchWithFilters.js';

const ApprovalManagementList = () => {
    const [activeTab, setActiveTab] = useState('all');
    const baseColumns = useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'user.full_name',
                Cell: ({ row }) => {
                    const name = row.original.user.full_name || '—';
                    if (activeTab === 'under_process' && row.original.id) {
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

            // ─── New Columns ───────────────────────────────────────────────────────────
            {
                Header: 'Email Host',
                accessor: 'email_host',
                Cell: ({ cell: { value } }) => (
                    <span className="badge bg-secondary/10 text-secondary">
          {value?.toUpperCase() || '—'}
        </span>
                ),
            },
            {
                Header: 'ERP User',
                accessor: 'erp_user',
                Cell: ({ cell: { value } }) => (
                    <span

                    >
          {value ? 'Yes' : 'No'}
        </span>
                ),
            },
            {
                Header: 'OneDrive',
                accessor: 'one_drive',
                Cell: ({ cell: { value } }) => (
                    <span

                    >
          {value ? 'Yes' : 'No'}
        </span>
                ),
            },
            {
                Header: 'MS Teams',
                accessor: 'ms_team',
                Cell: ({ cell: { value } }) => (
                    <span

                    >
          {value ? 'Yes' : 'No'}
        </span>
                ),
            },
            {
                Header: 'Backup Storage',
                accessor: 'backup_storage',
                Cell: ({ cell: { value } }) => (
                    <span>
          {value != null ? `${value} GB` : '—'}
        </span>
                ),
            },
            // ─────────────────────────────────────────────────────────────────────────

            {
                Header: 'Subscriptions',
                accessor: 'subscriptions',
                disableSortBy: true,
                Cell: ({ value }) =>
                    Array.isArray(value) && value.length ? (
                        <div className="space-x-1 rtl:space-x-reverse">
                            {value.map(sub => (
                                <span
                                    key={sub.id}
                                    className="badge bg-primary/10 text-primary"
                                >
                {toTitleCase(sub.name)}
              </span>
                            ))}
                        </div>
                    ) : (
                        '—'
                    ),
            },
            {
                Header: 'Approver',
                accessor: 'approver.full_name',
                Cell: ({ row }) => row.original.approver?.full_name || '—',
            },
            {
                Header: 'Status',
                accessor: 'approval_status',
                Cell: ({ value }) => (
                    <span className={getBadgeClasses(value)}>
          {toTitleCase(value)}
        </span>
                ),
            },
        ],
        [activeTab]
    );


    const assignedColumns = useMemo(() => {
        const formatHeader = field =>
            field.replace('assigned_', '')
                .split('_')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');

        return [
            baseColumns[0],
            baseColumns[1],
            ...[
                'assigned_email_host',
                'assigned_erp_user',
                'assigned_one_drive',
                'assigned_ms_team',
                'assigned_backup_storage',
                'assigned_subscriptions',
            ].map(field => ({
                Header: `Assigned ${formatHeader(field)}`,
                accessor: field,
                disableSortBy: true,
                Cell: ({ value }) => (value ? <i className="bx bx-check text-green text-lg" /> : <i className="bx bx-x text-red text-lg" />),
            })),
        ];
    }, [baseColumns, activeTab]);

    const handleTabChange = useCallback(tabId => {
        setActiveTab(tabId);
    }, []);

    return (
        <>
            <PageHeader currentpage="Approval Management" mainpage="Approval Management" />

            <IconTabs
                tabs={[
                    {
                        id: 'all',
                        label: 'All',
                        icon: <i className="bx bx-list-ul" />,
                        content: (
                            <DataTable
                                title="Approval Management"
                                apiUrl='/employee-details/approvals-all/'
                                columns={baseColumns}
                            />
                        ),
                    },
                    {
                        id: 'under_process',
                        label: 'Under Process',
                        icon: <i className="bx bx-check-circle" />,
                        content: (
                            <DataTable
                                title="Under Process"
                                apiUrl='/employee-details/approvals-all/under_process/'
                                columns={baseColumns}
                            />
                        ),
                    },
                    {
                        id: 'pending',
                        label: 'Pending',
                        icon: <i className="bx bx-time" />,
                        content: (
                            <DataTable
                                title="Pending Approvals"
                                apiUrl='/employee-details/approvals-all/pending/'
                                columns={baseColumns}
                            />
                        ),
                    },
                    {
                        id: 'assigned',
                        label: 'Assigned',
                        icon: <i className="bx bx-link-alt" />,
                        content: (
                            <DataTable
                                title="Assigned Approvals"
                                apiUrl='/employee-details/approvals-all/assigned/'
                                columns={assignedColumns}
                            />
                        ),
                    },
                ]}
                onTabChange={handleTabChange}
            />
        </>
    );
};

export default ApprovalManagementList;
