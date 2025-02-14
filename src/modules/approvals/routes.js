export const APPROVAL_ROUTES = {
    TASK: {
        path: '/module/approvals/task',
        permission: 'manage_task_approvals',

},
}

export const MODULE_ROUTES = [
    {
        path: APPROVAL_ROUTES.TASK.path,
        component: () => import(`@modules/approvals/task/views/TaskApprovalList.jsx`),
        permission:APPROVAL_ROUTES.TASK.permission,
    }
];