export const APPROVAL_ROUTES = {
    TASK: {
        path: '/module/approvals/task',
        permission: 'approval_task',

},



}

export const MODULE_ROUTES = [
    {
        path: APPROVAL_ROUTES.TASK.path,
        component: () => import(`/src/modules/approvals/task/views/TaskApprovalList.jsx`),
        permission:APPROVAL_ROUTES.TASK.permission,
    }
];