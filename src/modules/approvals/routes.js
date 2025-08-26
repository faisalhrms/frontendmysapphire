import TaskApprovalList from '@modules/approvals/task/views/TaskApprovalList.jsx';
import ObjectiveApprovalList from "@modules/approvals/objective/views/ObjectiveApprovalList.jsx";
import DynamiceFormApprovalList from "@modules/approvals/dynamiceform/view/DynamiceFormApprovalList.jsx";
import CreateDynamicFormApproval from "@modules/approvals/dynamiceform/view/CreateDynamiceFormApproval.jsx";

export const APPROVAL_ROUTES = {
    TASK: {
        path: '/module/approvals/task',
        permission: 'pms.manage_task_approvals',
    },
    OBJECTIVE:{
        path:'/module/approvals/objective'
    },
    DYNAMICE:{
        path:'/module/approvals/dynamice_form'
    },

    DYNAMICEFORMBUILDER:{
        path:'/module/approvals/dynamice_create'
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
        component:ObjectiveApprovalList
    },
    {
        path: APPROVAL_ROUTES.DYNAMICE.path,
        component:DynamiceFormApprovalList,
    },
    {
        path: APPROVAL_ROUTES.DYNAMICEFORMBUILDER.path,
        component:CreateDynamicFormApproval,
    }
];
