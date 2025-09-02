import TaskApprovalList from '@modules/approvals/task/views/TaskApprovalList.jsx';
import ObjectiveApprovalList from "@modules/approvals/objective/views/ObjectiveApprovalList.jsx";
import DynamicFormApprovalList from "@modules/approvals/dynamiceform/view/DynamicFormApprovalList.jsx";


export const APPROVAL_ROUTES = {
    TASK: {
        path: '/module/approvals/task',
        permission: 'pms.manage_task_approvals',
    },
    OBJECTIVE:{
        path:'/module/approvals/objective',
        permission: 'user.view_ess_modules',
    },
    FORM:{
        path:'/module/approvals/form',
        permission: 'user.view_ess_modules',
    },
};

export const MODULE_ROUTES = [
    {
        path: APPROVAL_ROUTES.TASK.path,
        component: TaskApprovalList,
        permission: APPROVAL_ROUTES.TASK.permission,
    },
    {
        path: APPROVAL_ROUTES.OBJECTIVE.path,
        component:ObjectiveApprovalList,
        permission: APPROVAL_ROUTES.OBJECTIVE.permission,
    },
    {
        path: APPROVAL_ROUTES.FORM.path,
        component:DynamicFormApprovalList,
        permission: APPROVAL_ROUTES.FORM.permission,
    },
];
